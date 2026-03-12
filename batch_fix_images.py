import paramiko
import sys
import csv
import re
import requests
import os
import time

# Read credentials
sftp_info = {}
with open('sftp.txt', 'r') as f:
    for line in f:
        if ':' in line:
            key, value = line.split(':', 1)
            sftp_info[key.strip().lower()] = value.strip()

host = sftp_info.get('host')
username = sftp_info.get('username')
password = sftp_info.get('password')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    print("Connecting to SFTP...")
    client.connect(host, username=username, password=password)
    sftp = client.open_sftp()
    
    upload_base = 'public_html/wp-content/uploads/2026/03'
    # Ensure dir exists (assuming created)
    
    # 1. Get all WP posts
    print("Fetching WP posts list...")
    # Add --posts_per_page=-1 to get all posts
    cmd = 'cd public_html && wp post list --post_type=post --fields=ID,post_name --format=csv --posts_per_page=-1'
    stdin, stdout, stderr = client.exec_command(cmd)
    output = stdout.read().decode('utf-8').strip()
    
    if not output:
        print("No posts found or error.")
        sys.exit(1)
        
    wp_posts = {}
    lines = output.split('\n')
    # Header might be present if format=csv, wait wp post list csv output usually has header ID,post_name
    # But let's check first line
    start_idx = 0
    if 'ID' in lines[0] and 'post_name' in lines[0]:
        start_idx = 1
        
    for line in lines[start_idx:]:
        parts = line.split(',')
        if len(parts) >= 2:
            pid = parts[0].strip()
            slug = parts[1].strip()
            wp_posts[slug] = pid
            
    print(f"Found {len(wp_posts)} WP posts.")
    
    # 2. Read CSV and process
    csv_file = 'mageplaza_blog_post.csv'
    processed_count = 0
    updated_count = 0
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            slug = row['url_key']
            content = row['post_content']
            
            if slug not in wp_posts:
                # Maybe slug mismatch?
                # print(f"Skipping {slug} (not found in WP)")
                continue
                
            pid = wp_posts[slug]
            
            # Find media tags
            # Escaped regex for python string
            media_pattern = r'\{\{media url="([^"]+)"\}\}'
            matches = re.findall(media_pattern, content)
            
            if not matches:
                continue
                
            print(f"Processing Post {pid} ({slug}): Found {len(matches)} media tags.")
            
            replacements = {}
            has_errors = False
            
            for match in matches:
                filename = os.path.basename(match)
                source_url = f"https://www.caglasses.com/media/{match}"
                remote_path = f"{upload_base}/{filename}"
                wp_url = f"https://www.caoptical.com/wp-content/uploads/2026/03/{filename}"
                
                # Download/Upload if needed
                # We can optimize by assuming if we processed it before, it's there.
                # But let's check remote existence to be safe.
                try:
                    sftp.stat(remote_path)
                    # Exists
                except IOError:
                    print(f"  - Uploading {filename}...")
                    # Download locally first
                    try:
                        resp = requests.get(source_url, timeout=10)
                        if resp.status_code == 200:
                            with open(filename, 'wb') as f_img:
                                f_img.write(resp.content)
                            sftp.put(filename, remote_path)
                            os.remove(filename)
                        else:
                            print(f"  - Failed to download {source_url} ({resp.status_code})")
                            has_errors = True
                            # If we can't get the image, we can't fix it properly.
                            # But maybe we should replace with empty or placeholder?
                            # For now, keep the original tag? Or broken img?
                            # Let's keep original tag if download fails so we know it's still broken.
                            continue
                    except Exception as e:
                        print(f"  - Error: {e}")
                        has_errors = True
                        continue
                
                old_tag = f'{{{{media url="{match}"}}}}'
                replacements[old_tag] = wp_url
                
            if not replacements:
                continue
                
            # Apply replacements
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                
            # Update WP
            # Use temp file unique to PID to avoid collisions if we were parallel (we are not)
            temp_file = f'temp_update_{pid}.txt'
            with open(temp_file, 'w', encoding='utf-8') as f_tmp:
                f_tmp.write(new_content)
                
            sftp.put(temp_file, f'public_html/{temp_file}')
            os.remove(temp_file)
            
            cmd_update = f'cd public_html && wp post update {pid} {temp_file}'
            stdin, stdout, stderr = client.exec_command(cmd_update)
            res = stdout.read().decode('utf-8').strip()
            
            if 'Success' in res:
                print(f"  - Updated Post {pid}.")
                updated_count += 1
            else:
                print(f"  - Failed to update Post {pid}: {res} {stderr.read().decode('utf-8')}")
                
            # Clean remote temp file
            client.exec_command(f'rm public_html/{temp_file}')
            
            processed_count += 1
            # Optional: Sleep to be nice to server?
            # time.sleep(0.5)
            
    print(f"\nFinished. Processed {processed_count} posts. Updated {updated_count} posts.")
    sftp.close()
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

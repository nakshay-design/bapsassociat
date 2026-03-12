import paramiko
import sys
import csv
import re
import requests
import os

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

# Target Post ID
target_pid = '41287'
target_slug = 'advantages-of-bifocal-safety-glasses-and-the-best-recommendations-to-try'

# Source CSV
csv_file = 'mageplaza_blog_post.csv'

# Find the row in CSV
csv_row = None
with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['url_key'] == target_slug:
            csv_row = row
            break
            
if not csv_row:
    print(f"Could not find row for slug {target_slug} in CSV.")
    sys.exit(1)
    
print(f"Found CSV row for {target_slug}.")
content = csv_row['post_content']

# Find media tags
media_pattern = r'\{\{media url="([^"]+)"\}\}'
matches = re.findall(media_pattern, content)

print(f"Found {len(matches)} media tags.")

if not matches:
    print("No media tags found to fix.")
    sys.exit(0)

# Connect SFTP
try:
    print("Connecting to SFTP...")
    client.connect(host, username=username, password=password)
    sftp = client.open_sftp()
    
    upload_base = 'public_html/wp-content/uploads/2026/03'
    # Ensure dir exists (we did this in previous script, assuming it exists now)
    
    replacements = {}
    
    for match in matches:
        filename = os.path.basename(match)
        source_url = f"https://www.caglasses.com/media/{match}"
        remote_path = f"{upload_base}/{filename}"
        wp_url = f"https://www.caoptical.com/wp-content/uploads/2026/03/{filename}"
        
        print(f"Processing {filename}...")
        
        # Check if file exists remotely?
        # Ideally yes, but for now let's just try to download/upload if not sure.
        # Or better: check remote file size/existence.
        
        try:
            sftp.stat(remote_path)
            print(f"  - File exists on server: {remote_path}")
        except IOError:
            print(f"  - File missing on server. Downloading from {source_url}...")
            # Download locally
            try:
                resp = requests.get(source_url, timeout=10)
                if resp.status_code == 200:
                    with open(filename, 'wb') as f:
                        f.write(resp.content)
                    print(f"  - Downloaded. Uploading to {remote_path}...")
                    sftp.put(filename, remote_path)
                    os.remove(filename) # Cleanup
                else:
                    print(f"  - Failed to download from source. Status: {resp.status_code}")
                    continue # Skip replacement if download failed
            except Exception as e:
                print(f"  - Error downloading: {e}")
                continue
                
        # Prepare replacement
        old_tag = f'{{{{media url="{match}"}}}}'
        replacements[old_tag] = wp_url
        
    sftp.close()
    
    # Apply replacements to CSV content
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    # Check if content changed
    if new_content == content:
        print("No changes to content.")
        sys.exit(0)
        
    # Write temp file and update WP
    print("Updating WordPress post...")
    with open('temp_update_41287.txt', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    sftp = client.open_sftp()
    sftp.put('temp_update_41287.txt', 'public_html/temp_update_41287.txt')
    sftp.close()
    
    cmd_update = f'cd public_html && wp post update {target_pid} temp_update_41287.txt'
    stdin, stdout, stderr = client.exec_command(cmd_update)
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))
    
    # Cleanup
    client.exec_command('rm public_html/temp_update_41287.txt')
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

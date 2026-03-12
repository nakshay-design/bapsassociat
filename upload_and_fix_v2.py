import paramiko
import sys
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

try:
    print("Connecting to SFTP...")
    client.connect(host, username=username, password=password)
    sftp = client.open_sftp()
    
    # Target directory logic
    upload_base = 'public_html/wp-content/uploads'
    year = '2026'
    month = '03'
    
    try:
        sftp.chdir(upload_base)
    except IOError:
        print(f"Error: {upload_base} does not exist!")
        sys.exit(1)
        
    try:
        sftp.chdir(year)
    except IOError:
        print(f"Creating directory {year}...")
        sftp.mkdir(year)
        sftp.chdir(year)
        
    try:
        sftp.chdir(month)
    except IOError:
        print(f"Creating directory {month}...")
        sftp.mkdir(month)
        sftp.chdir(month)
            
    remote_dir = f"{upload_base}/{year}/{month}"
    print(f"Current remote directory: {remote_dir}")
    
    images = ['_dsc1920_1_.jpg', '_dsc1094.jpg']
    base_url = f'https://www.caoptical.com/wp-content/uploads/{year}/{month}/'
    
    for img in images:
        if os.path.exists(img):
            print(f"Uploading {img}...")
            sftp.put(img, img)
        else:
            print(f"Error: Local file {img} not found!")
            sys.exit(1)

    sftp.close()
    
    # Get post content
    print("Fetching post content...")
    cmd_get = 'cd public_html && wp post list --name="are-prescription-safety-glasses-worth-it" --field=content --post_type=post'
    stdin, stdout, stderr = client.exec_command(cmd_get)
    content = stdout.read().decode('utf-8')
    
    if not content:
        print("Error: Could not fetch post content.")
        sys.exit(1)
        
    # Replacements
    broken_tag = '<img alt="Fusion Seattle Prescription Safety Glasses Clear" />'
    
    # Image 1 (Fusion Seattle)
    # Note: Use class="alignnone size-full" or similar if needed, but simple img tag is safer to start
    new_tag_1 = f'<img src="{base_url}_dsc1920_1_.jpg" alt="Fusion Seattle Prescription Safety Glasses Clear" />'
    
    # Image 2 (Frisco Aviator)
    new_tag_2 = f'<img src="{base_url}_dsc1094.jpg" alt="Frisco Aviator Prescription Safety Glasses" />'
    
    # Apply replacements sequentially
    # 1. Replace first occurrence
    if broken_tag in content:
        new_content = content.replace(broken_tag, new_tag_1, 1)
        print("Replaced first missing image tag.")
    else:
        print("Warning: First broken tag not found!")
        new_content = content

    # 2. Replace second occurrence (which is now the first one remaining)
    if broken_tag in new_content:
        new_content = new_content.replace(broken_tag, new_tag_2, 1)
        print("Replaced second missing image tag.")
    else:
        # Check if maybe it was already fixed or different?
        pass

    if content == new_content:
        print("No changes made to content.")
    else:
        # Write to temp file
        print("Writing updated content to temp file...")
        with open('temp_content.txt', 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        # Upload temp file
        sftp = client.open_sftp()
        sftp.put('temp_content.txt', 'public_html/temp_update_post.txt')
        sftp.close()
        
        # Get Post ID
        cmd_id = 'cd public_html && wp post list --name="are-prescription-safety-glasses-worth-it" --field=ID --post_type=post'
        stdin, stdout, stderr = client.exec_command(cmd_id)
        post_id = stdout.read().decode('utf-8').strip()
        
        if post_id:
            print(f"Updating post {post_id}...")
            cmd_update = f'cd public_html && wp post update {post_id} temp_update_post.txt'
            stdin, stdout, stderr = client.exec_command(cmd_update)
            print(stdout.read().decode('utf-8'))
            print(stderr.read().decode('utf-8'))
            
            # Cleanup
            client.exec_command('rm public_html/temp_update_post.txt')
        else:
            print("Error: Could not find post ID.")
            
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

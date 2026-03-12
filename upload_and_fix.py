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
    
    # Target directory
    remote_dir = 'public_html/wp-content/uploads/2026/03'
    try:
        sftp.chdir(remote_dir)
    except IOError:
        print(f"Creating directory {remote_dir}...")
        try:
            sftp.mkdir(remote_dir)
        except IOError:
            # Maybe parent 2026 doesn't exist? Try recursive mkdir logic or just assume standard structure
            pass
            
    images = ['_dsc1920_1_.jpg', '_dsc1094.jpg']
    base_url = 'https://www.caoptical.com/wp-content/uploads/2026/03/'
    
    replacements = {}
    
    for img in images:
        local_path = img
        remote_path = f"{remote_dir}/{img}"
        
        print(f"Uploading {local_path} to {remote_path}...")
        sftp.put(local_path, remote_path)
        
        # Build replacement map
        # The content has <img alt="..." /> where src is missing.
        # But wait, I can't just replace <img alt="..." /> because alt text might be used elsewhere or not unique enough?
        # Actually, in this specific post, I know the order:
        # 1. Matrix J161 (already has image)
        # 2. Fusion Seattle (missing image 1: _dsc1920_1_.jpg)
        # 3. Frisco Aviator (missing image 2: _dsc1094.jpg - wait, looking at CSV content...)
        
        # CSV content:
        # <p dir="ltr"><img src="{{media url="wysiwyg/_dsc1920_1_.jpg"}}" alt="Fusion Seattle Prescription Safety Glasses Clear" /></p>
        # ...
        # <p dir="ltr"><img src="{{media url="wysiwyg/_dsc1094.jpg"}}" alt="Fusion Seattle Prescription Safety Glasses Clear" /></p>
        
        # WP content (current):
        # <p dir="ltr"><img alt="Fusion Seattle Prescription Safety Glasses Clear" /></p> 
        # ...
        # <p dir="ltr"><img alt="Fusion Seattle Prescription Safety Glasses Clear" /></p> 
        
        # The alt text is identical for both missing images in WP! This makes simple string replacement risky.
        # However, since I'm scripting this, I can fetch the content, split it, and replace sequentially.
        pass

    sftp.close()
    
    # Now update the post content using WP-CLI
    # I'll construct a PHP script to do this safely using regex or DOM manipulation, 
    # or just use Python to replace the content and push it back via WP-CLI update.
    
    # Let's get the content again to be sure
    cmd_get = 'cd public_html && wp post list --name="are-prescription-safety-glasses-worth-it" --field=content --post_type=post'
    stdin, stdout, stderr = client.exec_command(cmd_get)
    content = stdout.read().decode('utf-8')
    
    # We need to replace the first occurrence of the broken img tag with image 1, and the second with image 2.
    # Broken tag signature: <img alt="Fusion Seattle Prescription Safety Glasses Clear" />
    
    broken_tag = '<img alt="Fusion Seattle Prescription Safety Glasses Clear" />'
    
    # Image 1
    new_tag_1 = f'<img src="{base_url}_dsc1920_1_.jpg" alt="Fusion Seattle Prescription Safety Glasses Clear" />'
    # Image 2
    new_tag_2 = f'<img src="{base_url}_dsc1094.jpg" alt="Frisco Aviator Prescription Safety Glasses" />' # Correcting alt text for 2nd one too?
    # In the CSV, the 2nd image had the WRONG alt text ("Fusion Seattle...").
    # The text below it is "Frisco Aviator...". So I should probably fix the alt text too.
    
    # Let's replace sequentially.
    new_content = content.replace(broken_tag, new_tag_1, 1) # Replace first occurrence
    new_content = new_content.replace(broken_tag, new_tag_2, 1) # Replace second occurrence (which is now the first one left)
    
    # Now update the post
    # Using a temporary file for the content to avoid shell escaping hell
    print("Writing new content to temporary file...")
    with open('temp_content.txt', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    # Upload temp file
    sftp = client.open_sftp()
    sftp.put('temp_content.txt', 'public_html/temp_update_post.txt')
    sftp.close()
    
    # Update via WP-CLI reading from file
    # wp post update <ID> public_html/temp_update_post.txt
    # First get ID
    cmd_id = 'cd public_html && wp post list --name="are-prescription-safety-glasses-worth-it" --field=ID --post_type=post'
    stdin, stdout, stderr = client.exec_command(cmd_id)
    post_id = stdout.read().decode('utf-8').strip()
    
    print(f"Updating post {post_id}...")
    cmd_update = f'cd public_html && wp post update {post_id} temp_update_post.txt'
    stdin, stdout, stderr = client.exec_command(cmd_update)
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))
    
    # Cleanup
    client.exec_command('rm public_html/temp_update_post.txt')
    
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

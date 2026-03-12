import paramiko
import os
import urllib.request
import sys

# Image URL provided by user
image_url = "https://www.caglasses.com/media/mageplaza/blog/post/h/o/how_to_match_your_golf_sunglasses_to_weather_and_lighting_conditions.webp"
filename = os.path.basename(image_url)
local_file = os.path.join(os.getcwd(), filename)

print(f"Downloading {image_url}...")

# Add User-Agent header
req = urllib.request.Request(
    image_url, 
    data=None, 
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
)

try:
    with urllib.request.urlopen(req) as response, open(local_file, 'wb') as out_file:
        out_file.write(response.read())
    print(f"Downloaded to {local_file}")
except Exception as e:
    print(f"Failed to download image: {e}")
    sys.exit(1)

# SFTP Upload
sftp_info = {}
with open('sftp.txt', 'r') as f:
    for line in f:
        if ':' in line:
            key, value = line.split(':', 1)
            sftp_info[key.strip().lower()] = value.strip()

host = sftp_info.get('host')
username = sftp_info.get('username')
password = sftp_info.get('password')

print(f"Connecting to {host}...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, username=username, password=password)
    sftp = client.open_sftp()
    
    # Get site URL (assuming wp-config.php is accessible via wp-cli)
    # We'll try to guess it or fetch it via wp option get siteurl
    print("Getting site URL...")
    stdin, stdout, stderr = client.exec_command('cd public_html && wp option get siteurl')
    site_url = stdout.read().decode('utf-8').strip()
    
    if not site_url:
        print("Could not get site URL. Assuming http://[host] for now.")
        site_url = f"http://{host}"

    print(f"Site URL: {site_url}")
    
    # Check if wp-content/uploads/2026/03 exists (or current month)
    # Actually, let's just use 'imported' folder to be safe and organized
    remote_dir = 'public_html/wp-content/uploads/imported'
    try:
        sftp.stat('public_html/wp-content/uploads')
    except FileNotFoundError:
        print("wp-content/uploads not found!")
        sys.exit(1)

    try:
        sftp.stat(remote_dir)
    except FileNotFoundError:
        print(f"Creating directory {remote_dir}...")
        sftp.mkdir(remote_dir)
        
    remote_path = f"{remote_dir}/{filename}"
    print(f"Uploading to {remote_path}...")
    sftp.put(local_file, remote_path)
    
    # Construct new URL
    # If site_url ends with /, remove it
    if site_url.endswith('/'):
        site_url = site_url[:-1]
        
    new_url = f"{site_url}/wp-content/uploads/imported/{filename}"
    print(f"\nSUCCESS! Image uploaded.")
    print(f"New WordPress URL: {new_url}")
    
    # Attempt to find post again with fuzzy search on filename
    name_part = os.path.splitext(filename)[0]
    # Replace underscores with spaces for title search maybe?
    title_search = name_part.replace('_', ' ')
    
    print(f"\nSearching for post with content containing '{name_part}' or title '{title_search}'...")
    
    cmd = f'wp db query "SELECT ID, post_title FROM wp_posts WHERE post_content LIKE \'%{name_part}%\' OR post_title LIKE \'%{title_search}%\'" --skip-column-names'
    stdin, stdout, stderr = client.exec_command(f'cd public_html && {cmd}')
    posts = stdout.read().decode('utf-8').strip()
    
    if posts:
        print(f"Found post candidates:\n{posts}")
    else:
        print("Could not find any post referencing this image filename.")

    client.close()
    sftp.close()

except Exception as e:
    print(f"Error: {e}")

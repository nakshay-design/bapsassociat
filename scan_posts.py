import paramiko
import sys
import re

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
    
    # List all posts
    print("Listing all posts...")
    # Add --posts_per_page=-1 to get all posts
    cmd = 'cd public_html && wp post list --post_type=post --field=ID --format=csv --posts_per_page=-1'
    stdin, stdout, stderr = client.exec_command(cmd)
    output = stdout.read().decode('utf-8').strip()
    
    if not output:
        print("No posts found or error listing posts.")
        print(stderr.read().decode('utf-8'))
        sys.exit(1)
        
    post_ids = output.split('\n')
    post_ids = [pid.strip() for pid in post_ids if pid.strip().isdigit()]
    
    print(f"Found {len(post_ids)} posts.")
    
    broken_posts = []
    
    # Process in batches to avoid overwhelming the connection/output? 
    # Actually, fetching content one by one is slow but safer.
    
    for i, pid in enumerate(post_ids):
        if i % 10 == 0:
            print(f"Scanning post {i+1}/{len(post_ids)} (ID: {pid})...")
            
        cmd_content = f'cd public_html && wp post get {pid} --field=content'
        stdin, stdout, stderr = client.exec_command(cmd_content)
        content = stdout.read().decode('utf-8')
        
        issues = []
        
        # Check for broken images
        # 1. {{media url=...}}
        if '{{media url=' in content:
            issues.append('unprocessed_media_tag')
            
        # 2. <img ... src="" ...> or missing src
        # Using regex to find img tags
        img_tags = re.findall(r'<img[^>]+>', content)
        for img in img_tags:
            # Check if src attribute exists and is not empty
            # Simple check: src=" something " or src=' something '
            if 'src=' not in img:
                issues.append(f'missing_src_attr: {img}')
            else:
                # Check for empty src
                if 'src=""' in img or "src=''" in img:
                    issues.append(f'empty_src: {img}')
                # Check for src="#" or similar placeholders if any
                
        if issues:
            print(f"Post {pid} has issues: {issues}")
            broken_posts.append({'id': pid, 'issues': issues})
            
    print("\nSummary of broken posts:")
    if broken_posts:
        for bp in broken_posts:
            print(f"Post ID: {bp['id']}")
            for issue in bp['issues']:
                print(f"  - {issue}")
    else:
        print("No broken posts found!")
            
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

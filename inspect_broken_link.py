import paramiko
import sys

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
    print("Connecting to SSH...")
    client.connect(host, username=username, password=password)
    
    slug = 'top-safety-glasses-for-grinding-different-materials'
    cmd = f'cd public_html && wp post list --name={slug} --post_type=post --fields=ID,post_content --format=json'
    
    print(f"Fetching content for: {slug}")
    stdin, stdout, stderr = client.exec_command(cmd)
    output = stdout.read().decode('utf-8')
    err = stderr.read().decode('utf-8')
    if err:
        print(f"STDERR: {err}")
    
    print(f"STDOUT: {output[:500]}...")
    
    import json
    try:
        posts = json.loads(output)
        if posts:
            content = posts[0]['post_content']
            print("Content found. Searching for broken link...")
            target_link = "Matrix Denali"
            if target_link in content:
                print(f"Found text: {target_link}")
                # Print context
                start = content.find(target_link) - 50
                end = content.find(target_link) + 100
                print(f"Context: ...{content[start:end]}...")
            else:
                print("Target text NOT found in content.")
        else:
            print("Post not found.")
    except json.JSONDecodeError:
        print(f"Failed to parse JSON: {output}")
        
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

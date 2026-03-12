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
    print("Connecting to SFTP...")
    client.connect(host, username=username, password=password)
    
    # Use WP-CLI to get the post content
    cmd = 'cd public_html && wp post list --name="are-prescription-safety-glasses-worth-it" --field=content --post_type=post'
    print(f"Executing: {cmd}")
    
    stdin, stdout, stderr = client.exec_command(cmd)
    content = stdout.read().decode('utf-8')
    err = stderr.read().decode('utf-8')
    
    if err:
        print(f"STDERR: {err}")
        
    print("\n--- Post Content Start ---")
    print(content)
    print("--- Post Content End ---")
    
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

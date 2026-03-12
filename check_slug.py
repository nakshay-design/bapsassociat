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
    
    cmd = 'cd public_html && wp post list --name="all-you-need-to-know-about-swimming-goggles" --field=ID --post_type=post'
    stdin, stdout, stderr = client.exec_command(cmd)
    pid = stdout.read().decode('utf-8').strip()
    
    print(f"Post ID for all-you-need-to-know-about-swimming-goggles: {pid}")
    client.close()
except Exception as e:
    print(f"Error: {e}")

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
    
    cmd = 'cd public_html && wp post list --post_type=post --format=count'
    print("Counting posts...")
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode('utf-8'))
    
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

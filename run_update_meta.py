import paramiko
import sys
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
    print("Connecting to SSH...")
    client.connect(host, username=username, password=password)
    
    cmd = 'cd public_html && php update_yoast_meta.php'
    print("Running update script...")
    
    stdin, stdout, stderr = client.exec_command(cmd)
    
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            print(stdout.channel.recv(1024).decode('utf-8'), end='')
        time.sleep(1)
        
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))
    
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

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
    sftp = client.open_sftp()
    
    local_path = r'c:\Users\Webindia\Desktop\cagalsse\update_yoast_meta.php'
    remote_path = 'public_html/update_yoast_meta.php'
    
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)
    print("Upload complete.")
    
    sftp.close()
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

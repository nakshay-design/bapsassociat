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
    
    files_to_remove = [
        'public_html/update_product_status_title.php',
        'public_html/prod-data.csv'
    ]
    
    for remote_path in files_to_remove:
        try:
            sftp.remove(remote_path)
            print(f"Removed {remote_path}")
        except Exception as e:
            print(f"Failed to remove {remote_path}: {e}")
            
    sftp.close()
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

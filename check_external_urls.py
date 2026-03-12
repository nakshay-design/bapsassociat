import paramiko
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

print(f"Connecting to {host}...")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, username=username, password=password)
    
    print("\nChecking for 'mageplaza' in wp_postmeta...")
    cmd = 'wp db query "SELECT post_id, meta_key, meta_value FROM wp_postmeta WHERE meta_value LIKE \'%mageplaza%\' LIMIT 5" --skip-column-names'
    stdin, stdout, stderr = client.exec_command(f'cd public_html && {cmd}')
    meta_results = stdout.read().decode('utf-8')
    if meta_results:
        print(f"Found in wp_postmeta:\n{meta_results}")
    else:
        print("Not found in wp_postmeta.")

    print("\nChecking for 'mageplaza' in attachment GUIDs...")
    cmd = 'wp db query "SELECT ID, guid FROM wp_posts WHERE post_type = \'attachment\' AND guid LIKE \'%mageplaza%\' LIMIT 5" --skip-column-names'
    stdin, stdout, stderr = client.exec_command(f'cd public_html && {cmd}')
    guid_results = stdout.read().decode('utf-8')
    if guid_results:
        print(f"Found in attachment GUIDs:\n{guid_results}")
    else:
        print("Not found in attachment GUIDs.")

    client.close()

except Exception as e:
    print(f"Connection failed: {e}")

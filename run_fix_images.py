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
    sftp = client.open_sftp()
    
    # Upload script
    local_path = r'c:\Users\Webindia\Desktop\cagalsse\wp_fix_images.php'
    remote_path = 'public_html/wp_fix_images.php'
    
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)
    
    # Run script
    print("Running wp_fix_images.php on server...")
    # Change to public_html and run
    stdin, stdout, stderr = client.exec_command('cd public_html && php wp_fix_images.php')
    
    # Stream output
    while True:
        line = stdout.readline()
        if not line:
            break
        print(line.strip())
        
    error = stderr.read().decode('utf-8')
    if error:
        print(f"STDERR: {error}")
        
    client.close()
    sftp.close()

except Exception as e:
    print(f"Operation failed: {e}")

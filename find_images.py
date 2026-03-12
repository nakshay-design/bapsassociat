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
    
    # Search for files
    search_files = ['_dsc1920_1_.jpg', '_dsc1094.jpg']
    for filename in search_files:
        print(f"Searching for {filename} in uploads...")
        # Using find command via SSH
        cmd = f'find public_html/wp-content/uploads -name "{filename}"'
        stdin, stdout, stderr = client.exec_command(cmd)
        results = stdout.read().decode('utf-8').strip()
        
        if results:
            print(f"FOUND: {results}")
        else:
            # Try case-insensitive search
            print(f"Not found (exact). Trying case-insensitive search...")
            cmd_i = f'find public_html/wp-content/uploads -iname "{filename}"'
            stdin, stdout, stderr = client.exec_command(cmd_i)
            results_i = stdout.read().decode('utf-8').strip()
            if results_i:
                print(f"FOUND (case-insensitive): {results_i}")
            else:
                print("NOT FOUND.")
    
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

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
    
    slug = 'z87-prescription-safety-glasse'
    # Check if slug is typo, maybe 'z87-prescription-safety-glasses'?
    
    cmd = f'cd public_html && wp term list product_cat --slug={slug} --fields=term_id,slug,name'
    print(f"Checking slug: {slug}")
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode('utf-8'))
    
    # Try searching for similar
    cmd2 = 'cd public_html && wp term list product_cat --search="z87" --fields=term_id,slug,name'
    print("Searching for 'z87':")
    stdin, stdout, stderr = client.exec_command(cmd2)
    print(stdout.read().decode('utf-8'))
    
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

import paramiko
import sys
import csv

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
    
    # Read local CSV
    csv_file = 'desc 1.csv'
    slugs_to_check = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            slugs_to_check.append(row['slug'])
            if len(slugs_to_check) >= 5: # Check first 5
                break
                
    print(f"Checking first 5 slugs: {slugs_to_check}")
    
    for slug in slugs_to_check:
        cmd = f'cd public_html && wp term list product_cat --slug={slug} --fields=term_id,slug,name --format=csv'
        stdin, stdout, stderr = client.exec_command(cmd)
        output = stdout.read().decode('utf-8').strip()
        
        if output:
            print(f"Found: {output}")
        else:
            print(f"Not Found: {slug}")
            print(stderr.read().decode('utf-8'))
            
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

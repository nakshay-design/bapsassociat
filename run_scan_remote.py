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
    
    cmd = 'cd public_html && php scan_broken_links.php'
    print("Running scan script (this may take a while)...")
    
    # Using invoke_shell for long running command might be better, but exec_command is simpler for now.
    # We'll stream output.
    stdin, stdout, stderr = client.exec_command(cmd)
    
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            print(stdout.channel.recv(1024).decode('utf-8'), end='')
        time.sleep(1)
        
    print(stdout.read().decode('utf-8'))
    print(stderr.read().decode('utf-8'))
    
    # After scan, download the JSON report
    print("Downloading report...")
    sftp = client.open_sftp()
    try:
        sftp.get('public_html/broken_links_report.json', r'c:\Users\Webindia\Desktop\cagalsse\broken_links_report.json')
        print("Report downloaded to c:\\Users\\Webindia\\Desktop\\cagalsse\\broken_links_report.json")
    except Exception as e:
        print(f"Failed to download report: {e}")
        
    sftp.close()
    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

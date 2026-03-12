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
    
    # Check Yoast meta data for first 5 draft products
    # We need to look at postmeta: _yoast_wpseo_title and _yoast_wpseo_metadesc
    cmd = 'cd public_html && wp post list --post_type=product --post_status=draft --posts_per_page=5 --fields=ID,post_title,post_name --format=json'
    
    print("Fetching first 5 draft products...")
    stdin, stdout, stderr = client.exec_command(cmd)
    products_json = stdout.read().decode('utf-8')
    
    import json
    try:
        products = json.loads(products_json)
        for p in products:
            pid = p['ID']
            title = p['post_title']
            
            # Get meta
            cmd_meta = f'cd public_html && wp post meta list {pid} --keys=_yoast_wpseo_title,_yoast_wpseo_metadesc --format=json'
            stdin, stdout, stderr = client.exec_command(cmd_meta)
            meta_out = stdout.read().decode('utf-8')
            
            print(f"\nProduct ID: {pid} | Title: {title}")
            try:
                meta = json.loads(meta_out)
                meta_dict = {m['meta_key']: m['meta_value'] for m in meta}
                print(f"  Yoast Title: {meta_dict.get('_yoast_wpseo_title', '[NOT SET]')}")
                print(f"  Yoast Desc:  {meta_dict.get('_yoast_wpseo_metadesc', '[NOT SET]')}")
            except:
                print(f"  Failed to parse meta: {meta_out}")
                
    except json.JSONDecodeError:
        print(f"Failed to parse product list: {products_json}")
        print(f"STDERR: {stderr.read().decode('utf-8')}")

    client.close()
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

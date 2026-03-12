import paramiko
import json
import urllib.request
import urllib.error
from html.parser import HTMLParser
import ssl
import time
import sys

# HTML Parser to extract title and description
class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = None
        self.description = None
        self.in_title = False
        
    def handle_starttag(self, tag, attrs):
        if tag == 'title' and self.title is None:
            self.in_title = True
        elif tag == 'meta':
            attrs_dict = dict(attrs)
            name = attrs_dict.get('name', '').lower()
            if name == 'description':
                self.description = attrs_dict.get('content')

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title and self.title is None:
            self.title = data

def get_source_meta(url):
    try:
        context = ssl._create_unverified_context()
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        )
        with urllib.request.urlopen(req, context=context, timeout=10) as response:
            html = response.read().decode('utf-8', errors='ignore')
            parser = MetaParser()
            parser.feed(html)
            return parser.title, parser.description
    except urllib.error.HTTPError as e:
        return None, None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None, None

def main():
    # Read credentials
    sftp_info = {}
    try:
        with open('sftp.txt', 'r') as f:
            for line in f:
                if ':' in line:
                    key, value = line.split(':', 1)
                    sftp_info[key.strip().lower()] = value.strip()
    except FileNotFoundError:
        print("sftp.txt not found")
        return

    host = sftp_info.get('host')
    username = sftp_info.get('username')
    password = sftp_info.get('password')

    print(f"Connecting to {host}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(host, username=username, password=password)
    except Exception as e:
        print(f"Connection failed: {e}")
        return

    # Get Pages
    print("Fetching Pages list...")
    cmd_pages = 'wp post list --post_type=page --post_status=publish --fields=ID,post_title,post_name --format=json'
    stdin, stdout, stderr = client.exec_command(f'cd public_html && {cmd_pages}')
    pages = json.loads(stdout.read().decode('utf-8'))

    # Get Posts
    print("Fetching Posts list...")
    cmd_posts = 'wp post list --post_type=post --post_status=publish --fields=ID,post_title,post_name --format=json'
    stdin, stdout, stderr = client.exec_command(f'cd public_html && {cmd_posts}')
    posts = json.loads(stdout.read().decode('utf-8'))

    all_items = []
    # Add pages with type 'page'
    for p in pages:
        p['type'] = 'page'
        all_items.append(p)
    
    # Add posts with type 'post'
    for p in posts:
        p['type'] = 'post'
        all_items.append(p)

    print(f"Total items to check: {len(all_items)}")
    
    updated_count = 0
    skipped_count = 0
    failed_count = 0

    for item in all_items:
        slug = item['post_name']
        post_id = item['ID']
        item_type = item['type']
        
        # Construct Source URL
        if item_type == 'post':
            source_url = f"https://www.caglasses.com/blog/{slug}"
        else:
            source_url = f"https://www.caglasses.com/{slug}"
            
        print(f"Checking {item_type} {post_id}: {slug} -> {source_url}")
        
        title, desc = get_source_meta(source_url)
        
        # Fallback for pages: try .html if not found
        if not title and item_type == 'page':
             source_url_html = f"https://www.caglasses.com/{slug}.html"
             print(f"  Retry with .html: {source_url_html}")
             title, desc = get_source_meta(source_url_html)

        if title:
            print(f"  Found Meta - Title: {title[:30]}... Desc: {str(desc)[:30]}...")
            
            # Escape quotes for shell command
            safe_title = title.replace('"', '\\"')
            safe_desc = (desc or "").replace('"', '\\"')
            
            # Update Title
            cmd_title = f'wp post meta update {post_id} _yoast_wpseo_title "{safe_title}"'
            stdin, stdout, stderr = client.exec_command(f'cd public_html && {cmd_title}')
            # print(stdout.read().decode('utf-8').strip())
            
            # Update Description
            if safe_desc:
                cmd_desc = f'wp post meta update {post_id} _yoast_wpseo_metadesc "{safe_desc}"'
                stdin, stdout, stderr = client.exec_command(f'cd public_html && {cmd_desc}')
                # print(stdout.read().decode('utf-8').strip())
            
            updated_count += 1
        else:
            print(f"  [404/Fail] Source not found")
            failed_count += 1
            
        # Be polite
        # time.sleep(0.1)

    print("\n--- Summary ---")
    print(f"Updated: {updated_count}")
    print(f"Failed/Skipped: {failed_count}")
    
    # Flush Cache at the end
    print("Flushing caches...")
    client.exec_command('cd public_html && wp cache flush')
    client.exec_command('cd public_html && wp litespeed-cache purge all')
    
    client.close()

if __name__ == "__main__":
    main()

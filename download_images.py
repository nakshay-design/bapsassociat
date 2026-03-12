import requests
import os

images = [
    ('https://www.caglasses.com/media/wysiwyg/_dsc1920_1_.jpg', '_dsc1920_1_.jpg'),
    ('https://www.caglasses.com/media/wysiwyg/_dsc1094.jpg', '_dsc1094.jpg')
]

for url, filename in images:
    print(f"Downloading {url}...")
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded {filename} successfully.")
        else:
            print(f"Failed to download {filename}. Status code: {response.status_code}")
            # Try without /media/wysiwyg prefix? Or maybe just /media/
            # Some Magento sites put wysiwyg directly under media
            pass 
    except Exception as e:
        print(f"Error downloading {url}: {e}")

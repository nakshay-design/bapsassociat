import csv

filepath = r'c:\Users\Webindia\Desktop\cagalsse\mageplaza_blog_post.csv'
search_term = 'how-to-match-your-golf-sunglasses'

try:
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if search_term in row.get('url_key', '') or search_term in row.get('name', ''):
                print(f"Found Post ID: {row.get('post_id')}")
                print(f"Name: {row.get('name')}")
                print(f"Image Column: {row.get('image')}")
                print(f"Post Content Snippet: {row.get('post_content')[:200]}")
                break
        else:
            print("Post not found in CSV.")
except Exception as e:
    print(f"Error reading CSV: {e}")

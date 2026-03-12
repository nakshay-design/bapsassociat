import csv

csv_path = r'c:\Users\Webindia\Desktop\cagalsse\meta-products.csv'

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    total = 0
    with_data = 0
    missing_data = []
    
    for row in reader:
        total += 1
        sku = row[0].strip()
        # Check if meta_title or meta_description has content
        has_title = len(row) > 1 and row[1].strip()
        has_desc = len(row) > 3 and row[3].strip()
        
        if has_title or has_desc:
            with_data += 1
        else:
            if '35025 yellow' in sku:
                print(f"CONFIRMED MISSING: {sku}")
            missing_data.append(sku)

print(f"Total rows: {total}")
print(f"Rows with data: {with_data}")
print(f"Rows without data: {len(missing_data)}")

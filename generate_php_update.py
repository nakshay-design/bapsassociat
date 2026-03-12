import csv
import json

csv_file = 'desc 1.csv'
php_file = 'update_descriptions.php'

updates = []

with open(csv_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        term_id = row.get('term_id')
        description = row.get('description')
        slug = row.get('slug')
        
        if term_id and description:
            updates.append({
                'term_id': term_id,
                'description': description,
                'slug': slug
            })

# Generate PHP content
php_content = """<?php
require_once('wp-load.php');

$updates = """ + json.dumps(updates, indent=4) + """;

echo "Starting update of " . count($updates) . " categories...\\n";

foreach ($updates as $update) {
    $term_id = $update['term_id'];
    $description = $update['description'];
    $slug = $update['slug'];
    
    // Check if term exists first? Or just update.
    // wp_update_term returns array('term_id' => ..., 'term_taxonomy_id' => ...) on success
    // or WP_Error on failure.
    
    echo "Updating term ID $term_id ($slug)... ";
    
    $result = wp_update_term($term_id, 'product_cat', array(
        'description' => $description
    ));
    
    if (is_wp_error($result)) {
        echo "FAILED: " . $result->get_error_message() . "\\n";
    } else {
        echo "SUCCESS\\n";
    }
}

echo "Done.\\n";
?>
"""

with open(php_file, 'w', encoding='utf-8') as f:
    f.write(php_content)

print(f"Generated {php_file} with {len(updates)} updates.")

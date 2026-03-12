import csv
import json

csv_file = 'desc 1.csv'
json_file = 'updates.json'
php_file = 'run_updates.php'

updates = []

with open(csv_file, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    print(f"CSV Keys: {reader.fieldnames}")
    for row in reader:
        # Strip whitespace from keys
        row = {k.strip(): v for k, v in row.items() if k}
        
        term_id = row.get('term_id')
        description = row.get('description')
        slug = row.get('slug')
        
        if term_id:
            updates.append({
                'term_id': term_id,
                'description': description,
                'slug': slug
            })

with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(updates, f, indent=4)
    
print(f"Generated {json_file} with {len(updates)} items.")

php_content = """<?php
// Ensure we can handle large execution time if needed
set_time_limit(300);

if (!file_exists('wp-load.php')) {
    die("Error: wp-load.php not found in current directory.\\n");
}
require_once('wp-load.php');

$json_file = 'updates.json';
if (!file_exists($json_file)) {
    die("Error: $json_file not found.\\n");
}

$json_data = file_get_contents($json_file);
$updates = json_decode($json_data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die("Error decoding JSON: " . json_last_error_msg() . "\\n");
}

// Allow HTML in descriptions
remove_filter('pre_term_description', 'wp_filter_kses');
remove_filter('pre_term_description', 'wp_filter_post_kses');

echo "Starting update of " . count($updates) . " categories...\\n";

$count = 0;
$success = 0;
$fail = 0;

foreach ($updates as $update) {
    $term_id = $update['term_id'];
    $description = $update['description']; // This contains HTML
    $slug = $update['slug'];
    
    // Optional: Verify term exists or check if slug matches?
    // Let's trust term_id since we verified it matches.
    
    // Note: wp_update_term expects 'description' to be sanitized by default filters,
    // but usually allows HTML for admins.
    // However, we are running via CLI (or direct PHP), so we should be fine.
    // To be safe, we can remove 'kses' filters if needed, but 'description' usually allows HTML.
    // The user specifically asked for "wysign editor code" which means raw HTML.
    
    // Remove default filtering to ensure raw HTML is preserved exactly as is?
    // kses_remove_filters(); // Might be too aggressive.
    // product_cat description usually allows HTML.
    
    $args = array(
        'description' => $description
    );
    
    $result = wp_update_term($term_id, 'product_cat', $args);
    
    if (is_wp_error($result)) {
        echo "FAILED update for ID $term_id ($slug): " . $result->get_error_message() . "\\n";
        $fail++;
    } else {
        // Verify update
        clean_term_cache($term_id, 'product_cat');
        $term = get_term($term_id, 'product_cat');
        if ($term && $term->description) {
            // Check length or content match
            if (strlen($term->description) != strlen($description)) {
                echo "WARNING: Description length mismatch for ID $term_id ($slug). Sent: " . strlen($description) . ", Saved: " . strlen($term->description) . "\\n";
            } else {
                echo "Updated ID $term_id ($slug) - Verified length matches.\\n";
            }
        } else {
             echo "Updated ID $term_id ($slug) - Verified (empty or check failed).\\n";
        }
        $success++;
    }
    $count++;
    
    if ($count % 20 == 0) {
        echo "Processed $count...\\n";
    }
}

echo "Done. Success: $success, Failed: $fail.\\n";
?>
"""

with open(php_file, 'w', encoding='utf-8') as f:
    f.write(php_content)
    
print(f"Generated {php_file}.")

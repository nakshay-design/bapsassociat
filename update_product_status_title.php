<?php
// Load WordPress environment
require_once('wp-load.php');

// Increase time limit
set_time_limit(0);

$csv_file = 'prod-data.csv';

if (!file_exists($csv_file)) {
    die("CSV file not found: $csv_file\n");
}

$handle = fopen($csv_file, 'r');
if (!$handle) {
    die("Could not open CSV file.\n");
}

// Read header
$header = fgetcsv($handle);
// Expected: sku, product_online, name

$updated_count = 0;
$skipped_count = 0;
$not_found_count = 0;
$row_count = 0;

echo "Starting product update...\n";

while (($data = fgetcsv($handle)) !== FALSE) {
    $row_count++;
    
    if (count($data) < 3) {
        continue;
    }

    $sku = trim($data[0]);
    $status_str = strtolower(trim($data[1])); // enabled/disabled
    $new_title = trim($data[2]);

    if (empty($sku)) {
        continue;
    }

    $product_id = wc_get_product_id_by_sku($sku);

    if (!$product_id) {
        // echo "Product not found: $sku\n";
        $not_found_count++;
        continue;
    }

    $product = wc_get_product($product_id);
    if (!$product) {
        $not_found_count++;
        continue;
    }

    $current_status = $product->get_status();
    $current_title = $product->get_name();

    $target_status = $current_status;
    if ($status_str === 'enabled') {
        $target_status = 'publish';
    } elseif ($status_str === 'disabled') {
        $target_status = 'draft';
    }

    $changes = array(
        'ID' => $product_id
    );
    $needs_update = false;

    // Check Status
    if ($target_status !== $current_status) {
        $changes['post_status'] = $target_status;
        $needs_update = true;
        // echo "Updating status for $sku: $current_status -> $target_status\n";
    }

    // Check Title
    // Normalize for comparison
    $current_title_norm = trim(html_entity_decode($current_title, ENT_QUOTES | ENT_HTML5));
    $new_title_norm = trim(html_entity_decode($new_title, ENT_QUOTES | ENT_HTML5));

    if ($new_title_norm !== $current_title_norm && !empty($new_title)) {
        $changes['post_title'] = $new_title;
        $needs_update = true;
        // echo "Updating title for $sku\n";
    }

    if ($needs_update) {
        $result = wp_update_post($changes, true);
        if (is_wp_error($result)) {
            echo "Error updating $sku: " . $result->get_error_message() . "\n";
        } else {
            $updated_count++;
        }
    } else {
        $skipped_count++;
    }

    if ($row_count % 100 == 0) {
        echo "Processed $row_count rows...\n";
    }
}

fclose($handle);

echo "Update Complete.\n";
echo "Total Rows Processed: $row_count\n";
echo "Updated: $updated_count\n";
echo "Skipped (No changes): $skipped_count\n";
echo "Not Found: $not_found_count\n";
?>

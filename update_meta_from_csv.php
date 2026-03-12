<?php
// Load WordPress environment
require_once('wp-load.php');

// Increase time limit
set_time_limit(0);

$csv_file = 'meta-products.csv';

if (!file_exists($csv_file)) {
    die("CSV file not found: $csv_file\n");
}

$handle = fopen($csv_file, 'r');
if (!$handle) {
    die("Could not open CSV file.\n");
}

// Read header
$header = fgetcsv($handle);
// Expected: sku, meta_title, meta_keywords, meta_description
// Indices: 0, 1, 2, 3

$updated = 0;
$skipped = 0;
$not_found = 0;

echo "Starting update from CSV...\n";

while (($data = fgetcsv($handle)) !== FALSE) {
    // Basic validation
    if (count($data) < 4) {
        continue;
    }

    $sku = trim($data[0]);
    // Remove BOM if present in SKU
    $sku = preg_replace('/^\xEF\xBB\xBF/', '', $sku);
    
    $meta_title = trim($data[1]);
    $meta_desc = trim($data[3]); // Index 3 is description

    if (empty($sku)) {
        continue;
    }

    // Skip if no meta data to update
    if (empty($meta_title) && empty($meta_desc)) {
        $skipped++;
        continue;
    }

    // Find product by SKU
    $product_id = 0;
    if (function_exists('wc_get_product_id_by_sku')) {
        $product_id = wc_get_product_id_by_sku($sku);
    }

    // Fallback if WC function not available or didn't find it
    if (!$product_id) {
        global $wpdb;
        $product_id = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM $wpdb->postmeta WHERE meta_key='_sku' AND meta_value='%s' LIMIT 1",
            $sku
        ));
    }

    if ($product_id) {
        $changed = false;
        
        if (!empty($meta_title)) {
            update_post_meta($product_id, '_yoast_wpseo_title', $meta_title);
            $changed = true;
        }
        
        if (!empty($meta_desc)) {
            update_post_meta($product_id, '_yoast_wpseo_metadesc', $meta_desc);
            $changed = true;
        }

        if ($changed) {
            $updated++;
            // echo "Updated SKU: $sku (ID: $product_id)\n";
        }
    } else {
        $not_found++;
        // echo "Product not found for SKU: $sku\n";
    }

    if (($updated + $skipped + $not_found) % 100 == 0) {
        echo "Processed " . ($updated + $skipped + $not_found) . " rows...\n";
    }
}

fclose($handle);

echo "Update complete.\n";
echo "Updated: $updated\n";
echo "Skipped (no data): $skipped\n";
echo "Products not found: $not_found\n";
?>

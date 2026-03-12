<?php
// Load WordPress environment
require_once('wp-load.php');

// Increase time limit
set_time_limit(0);

// Get all products (publish and draft)
$args = array(
    'post_type' => 'product',
    'post_status' => array('publish', 'draft'),
    'numberposts' => -1,
);
$products = get_posts($args);

echo "Found " . count($products) . " products.\n";

$updated_count = 0;
$skipped_count = 0;

foreach ($products as $product) {
    $pid = $product->ID;
    $title = $product->post_title;
    
    // Check existing Yoast meta
    $yoast_title = get_post_meta($pid, '_yoast_wpseo_title', true);
    $yoast_desc = get_post_meta($pid, '_yoast_wpseo_metadesc', true);
    
    $needs_update = false;
    
    // Update if empty or doesn't match
    // Note: User asked "make sure it will be same" as product title
    if (empty($yoast_title) || $yoast_title !== $title) {
        update_post_meta($pid, '_yoast_wpseo_title', $title);
        $needs_update = true;
    }
    
    if (empty($yoast_desc) || $yoast_desc !== $title) {
        update_post_meta($pid, '_yoast_wpseo_metadesc', $title);
        $needs_update = true;
    }
    
    if ($needs_update) {
        $updated_count++;
        // echo "Updated Product ID $pid\n";
    } else {
        $skipped_count++;
    }
    
    if (($updated_count + $skipped_count) % 100 == 0) {
        echo "Processed " . ($updated_count + $skipped_count) . " products...\n";
    }
}

echo "Done. Updated: $updated_count, Skipped (already same): $skipped_count.\n";
?>

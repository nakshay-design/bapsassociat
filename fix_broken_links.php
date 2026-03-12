<?php
// Load WordPress environment
require_once('wp-load.php');

// Increase time limit
set_time_limit(0);

// Load broken links report
$report_file = 'broken_links_report.json';
if (!file_exists($report_file)) {
    die("Report file not found.\n");
}

$broken_links = json_decode(file_get_contents($report_file), true);
if (!$broken_links) {
    die("Failed to parse report or empty.\n");
}

// Group by post ID
$posts_to_fix = [];
foreach ($broken_links as $item) {
    $posts_to_fix[$item['post_id']][] = $item['url'];
}

echo "Found " . count($posts_to_fix) . " posts to fix.\n";

foreach ($posts_to_fix as $post_id => $urls) {
    $post = get_post($post_id);
    if (!$post) {
        echo "Post $post_id not found.\n";
        continue;
    }
    
    $content = $post->post_content;
    
    // Use DOMDocument to modify
    $dom = new DOMDocument();
    // Suppress warnings
    libxml_use_internal_errors(true);
    // Load with UTF-8 hack
    // Note: We wrap in <div> to ensure we have a root if needed, but <body> is better for extraction
    @$dom->loadHTML('<?xml encoding="utf-8" ?><body>' . $content . '</body>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    
    $links = $dom->getElementsByTagName('a');
    $links_to_remove = [];
    
    // Find links to remove (can't remove while iterating easily)
    foreach ($links as $link) {
        $href = $link->getAttribute('href');
        // Check if this href is in our list of broken URLs for this post
        // We do strict comparison, but maybe we should trim?
        if (in_array($href, $urls)) {
            $links_to_remove[] = $link;
        }
    }
    
    if (empty($links_to_remove)) {
        echo "No matching links found in Post $post_id (content might have changed?).\n";
        continue;
    }
    
    echo "Fixing Post $post_id: Removing " . count($links_to_remove) . " links.\n";
    
    foreach ($links_to_remove as $link) {
        // Move children up
        while ($link->hasChildNodes()) {
            $child = $link->firstChild;
            $link->parentNode->insertBefore($child, $link);
        }
        // Remove the link tag
        $link->parentNode->removeChild($link);
    }
    
    // Save content
    $body = $dom->getElementsByTagName('body')->item(0);
    $new_content = '';
    foreach ($body->childNodes as $child) {
        $new_content .= $dom->saveHTML($child);
    }
    
    // Remove the xml declaration if it leaked (saveHTML($child) shouldn't verify)
    // But just in case
    $new_content = str_replace('<?xml encoding="utf-8" ?>', '', $new_content);
    
    // Update post
    $updated_post = array(
        'ID' => $post_id,
        'post_content' => $new_content
    );
    
    wp_update_post($updated_post);
}

echo "All done.\n";
?>

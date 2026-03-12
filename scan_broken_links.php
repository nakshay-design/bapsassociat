<?php
// Load WordPress environment
require_once('wp-load.php');

// Increase time limit
set_time_limit(0);

// Get all posts
$args = array(
    'post_type' => 'post',
    'post_status' => 'publish',
    'numberposts' => -1,
);
$posts = get_posts($args);

echo "Found " . count($posts) . " posts.\n";

$broken_links = [];
$checked_links = []; // Cache for link status

foreach ($posts as $post) {
    $content = $post->post_content;
    
    // Quick check if content has links
    if (strpos($content, '<a ') === false) {
        continue;
    }
    
    $dom = new DOMDocument();
    // Suppress warnings for malformed HTML
    libxml_use_internal_errors(true);
    // Load HTML with UTF-8 encoding hack
    @$dom->loadHTML('<?xml encoding="utf-8" ?>' . $content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    
    $links = $dom->getElementsByTagName('a');
    
    foreach ($links as $link) {
        $href = $link->getAttribute('href');
        
        if (empty($href) || strpos($href, '#') === 0 || strpos($href, 'mailto:') === 0 || strpos($href, 'tel:') === 0) {
            continue;
        }
        
        // Check cache
        if (isset($checked_links[$href])) {
            $status = $checked_links[$href];
        } else {
            // Check the link
            $response = wp_remote_head($href, array('timeout' => 5, 'redirection' => 5));
            
            if (is_wp_error($response)) {
                $status = 'error'; // DNS or connection error
            } else {
                $status = wp_remote_retrieve_response_code($response);
            }
            
            $checked_links[$href] = $status;
            
            // Log progress for every 10 new links checked
            if (count($checked_links) % 10 == 0) {
                echo "Checked " . count($checked_links) . " unique links...\n";
            }
        }
        
        if ($status == 404 || $status == 'error') {
            echo "Found broken link in Post {$post->ID}: $href (Status: $status)\n";
            $broken_links[] = array(
                'post_id' => $post->ID,
                'url' => $href,
                'status' => $status
            );
        }
    }
}

// Output results to JSON file
file_put_contents('broken_links_report.json', json_encode($broken_links, JSON_PRETTY_PRINT));
echo "Scan complete. Found " . count($broken_links) . " broken links. Saved to broken_links_report.json\n";
?>

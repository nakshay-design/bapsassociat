<?php
// fix_images.php
// ...
if (php_sapi_name() !== 'cli') {
    die("This script must be run from the command line.");
}
if (!file_exists('wp-load.php')) {
    die("Error: wp-load.php not found. Make sure you are in the WordPress root directory.\n");
}
require_once('wp-load.php');

echo "Starting image fix process...\n";

// 1. Build image map (Lowercased Filename -> Relative Path)
echo "Scanning wp-content/uploads...\n";
$upload_dir = wp_upload_dir();
$basedir = $upload_dir['basedir'];
$baseurl = $upload_dir['baseurl'];

if (!is_dir($basedir)) {
    die("Error: Uploads directory not found at $basedir\n");
}

$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($basedir));
$image_map = []; 
$count = 0;

foreach ($iterator as $file) {
    if ($file->isFile()) {
        $filename = $file->getFilename();
        if (preg_match('/\.(jpg|jpeg|png|gif|webp|bmp)$/i', $filename)) {
            $path = $file->getPathname();
            $rel_path = substr($path, strlen($basedir) + 1);
            $rel_path = str_replace('\\', '/', $rel_path);
            
            $key = strtolower($filename);
            $image_map[$key] = $rel_path;
            
            $count++;
            if ($count % 5000 == 0) echo "Scanned $count images...\n";
        }
    }
}
echo "Total images found: " . count($image_map) . "\n";

// 2. Process posts
echo "Fetching posts...\n";
$args = [
    'post_type' => 'any',
    'post_status' => 'any',
    'posts_per_page' => -1,
];
$query = new WP_Query($args);
echo "Found " . $query->found_posts . " posts to check.\n";

$updated_count = 0;

foreach ($query->posts as $post) {
    $content = $post->post_content;
    if (empty($content)) continue;

    $original_content = $content;
    $modified = false;

    $pattern = '/\{\{media\s+url=(?:&quot;|")([^"\}]+?)(?:&quot;|")\}\}/';
    
    $content = preg_replace_callback($pattern, function($matches) use ($image_map, $baseurl, &$modified, $post) {
        $magento_path = $matches[1];
        $filename = basename($magento_path);
        
        $lower_filename = strtolower(urldecode($filename));

        if (isset($image_map[$lower_filename])) {
            $new_url = $baseurl . '/' . $image_map[$lower_filename];
            return $new_url;
        } else {
            // echo "  [MISSING] Post {$post->ID}: Image $filename not found in uploads.\n";
            return $matches[0];
        }
    }, $content);

    if ($content !== $original_content) {
        $updated_count++;
        echo "Updating Post ID {$post->ID} ({$post->post_title})...\n";
        wp_update_post([
            'ID' => $post->ID,
            'post_content' => $content
        ]);
    }
}

echo "------------------------------------------------\n";
echo "Process complete.\n";
echo "Updated $updated_count posts.\n";
?>

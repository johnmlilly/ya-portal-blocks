<?php
/**
 * Plugin Name:       Member Portal
 * Description:       Blocks for the Youth Apostles member portal: formation and community documents, quick actions, the community calendar, and fundraising.
 * Version:           1.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            John Lilly
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ya-portal-blocks
 *
 * @package Yamp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once __DIR__ . '/includes/document-list.php';
require_once __DIR__ . '/includes/calendar.php';
require_once __DIR__ . '/includes/patterns.php';
/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function yamp_ya_portal_blocks_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'yamp_ya_portal_blocks_block_init' );

/**
 * Loads the Montserrat brand font shared by every portal block.
 *
 * `enqueue_block_assets` fires on the front end and inside the editor canvas,
 * so the font loads once for all blocks in both places.
 */
function yamp_enqueue_portal_font() {
	wp_enqueue_style(
		'yamp-portal-font',
		'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
		array(),
		null
	);
}
add_action( 'enqueue_block_assets', 'yamp_enqueue_portal_font' );

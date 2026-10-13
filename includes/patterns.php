<?php
/**
 * Block patterns for laying out the member portal page.
 *
 * @package Yamp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the "Member Portal" pattern category and its patterns.
 *
 * Community section: a "Community" heading over a 1/3 | 2/3 columns layout,
 * Community Documents on the left and the (more prominent) Community Calendar
 * on the right. Core Columns stacks the two columns on narrow screens.
 */
function yamp_register_portal_patterns() {
	register_block_pattern_category(
		'yamp-portal',
		array( 'label' => __( 'Member Portal', 'ya-portal-blocks' ) )
	);

	register_block_pattern(
		'yamp/community-section',
		array(
			'title'       => __( 'Community section', 'ya-portal-blocks' ),
			'description' => __( 'Community heading with documents (1/3) beside the calendar (2/3).', 'ya-portal-blocks' ),
			'categories'  => array( 'yamp-portal' ),
			'content'     => '<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">' . esc_html__( 'Community', 'ya-portal-blocks' ) . '</h3>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column {"width":"33.33%"} -->
<div class="wp-block-column" style="flex-basis:33.33%"><!-- wp:yamp/community-documents /--></div>
<!-- /wp:column -->

<!-- wp:column {"width":"66.66%"} -->
<div class="wp-block-column" style="flex-basis:66.66%"><!-- wp:yamp/community-calendar /--></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->',
		)
	);
}
add_action( 'init', 'yamp_register_portal_patterns' );

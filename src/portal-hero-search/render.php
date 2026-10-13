<?php
/**
 * Server render for the Portal Hero + Search block.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * The search input is decorative for now: there is no document data source
 * to search across yet.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$yamp_user = wp_get_current_user();

if ( $yamp_user->exists() && '' !== $yamp_user->display_name ) {
	/* translators: %s: the logged-in member's display name. */
	$yamp_heading = sprintf( __( 'Welcome back, %s', 'ya-portal-blocks' ), $yamp_user->display_name );
} else {
	$yamp_heading = __( 'Welcome back', 'ya-portal-blocks' );
}
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<h2 class="yamp-hero__title"><?php echo esc_html( $yamp_heading ); ?></h2>
	<p class="yamp-hero__date">
		<time datetime="<?php echo esc_attr( wp_date( 'Y-m-d' ) ); ?>">
			<?php
			/* translators: PHP date format for the hero date line, e.g. "Tuesday, October 13". See https://www.php.net/manual/datetime.format.php */
			echo esc_html( wp_date( __( 'l, F j', 'ya-portal-blocks' ) ) );
			?>
		</time>
	</p>
	<div class="yamp-hero__search">
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
		<input type="search" placeholder="<?php esc_attr_e( 'Search…', 'ya-portal-blocks' ); ?>" aria-label="<?php esc_attr_e( 'Search documents', 'ya-portal-blocks' ); ?>" />
	</div>
</div>

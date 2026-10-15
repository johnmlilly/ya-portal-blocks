<?php
/**
 * Server render for the Community Calendar block.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * The admin's `calendar` input is never printed; only the URL returned by
 * yamp_calendar_embed_url() (includes/calendar.php) reaches the page. With no
 * usable URL the live page gets nothing, while the editor preview (a REST
 * request from ServerSideRender) gets a notice explaining what to paste.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$yamp_heading = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';
$yamp_input   = isset( $attributes['calendar'] ) ? trim( (string) $attributes['calendar'] ) : '';
$yamp_height  = isset( $attributes['height'] ) ? (int) $attributes['height'] : 600;
$yamp_height  = max( 300, min( 1200, $yamp_height ) );
$yamp_url     = yamp_calendar_embed_url( $yamp_input );

if ( '' === $yamp_url ) {
	if ( ! wp_is_serving_rest_request() ) {
		return;
	}

	$yamp_notice = '' === $yamp_input
		? __( 'Add your calendar in the block settings.', 'ya-portal-blocks' )
		: __( 'Couldn\'t read that calendar. Paste an embed link (starting with https://), the full embed code, or a Google calendar ID.', 'ya-portal-blocks' );
}

$yamp_title = '' !== $yamp_heading ? $yamp_heading : __( 'Community Calendar', 'ya-portal-blocks' );
?>
<div <?php echo get_block_wrapper_attributes(); ?> data-yamp-search-group>
	<div class="yamp-card">
		<?php if ( '' !== $yamp_heading ) : ?>
			<div class="yamp-card__head">
				<span class="yamp-card__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span>
				<h4 class="yamp-card__title"><?php echo esc_html( $yamp_heading ); ?></h4>
			</div>
		<?php endif; ?>
		<?php if ( '' === $yamp_url ) : ?>
			<p class="yamp-calendar__notice"><?php echo esc_html( $yamp_notice ); ?></p>
		<?php else : ?>
			<div class="yamp-calendar__frame">
				<iframe src="<?php echo esc_url( $yamp_url ); ?>" title="<?php echo esc_attr( $yamp_title ); ?>" height="<?php echo esc_attr( (string) $yamp_height ); ?>" loading="lazy"></iframe>
			</div>
		<?php endif; ?>
	</div>
</div>

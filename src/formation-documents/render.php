<?php
/**
 * Server render for the Formation Documents block.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * Columns render in stored order; each column's documents go through the
 * shared yamp_render_document_list() in includes/document-list.php.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$yamp_stages = isset( $attributes['stages'] ) ? $attributes['stages'] : array();

if ( ! is_array( $yamp_stages ) ) {
	$yamp_stages = array();
}

$yamp_heading = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';

// Documents for every member, shown above the stage columns when present.
$yamp_general           = isset( $attributes['general'] ) && is_array( $attributes['general'] ) ? $attributes['general'] : array();
$yamp_general_heading   = isset( $yamp_general['heading'] ) ? (string) $yamp_general['heading'] : '';
$yamp_general_documents = isset( $yamp_general['documents'] ) && is_array( $yamp_general['documents'] ) ? $yamp_general['documents'] : array();

// On the live page the card appears only once it has documents. The editor
// preview arrives as a REST request (ServerSideRender), so show the empty card
// there too; otherwise admins have nothing in the preview to tell them it exists.
$yamp_show_general = ! empty( $yamp_general_documents ) || wp_is_serving_rest_request();

// Stroke width and inner SVG markup per column icon key. Static, trusted markup from the design reference.
$yamp_stage_icons = array(
	'sprout'     => array( '1.8', '<path d="M7 20h10"/><path d="M12 20v-9"/><path d="M12 11C12 6 8 4 4 4c0 4 2 7 8 7Z"/><path d="M12 9c0-3 2.5-5 8-5 0 3-1.5 6-8 6"/>' ),
	'cross'      => array( '1.8', '<path d="M12 3v18M6.5 8.5h11"/>' ),
	'cross-bold' => array( '3.2', '<path d="M12 3v18M6.5 8.5h11"/>' ),
	'people'     => array( '1.8', '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' ),
	'document'   => array( '1.8', '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/>' ),
);

if ( empty( $yamp_stages ) && ! $yamp_show_general ) {
	return;
}
?>
<section <?php echo get_block_wrapper_attributes(); ?>>
	<?php if ( '' !== $yamp_heading ) : ?>
		<h3 class="yamp-section__title"><?php echo esc_html( $yamp_heading ); ?></h3>
	<?php endif; ?>
	<?php if ( $yamp_show_general ) : ?>
		<div class="yamp-stage yamp-stage--general">
			<div class="yamp-stage__head">
				<span class="yamp-stage__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="<?php echo esc_attr( $yamp_stage_icons['people'][0] ); ?>" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><?php echo $yamp_stage_icons['people'][1]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static icon map above. ?></svg></span>
				<h4 class="yamp-stage__title"><?php echo esc_html( $yamp_general_heading ); ?></h4>
			</div>
			<?php echo yamp_render_document_list( $yamp_general_documents ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside the helper. ?>
		</div>
	<?php endif; ?>
	<?php if ( ! empty( $yamp_stages ) ) : ?>
	<div class="yamp-path">
		<?php
		foreach ( $yamp_stages as $yamp_stage ) :
			if ( ! is_array( $yamp_stage ) ) {
				continue;
			}

			$yamp_icon          = isset( $yamp_stage['icon'] ) && isset( $yamp_stage_icons[ $yamp_stage['icon'] ] ) ? $yamp_stage['icon'] : 'document';
			$yamp_stage_heading = isset( $yamp_stage['heading'] ) ? (string) $yamp_stage['heading'] : '';
			$yamp_documents     = isset( $yamp_stage['documents'] ) ? $yamp_stage['documents'] : array();
			?>
			<div class="yamp-stage">
				<div class="yamp-stage__head">
					<span class="yamp-stage__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="<?php echo esc_attr( $yamp_stage_icons[ $yamp_icon ][0] ); ?>" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><?php echo $yamp_stage_icons[ $yamp_icon ][1]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static icon map above. ?></svg></span>
					<h4 class="yamp-stage__title"><?php echo esc_html( $yamp_stage_heading ); ?></h4>
				</div>
				<?php echo yamp_render_document_list( $yamp_documents ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside the helper. ?>
			</div>
		<?php endforeach; ?>
	</div>
	<?php endif; ?>
</section>

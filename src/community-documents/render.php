<?php
/**
 * Server render for the Community Documents block.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * One card with a single document list, drawn by the shared
 * yamp_render_document_list() in includes/document-list.php.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$yamp_heading   = isset( $attributes['heading'] ) ? (string) $attributes['heading'] : '';
$yamp_documents = isset( $attributes['documents'] ) ? $attributes['documents'] : array();
?>
<div <?php echo get_block_wrapper_attributes(); ?> data-yamp-search-group>
	<div class="yamp-card" data-yamp-search-group>
		<?php if ( '' !== $yamp_heading ) : ?>
			<div class="yamp-card__head">
				<span class="yamp-card__icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/></svg></span>
				<h4 class="yamp-card__title"><?php echo esc_html( $yamp_heading ); ?></h4>
			</div>
		<?php endif; ?>
		<?php echo yamp_render_document_list( $yamp_documents ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside the helper. ?>
	</div>
</div>

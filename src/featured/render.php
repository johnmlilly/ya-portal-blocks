<?php
/**
 * Server render for the Featured block.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * One spotlight card beside a list card of tagged items. Either card is left
 * out when it has no content, and the other then spans the full width.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Screen-reader label and inner SVG markup per tag. Labels and icons come from
// this map, never from stored values. Static, decorative SVG markup.
$yamp_tags = array(
	'event'  => array( __( 'Event', 'ya-portal-blocks' ), '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>' ),
	'survey' => array( __( 'Survey', 'ya-portal-blocks' ), '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>' ),
	'prayer' => array( __( 'Prayer', 'ya-portal-blocks' ), '<path d="M12 3v18M6.5 8.5h11"/>' ),
	'news'   => array( __( 'News', 'ya-portal-blocks' ), '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>' ),
);

if ( ! function_exists( 'yamp_featured_tag' ) ) {
	/**
	 * Icon tile for a tag, with a visually hidden label for screen readers.
	 * Values outside the fixed set render as `news`.
	 *
	 * @param mixed $tag  Stored tag value.
	 * @param array $tags Tag key => array( label, inner SVG ) map.
	 * @return string Escaped HTML.
	 */
	function yamp_featured_tag( $tag, $tags ) {
		$key = is_string( $tag ) && isset( $tags[ $tag ] ) ? $tag : 'news';
		return '<span class="yamp-feat__icon yamp-feat__icon--' . $key . '">'
			. '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' . $tags[ $key ][1] . '</svg>'
			. '<span class="yamp-feat__sr">' . esc_html( $tags[ $key ][0] ) . ': </span></span>';
	}
}

$yamp_spotlight = isset( $attributes['spotlight'] ) && is_array( $attributes['spotlight'] ) ? $attributes['spotlight'] : array();
$yamp_spot_html = '';
$yamp_spot_name = isset( $yamp_spotlight['title'] ) ? trim( (string) $yamp_spotlight['title'] ) : '';

if ( '' !== $yamp_spot_name ) {
	$yamp_spot_text  = isset( $yamp_spotlight['text'] ) ? trim( (string) $yamp_spotlight['text'] ) : '';
	$yamp_spot_label = isset( $yamp_spotlight['buttonLabel'] ) ? trim( (string) $yamp_spotlight['buttonLabel'] ) : '';
	$yamp_spot_url   = isset( $yamp_spotlight['url'] ) ? esc_url( (string) $yamp_spotlight['url'] ) : '';

	$yamp_spot_body = yamp_featured_tag( isset( $yamp_spotlight['tag'] ) ? $yamp_spotlight['tag'] : '', $yamp_tags )
		. '<h4 class="yamp-feat__spot-title">' . esc_html( $yamp_spot_name ) . '</h4>'
		. ( '' !== $yamp_spot_text ? '<p class="yamp-feat__spot-text">' . esc_html( $yamp_spot_text ) . '</p>' : '' );

	// The hero search filter matches the spotlight on its title and text.
	$yamp_spot_search = ' data-yamp-search="' . esc_attr( trim( $yamp_spot_name . ' ' . $yamp_spot_text ) ) . '"';

	if ( '' !== $yamp_spot_url ) {
		if ( '' !== $yamp_spot_label ) {
			$yamp_spot_body .= '<span class="yamp-feat__button">' . esc_html( $yamp_spot_label ) . ' <span aria-hidden="true">→</span></span>';
		}
		$yamp_spot_html = '<a class="yamp-feat__spotlight" href="' . $yamp_spot_url . '"' . $yamp_spot_search . '>' . $yamp_spot_body . '</a>';
	} else {
		$yamp_spot_html = '<div class="yamp-feat__spotlight"' . $yamp_spot_search . '>' . $yamp_spot_body . '</div>';
	}
}

$yamp_items     = isset( $attributes['items'] ) && is_array( $attributes['items'] ) ? $attributes['items'] : array();
$yamp_rows_html = '';
$yamp_arrow     = '<span class="yamp-feat__arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M7 17 17 7M8 7h9v9"/></svg></span>';

foreach ( $yamp_items as $yamp_item ) {
	if ( ! is_array( $yamp_item ) ) {
		continue;
	}

	$yamp_title = isset( $yamp_item['title'] ) ? trim( (string) $yamp_item['title'] ) : '';
	if ( '' === $yamp_title ) {
		continue;
	}

	$yamp_detail = isset( $yamp_item['detail'] ) ? trim( (string) $yamp_item['detail'] ) : '';
	$yamp_url    = isset( $yamp_item['url'] ) ? esc_url( (string) $yamp_item['url'] ) : '';
	$yamp_body   = yamp_featured_tag( isset( $yamp_item['tag'] ) ? $yamp_item['tag'] : '', $yamp_tags )
		. '<span class="yamp-feat__text"><b>' . esc_html( $yamp_title ) . '</b>'
		. ( '' !== $yamp_detail ? '<span>' . esc_html( $yamp_detail ) . '</span>' : '' )
		. '</span>';

	$yamp_search = ' data-yamp-search="' . esc_attr( trim( $yamp_title . ' ' . $yamp_detail ) ) . '"';

	if ( '' !== $yamp_url ) {
		$yamp_rows_html .= '<li' . $yamp_search . '><a class="yamp-feat__row" href="' . $yamp_url . '">' . $yamp_body . $yamp_arrow . '</a></li>';
	} else {
		$yamp_rows_html .= '<li' . $yamp_search . '><div class="yamp-feat__row">' . $yamp_body . '</div></li>';
	}
}

$yamp_classes = '' !== $yamp_spot_html && '' !== $yamp_rows_html ? '' : 'yamp-feat--single';
?>
<div <?php echo get_block_wrapper_attributes( array( 'class' => $yamp_classes ) ); ?> data-yamp-search-group>
	<?php if ( '' === $yamp_spot_html && '' === $yamp_rows_html ) : ?>
		<p class="yamp-feat__empty"><?php esc_html_e( 'No featured items yet.', 'ya-portal-blocks' ); ?></p>
	<?php else : ?>
		<?php
		// Both fragments are built only from escaped text, esc_url()'d links, and static markup above.
		echo $yamp_spot_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		if ( '' !== $yamp_rows_html ) {
			echo '<div class="yamp-feat__list" data-yamp-search-group><ul>' . $yamp_rows_html . '</ul></div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		?>
	<?php endif; ?>
</div>

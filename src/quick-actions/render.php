<?php
/**
 * Server render for the Quick Actions block.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * Cards render in stored order. A card without a usable link renders as a
 * plain, non-clickable card.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$yamp_actions = isset( $attributes['actions'] ) ? $attributes['actions'] : array();

if ( ! is_array( $yamp_actions ) || empty( $yamp_actions ) ) {
	return;
}

$yamp_svg_open = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';

// Inner SVG markup per icon key. Static, trusted markup from the design reference.
$yamp_icons = array(
	'contact'   => '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
	'directory' => '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
	'birthdays' => '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16c1.5 1 3 1 4 0s2.5-1 4 0 3 1 4 0 2.5-1 4 0"/><path d="M2 21h20"/><path d="M7 8v3M12 8v3M17 8v3"/><path d="M7 4h.01M12 4h.01M17 4h.01"/>',
	'logos'     => '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
	'link'      => '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
);
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php
	foreach ( $yamp_actions as $yamp_action ) :
		if ( ! is_array( $yamp_action ) ) {
			continue;
		}

		$yamp_icon        = isset( $yamp_action['icon'] ) && isset( $yamp_icons[ $yamp_action['icon'] ] ) ? $yamp_action['icon'] : 'link';
		$yamp_label       = isset( $yamp_action['label'] ) ? (string) $yamp_action['label'] : '';
		$yamp_description = isset( $yamp_action['description'] ) ? (string) $yamp_action['description'] : '';
		$yamp_url         = isset( $yamp_action['url'] ) ? esc_url( (string) $yamp_action['url'] ) : '';
		$yamp_body        = '<span class="yamp-action__icon">' . $yamp_svg_open . $yamp_icons[ $yamp_icon ] . '</svg></span>'
			. '<span class="yamp-action__text"><b>' . esc_html( $yamp_label ) . '</b>'
			. '<span>' . esc_html( $yamp_description ) . '</span></span>';

		if ( '' !== $yamp_url ) {
			// $yamp_body is built only from escaped text and the static icon map above.
			echo '<a class="yamp-action" href="' . $yamp_url . '">' . $yamp_body . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		} else {
			echo '<div class="yamp-action yamp-action--no-link">' . $yamp_body . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	endforeach;
	?>
</div>

<?php
/**
 * Shared document-list rendering for the portal document blocks.
 *
 * Document row contract (shared by Formation Documents and Community
 * Documents): array( 'title' => string, 'type' => 'pdf'|'form'|'doc'|'audio',
 * 'url' => string ).
 *
 * @package Yamp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Renders a list of document rows.
 *
 * Every field is escaped here. Each row shows a type icon tile, the title, a
 * type badge in the same colors, and (when linked) an open arrow. A row whose
 * URL escapes to an empty string (missing, or a disallowed scheme such as
 * javascript:) renders as a plain, non-clickable row. Unknown types render as
 * `pdf`.
 *
 * @param mixed $documents Array of document rows.
 * @return string Escaped HTML.
 */
function yamp_render_document_list( $documents ) {
	if ( ! is_array( $documents ) || empty( $documents ) ) {
		return '<p class="yamp-docs__empty">' . esc_html__( 'No documents yet.', 'ya-portal-blocks' ) . '</p>';
	}

	// Badge label and inner SVG markup per type. Static, decorative markup.
	$types = array(
		'pdf'   => array( 'PDF', '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6M9 15l3 3 3-3"/>' ),
		'form'  => array( 'FORM', '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>' ),
		'doc'   => array( 'DOC', '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/>' ),
		'audio' => array( 'AUDIO', '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>' ),
	);

	$svg_open   = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" focusable="false">';
	$open_arrow = '<span class="yamp-doc__arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M7 17 17 7M8 7h9v9"/></svg></span>';

	$html = '<ul class="yamp-docs">';

	foreach ( $documents as $document ) {
		if ( ! is_array( $document ) ) {
			continue;
		}

		$type  = isset( $document['type'] ) && isset( $types[ $document['type'] ] ) ? $document['type'] : 'pdf';
		$title = isset( $document['title'] ) ? (string) $document['title'] : '';
		$url   = isset( $document['url'] ) ? esc_url( (string) $document['url'] ) : '';

		$body = '<span class="yamp-doc__icon yamp-type--' . $type . '" aria-hidden="true">' . $svg_open . $types[ $type ][1] . '</svg></span>'
			. '<span class="yamp-doc__title">' . esc_html( $title ) . '</span>'
			. '<span class="yamp-doc__badge yamp-type--' . $type . '">' . esc_html( $types[ $type ][0] ) . '</span>';

		// The hero search filter (feature 11) matches rows on this title.
		$search = ' data-yamp-search="' . esc_attr( $title ) . '"';

		if ( '' !== $url ) {
			$html .= '<li' . $search . '><a class="yamp-doc" href="' . $url . '">' . $body . $open_arrow . '</a></li>';
		} else {
			$html .= '<li' . $search . '><div class="yamp-doc yamp-doc--no-link">' . $body . '</div></li>';
		}
	}

	return $html . '</ul>';
}

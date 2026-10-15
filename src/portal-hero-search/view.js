/**
 * Front-end search filter for the Portal Hero + Search block.
 *
 * Typing in the hero search box hides portal items (documents, events,
 * quick actions, featured items, contacts, giving buttons) whose text doesn't
 * match, hides cards and blocks left with no visible items, and reports the
 * result count under the box. Items carry their searchable text in
 * `data-yamp-search`; cards and blocks that can hide carry
 * `data-yamp-search-group`. A group with no items at all (the calendar) hides
 * whenever a search is active. Runs on the front end only (viewScript).
 */

/**
 * Lower-cases text, strips accents, and collapses whitespace so "Azcárate"
 * matches "azcarate".
 *
 * @param {string} text Text to normalize.
 * @return {string} Normalized text.
 */
function normalize( text ) {
	return text
		.normalize( 'NFD' )
		.replace( /[̀-ͯ]/g, '' )
		.toLowerCase()
		.replace( /\s+/g, ' ' )
		.trim();
}

/**
 * Applies a query to the page and updates the results line.
 *
 * @param {string}           raw     Text in the search box.
 * @param {HTMLElement|null} results The results paragraph, if present.
 */
function applyFilter( raw, results ) {
	const query = normalize( raw );
	const rows = document.querySelectorAll( '[data-yamp-search]' );
	const groups = document.querySelectorAll( '[data-yamp-search-group]' );

	if ( '' === query ) {
		rows.forEach( ( row ) => ( row.hidden = false ) );
		groups.forEach( ( group ) => ( group.hidden = false ) );
		if ( results ) {
			results.textContent = '';
		}
		return;
	}

	let matches = 0;
	rows.forEach( ( row ) => {
		const match = normalize( row.dataset.yampSearch || '' ).includes(
			query
		);
		row.hidden = ! match;
		if ( match ) {
			matches++;
		}
	} );

	// A group hides when none of its rows is visible, which also covers
	// nested groups such as a stage column inside Formation Documents.
	groups.forEach( ( group ) => {
		group.hidden = ! group.querySelector(
			'[data-yamp-search]:not([hidden])'
		);
	} );

	if ( ! results ) {
		return;
	}

	if ( 0 === matches ) {
		results.textContent = ( results.dataset.none || '' ).replace(
			'%s',
			raw.trim()
		);
	} else {
		const template =
			1 === matches ? results.dataset.one : results.dataset.many;
		results.textContent = ( template || '' ).replace( '%d', matches );
	}
}

/**
 * Wires every hero search box on the page to the filter.
 */
function init() {
	document
		.querySelectorAll( '.wp-block-yamp-portal-hero-search' )
		.forEach( ( hero ) => {
			const input = hero.querySelector( '.yamp-hero__search input' );
			const results = hero.querySelector( '.yamp-hero__results' );

			if ( input ) {
				input.addEventListener( 'input', () =>
					applyFilter( input.value, results )
				);
			}
		} );
}

// viewScript may load before the page is parsed; wait for the DOM if so.
if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}

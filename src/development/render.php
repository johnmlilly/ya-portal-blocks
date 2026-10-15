<?php
/**
 * Server render for the Development block.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * Two cards side by side: upcoming fundraising events, and the development
 * office contacts with a row of giving buttons beneath them.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$yamp_events_heading   = isset( $attributes['eventsHeading'] ) ? (string) $attributes['eventsHeading'] : '';
$yamp_contacts_heading = isset( $attributes['contactsHeading'] ) ? (string) $attributes['contactsHeading'] : '';
$yamp_contacts         = isset( $attributes['contacts'] ) && is_array( $attributes['contacts'] ) ? $attributes['contacts'] : array();
$yamp_giving_links     = isset( $attributes['givingLinks'] ) && is_array( $attributes['givingLinks'] ) ? $attributes['givingLinks'] : array();

$yamp_svg_open = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';

if ( ! function_exists( 'yamp_development_upper' ) ) {
	/**
	 * Uppercases text, multibyte-safe when mbstring is available.
	 *
	 * WordPress core polyfills mb_substr() but not mb_strtoupper().
	 *
	 * @param string $text Text to uppercase.
	 * @return string
	 */
	function yamp_development_upper( $text ) {
		return function_exists( 'mb_strtoupper' ) ? mb_strtoupper( $text, 'UTF-8' ) : strtoupper( $text );
	}
}

if ( ! function_exists( 'yamp_development_initials' ) ) {
	/**
	 * Avatar initials from a contact name.
	 *
	 * Uses the text before the first comma (drops a suffix such as ", YA"),
	 * skips words ending in a period (titles such as "Fr."), then takes the
	 * first letter of the first and last remaining words.
	 *
	 * @param string $name Contact name.
	 * @return string Up to two uppercase letters; empty when none remain.
	 */
	function yamp_development_initials( $name ) {
		$parts = explode( ',', $name );
		$words = preg_split( '/\s+/u', trim( $parts[0] ), -1, PREG_SPLIT_NO_EMPTY );
		$words = array_values(
			array_filter(
				(array) $words,
				function ( $word ) {
					return '.' !== substr( $word, -1 );
				}
			)
		);

		if ( empty( $words ) ) {
			return '';
		}

		$initials = mb_substr( $words[0], 0, 1 );
		if ( count( $words ) > 1 ) {
			$initials .= mb_substr( $words[ count( $words ) - 1 ], 0, 1 );
		}

		return yamp_development_upper( $initials );
	}
}

if ( ! function_exists( 'yamp_development_upcoming_events' ) ) {
	/**
	 * Upcoming events to show, soonest first.
	 *
	 * Keeps rows with a title and a strict YYYY-MM-DD date on or after today
	 * in the site timezone, so an event drops off the day after it happens.
	 * Ties keep entry order (usort is not stable before PHP 8).
	 *
	 * @param mixed $events Event rows from the block attributes.
	 * @return array[] Rows with date, timestamp, title, details, and escaped url.
	 */
	function yamp_development_upcoming_events( $events ) {
		if ( ! is_array( $events ) ) {
			return array();
		}

		$timezone = wp_timezone();
		$today    = current_datetime()->format( 'Y-m-d' );
		$upcoming = array();

		foreach ( array_values( $events ) as $index => $event ) {
			if ( ! is_array( $event ) ) {
				continue;
			}

			$title = isset( $event['title'] ) ? trim( (string) $event['title'] ) : '';
			$date  = isset( $event['date'] ) ? trim( (string) $event['date'] ) : '';
			$day   = DateTimeImmutable::createFromFormat( '!Y-m-d', $date, $timezone );

			if ( '' === $title || ! $day || $day->format( 'Y-m-d' ) !== $date || $date < $today ) {
				continue;
			}

			$upcoming[] = array(
				'index'     => $index,
				'date'      => $date,
				'timestamp' => $day->getTimestamp(),
				'title'     => $title,
				'details'   => isset( $event['details'] ) ? trim( (string) $event['details'] ) : '',
				'url'       => isset( $event['url'] ) ? esc_url( (string) $event['url'] ) : '',
			);
		}

		usort(
			$upcoming,
			function ( $a, $b ) {
				$order = strcmp( $a['date'], $b['date'] );
				return 0 !== $order ? $order : $a['index'] - $b['index'];
			}
		);

		return $upcoming;
	}
}

$yamp_events = yamp_development_upcoming_events( isset( $attributes['events'] ) ? $attributes['events'] : array() );
$yamp_arrow  = '<span class="yamp-dev__arrow" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M7 17 17 7M8 7h9v9"/></svg></span>';
?>
<div <?php echo get_block_wrapper_attributes(); ?> data-yamp-search-group>
	<div class="yamp-dev-card" data-yamp-search-group>
		<?php if ( '' !== $yamp_events_heading ) : ?>
			<div class="yamp-dev-card__head">
				<span class="yamp-dev-card__icon"><?php echo $yamp_svg_open; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static markup. ?><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span>
				<h4 class="yamp-dev-card__title"><?php echo esc_html( $yamp_events_heading ); ?></h4>
			</div>
		<?php endif; ?>
		<?php if ( empty( $yamp_events ) ) : ?>
			<p class="yamp-dev__empty"><?php esc_html_e( 'No upcoming events. Check back soon.', 'ya-portal-blocks' ); ?></p>
		<?php else : ?>
			<ul class="yamp-dev__list">
				<?php
				foreach ( $yamp_events as $yamp_event ) :
					$yamp_body = '<time class="yamp-dev__date" datetime="' . esc_attr( $yamp_event['date'] ) . '">'
						. '<small>' . esc_html( yamp_development_upper( wp_date( 'M', $yamp_event['timestamp'] ) ) ) . '</small>'
						. '<b>' . esc_html( wp_date( 'j', $yamp_event['timestamp'] ) ) . '</b></time>'
						. '<span class="yamp-dev__text"><b>' . esc_html( $yamp_event['title'] ) . '</b>'
						. ( '' !== $yamp_event['details'] ? '<span>' . esc_html( $yamp_event['details'] ) . '</span>' : '' )
						. '</span>';

					if ( '' !== $yamp_event['url'] ) {
						// $yamp_body is built only from escaped text; the URL is esc_url()'d above.
						echo '<li data-yamp-search="' . esc_attr( trim( $yamp_event['title'] . ' ' . $yamp_event['details'] ) ) . '"><a class="yamp-dev__row" href="' . $yamp_event['url'] . '">' . $yamp_body . $yamp_arrow . '</a></li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					} else {
						echo '<li data-yamp-search="' . esc_attr( trim( $yamp_event['title'] . ' ' . $yamp_event['details'] ) ) . '"><div class="yamp-dev__row">' . $yamp_body . '</div></li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}
				endforeach;
				?>
			</ul>
		<?php endif; ?>
	</div>

	<div class="yamp-dev-card" data-yamp-search-group>
		<?php if ( '' !== $yamp_contacts_heading ) : ?>
			<div class="yamp-dev-card__head">
				<span class="yamp-dev-card__icon"><?php echo $yamp_svg_open; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static markup. ?><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
				<h4 class="yamp-dev-card__title"><?php echo esc_html( $yamp_contacts_heading ); ?></h4>
			</div>
		<?php endif; ?>
		<ul class="yamp-dev__list">
			<?php
			foreach ( $yamp_contacts as $yamp_contact ) :
				if ( ! is_array( $yamp_contact ) ) {
					continue;
				}

				$yamp_name = isset( $yamp_contact['name'] ) ? trim( (string) $yamp_contact['name'] ) : '';
				if ( '' === $yamp_name ) {
					continue;
				}

				$yamp_role  = isset( $yamp_contact['title'] ) ? (string) $yamp_contact['title'] : '';
				$yamp_email = isset( $yamp_contact['email'] ) ? sanitize_email( (string) $yamp_contact['email'] ) : '';
				$yamp_email = is_email( $yamp_email ) ? $yamp_email : '';

				$yamp_body = '<span class="yamp-dev__avatar" aria-hidden="true">' . esc_html( yamp_development_initials( $yamp_name ) ) . '</span>'
					. '<span class="yamp-dev__text"><b>' . esc_html( $yamp_name ) . '</b>'
					. ( '' !== $yamp_role ? '<span>' . esc_html( $yamp_role ) . '</span>' : '' )
					. ( '' !== $yamp_email ? '<span>' . esc_html( $yamp_email ) . '</span>' : '' )
					. '</span>';

				// The hero search filter matches contacts on name, title, and email.
				$yamp_search = ' data-yamp-search="' . esc_attr( trim( $yamp_name . ' ' . $yamp_role . ' ' . $yamp_email ) ) . '"';

				if ( '' !== $yamp_email ) {
					// $yamp_body is built only from escaped text.
					echo '<li' . $yamp_search . '><a class="yamp-dev__row" href="' . esc_url( 'mailto:' . $yamp_email ) . '">' . $yamp_body . '</a></li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				} else {
					echo '<li' . $yamp_search . '><div class="yamp-dev__row">' . $yamp_body . '</div></li>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
			endforeach;
			?>
		</ul>
		<?php
		$yamp_buttons = '';
		foreach ( $yamp_giving_links as $yamp_link ) {
			if ( ! is_array( $yamp_link ) ) {
				continue;
			}

			$yamp_label = isset( $yamp_link['label'] ) ? trim( (string) $yamp_link['label'] ) : '';
			$yamp_url   = isset( $yamp_link['url'] ) ? esc_url( (string) $yamp_link['url'] ) : '';
			if ( '' === $yamp_label || '' === $yamp_url ) {
				continue;
			}

			$yamp_class    = '' === $yamp_buttons ? 'yamp-dev__btn yamp-dev__btn--primary' : 'yamp-dev__btn';
			$yamp_buttons .= '<a class="' . $yamp_class . '" href="' . $yamp_url . '" data-yamp-search="' . esc_attr( $yamp_label ) . '">' . esc_html( $yamp_label ) . '</a>';
		}

		if ( '' !== $yamp_buttons ) {
			// Built only from escaped labels and URLs above.
			echo '<div class="yamp-dev__btns">' . $yamp_buttons . '</div>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
		?>
	</div>
</div>

<?php
/**
 * Calendar embed helpers for the Community Calendar block.
 *
 * @package Yamp
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Turns an admin's calendar input into an embed URL.
 *
 * Accepts, after trimming:
 * - full `<iframe>` embed code: its `src` is used as the URL;
 * - any absolute http(s) URL with a host, returned unchanged so its query
 *   options survive (any website is allowed, by product decision);
 * - a Google calendar ID (email-shaped; may contain `#`, as in Google's
 *   holiday calendars), turned into a Google embed URL with
 *   the site timezone when it is an IANA name.
 *
 * Anything else, including javascript: and data: URLs, returns ''.
 *
 * @param mixed $input Raw value of the block's `calendar` attribute.
 * @return string Embed URL, or '' when empty or not usable.
 */
function yamp_calendar_embed_url( $input ) {
	$input = trim( (string) $input );

	if ( '' === $input ) {
		return '';
	}

	if ( false !== stripos( $input, '<iframe' ) ) {
		if ( ! preg_match( '/\ssrc\s*=\s*(["\'])(.*?)\1/is', $input, $matches ) ) {
			return '';
		}
		$input = trim( html_entity_decode( $matches[2], ENT_QUOTES ) );
	}

	// URLs copied out of embed code often carry `&amp;`; decode so query
	// options such as ctz reach the calendar intact.
	$input = trim( html_entity_decode( $input, ENT_QUOTES ) );

	if ( preg_match( '#^https?://#i', $input ) ) {
		$parts = wp_parse_url( $input );
		return empty( $parts['host'] ) ? '' : $input;
	}

	if ( preg_match( '/^[A-Za-z0-9._%+#-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/', $input ) ) {
		$url      = 'https://calendar.google.com/calendar/embed?src=' . rawurlencode( $input );
		$timezone = wp_timezone_string();
		if ( false !== strpos( $timezone, '/' ) ) {
			$url .= '&ctz=' . rawurlencode( $timezone );
		}
		return $url;
	}

	return '';
}

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
/**
 * React hook that is used to mark the block wrapper element, and the slot for
 * the block's settings sidebar.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
/**
 * Sidebar form controls.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import {
	PanelBody,
	RangeControl,
	TextareaControl,
	TextControl,
} from '@wordpress/components';
/**
 * Renders the block through render.php so the editor preview and the front
 * end share one source of markup.
 *
 * The default export is marked deprecated in favor of the named
 * `ServerSideRender` export, but that named export only exists in WordPress
 * 6.9+. This plugin supports 6.8 (see `Requires at least` in
 * ya-portal-blocks.php), so keep the default import until that minimum is
 * raised.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-server-side-render/
 */
import ServerSideRender from '@wordpress/server-side-render';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Calendar', 'ya-portal-blocks' ) }>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Heading', 'ya-portal-blocks' ) }
						help={ __(
							'Leave empty to hide the heading.',
							'ya-portal-blocks'
						) }
						value={ attributes.heading || '' }
						onChange={ ( heading ) => setAttributes( { heading } ) }
					/>
					{ /* Stored as typed (embed code contains spaces); the
					   server trims and validates it before use. */ }
					<TextareaControl
						__nextHasNoMarginBottom
						label={ __( 'Calendar', 'ya-portal-blocks' ) }
						help={ __(
							'Paste an embed link or the full embed code from any calendar site, or a Google calendar ID (Google Calendar: Settings, then your calendar, then Integrate calendar).',
							'ya-portal-blocks'
						) }
						value={ attributes.calendar || '' }
						onChange={ ( calendar ) =>
							setAttributes( { calendar } )
						}
					/>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Height (px)', 'ya-portal-blocks' ) }
						min={ 300 }
						max={ 1200 }
						step={ 50 }
						value={ attributes.height || 600 }
						onChange={ ( height ) =>
							setAttributes( { height: height || 600 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ServerSideRender
					block="yamp/community-calendar"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}

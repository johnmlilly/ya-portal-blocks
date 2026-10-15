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
	SelectControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
/**
 * Renders the block through render.php so the editor preview and the front
 * end share one source of markup.
 *
 * Keep the default import for WordPress 6.8 support; see the note in
 * src/quick-actions/edit.js.
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
 * Shared sidebar editor for lists of rows.
 */
import { RowList } from '../shared/row-list';

/**
 * The fixed tag set understood by render.php, with their sidebar labels.
 */
const TAG_OPTIONS = [
	{ value: 'event', label: __( 'Event', 'ya-portal-blocks' ) },
	{ value: 'survey', label: __( 'Survey', 'ya-portal-blocks' ) },
	{ value: 'prayer', label: __( 'Prayer', 'ya-portal-blocks' ) },
	{ value: 'news', label: __( 'News', 'ya-portal-blocks' ) },
];

/**
 * Sidebar fields for one featured item.
 */
const ITEM_FIELDS = [
	{
		key: 'tag',
		label: __( 'Tag', 'ya-portal-blocks' ),
		options: TAG_OPTIONS,
	},
	{ key: 'title', label: __( 'Title', 'ya-portal-blocks' ) },
	{
		key: 'detail',
		label: __( 'Detail', 'ya-portal-blocks' ),
		help: __( 'For example: Nov 7 · Donate items', 'ya-portal-blocks' ),
	},
	{ key: 'url', label: __( 'Link', 'ya-portal-blocks' ), trim: true },
];

/**
 * Field values for an item added from the sidebar.
 */
const NEW_ITEM = { tag: 'news', title: '', detail: '', url: '' };

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
	const spotlight =
		attributes.spotlight && typeof attributes.spotlight === 'object'
			? attributes.spotlight
			: {};
	const items = Array.isArray( attributes.items ) ? attributes.items : [];

	const updateSpotlight = ( changes ) =>
		setAttributes( { spotlight: { ...spotlight, ...changes } } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Spotlight', 'ya-portal-blocks' ) }>
					<p className="yamp-row-editor__help">
						{ __(
							'Leave the title empty to hide the spotlight. Without a link, the button is hidden.',
							'ya-portal-blocks'
						) }
					</p>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Tag', 'ya-portal-blocks' ) }
						value={ spotlight.tag || 'news' }
						options={ TAG_OPTIONS }
						onChange={ ( tag ) => updateSpotlight( { tag } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Title', 'ya-portal-blocks' ) }
						value={ spotlight.title || '' }
						onChange={ ( title ) => updateSpotlight( { title } ) }
					/>
					<TextareaControl
						label={ __( 'Text', 'ya-portal-blocks' ) }
						value={ spotlight.text || '' }
						onChange={ ( text ) => updateSpotlight( { text } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Button label', 'ya-portal-blocks' ) }
						value={ spotlight.buttonLabel || '' }
						onChange={ ( buttonLabel ) =>
							updateSpotlight( { buttonLabel } )
						}
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Link', 'ya-portal-blocks' ) }
						help={ __(
							'A web address, or mailto:name@example.org for an email link.',
							'ya-portal-blocks'
						) }
						value={ spotlight.url || '' }
						onChange={ ( url ) =>
							updateSpotlight( { url: url.trim() } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Items', 'ya-portal-blocks' ) }
					initialOpen={ false }
				>
					<p className="yamp-row-editor__help">
						{ __(
							'Items without a title are not shown. Items without a link are shown but cannot be clicked.',
							'ya-portal-blocks'
						) }
					</p>
					<RowList
						items={ items }
						fields={ ITEM_FIELDS }
						newItem={ NEW_ITEM }
						titleKey="title"
						untitled={ __( 'Untitled item', 'ya-portal-blocks' ) }
						addLabel={ __( 'Add item', 'ya-portal-blocks' ) }
						onChange={ ( next ) =>
							setAttributes( { items: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ServerSideRender
					block="yamp/featured"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}

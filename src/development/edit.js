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
import { PanelBody, TextControl } from '@wordpress/components';
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
 * Sidebar fields for one event row. `type` is passed to TextControl.
 */
const EVENT_FIELDS = [
	{ key: 'date', label: __( 'Date', 'ya-portal-blocks' ), type: 'date' },
	{ key: 'title', label: __( 'Title', 'ya-portal-blocks' ) },
	{
		key: 'details',
		label: __( 'Time & location', 'ya-portal-blocks' ),
		help: __( 'For example: 6:30 PM · Parish hall', 'ya-portal-blocks' ),
	},
	{ key: 'url', label: __( 'Link', 'ya-portal-blocks' ), trim: true },
];

/**
 * Field values for an event added from the sidebar.
 */
const NEW_EVENT = { date: '', title: '', details: '', url: '' };

/**
 * Sidebar fields for one contact row.
 */
const CONTACT_FIELDS = [
	{ key: 'name', label: __( 'Name', 'ya-portal-blocks' ) },
	{ key: 'title', label: __( 'Title', 'ya-portal-blocks' ) },
	{
		key: 'email',
		label: __( 'Email', 'ya-portal-blocks' ),
		type: 'email',
		trim: true,
	},
];

/**
 * Field values for a contact added from the sidebar.
 */
const NEW_CONTACT = { name: '', title: '', email: '' };

/**
 * Sidebar fields for one giving button.
 */
const LINK_FIELDS = [
	{ key: 'label', label: __( 'Label', 'ya-portal-blocks' ) },
	{ key: 'url', label: __( 'Link', 'ya-portal-blocks' ), trim: true },
];

/**
 * Field values for a giving button added from the sidebar.
 */
const NEW_LINK = { label: '', url: '' };

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
	const events = Array.isArray( attributes.events ) ? attributes.events : [];
	const contacts = Array.isArray( attributes.contacts )
		? attributes.contacts
		: [];
	const givingLinks = Array.isArray( attributes.givingLinks )
		? attributes.givingLinks
		: [];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Events', 'ya-portal-blocks' ) }>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Heading', 'ya-portal-blocks' ) }
						value={ attributes.eventsHeading || '' }
						onChange={ ( eventsHeading ) =>
							setAttributes( { eventsHeading } )
						}
					/>
					<p className="yamp-row-editor__help">
						{ __(
							'Events without a title or date, or whose date has passed, are not shown.',
							'ya-portal-blocks'
						) }
					</p>
					<RowList
						items={ events }
						fields={ EVENT_FIELDS }
						newItem={ NEW_EVENT }
						titleKey="title"
						untitled={ __( 'Untitled event', 'ya-portal-blocks' ) }
						addLabel={ __( 'Add event', 'ya-portal-blocks' ) }
						onChange={ ( next ) =>
							setAttributes( { events: next } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Contacts', 'ya-portal-blocks' ) }
					initialOpen={ false }
				>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Heading', 'ya-portal-blocks' ) }
						value={ attributes.contactsHeading || '' }
						onChange={ ( contactsHeading ) =>
							setAttributes( { contactsHeading } )
						}
					/>
					<p className="yamp-row-editor__help">
						{ __(
							'Contacts without a name are not shown. Without a valid email, the contact is shown but cannot be clicked.',
							'ya-portal-blocks'
						) }
					</p>
					<RowList
						items={ contacts }
						fields={ CONTACT_FIELDS }
						newItem={ NEW_CONTACT }
						titleKey="name"
						untitled={ __( 'Unnamed contact', 'ya-portal-blocks' ) }
						addLabel={ __( 'Add contact', 'ya-portal-blocks' ) }
						onChange={ ( next ) =>
							setAttributes( { contacts: next } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Giving buttons', 'ya-portal-blocks' ) }
					initialOpen={ false }
				>
					<p className="yamp-row-editor__help">
						{ __(
							'The first button is highlighted. Buttons without a label or link are not shown.',
							'ya-portal-blocks'
						) }
					</p>
					<RowList
						items={ givingLinks }
						fields={ LINK_FIELDS }
						newItem={ NEW_LINK }
						titleKey="label"
						untitled={ __( 'Untitled button', 'ya-portal-blocks' ) }
						addLabel={ __( 'Add button', 'ya-portal-blocks' ) }
						onChange={ ( next ) =>
							setAttributes( { givingLinks: next } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ServerSideRender
					block="yamp/development"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}

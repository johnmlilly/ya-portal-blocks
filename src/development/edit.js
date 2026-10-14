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
import { Button, Flex, PanelBody, TextControl } from '@wordpress/components';
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
 * An editable, reorderable list of rows in the block sidebar.
 *
 * @param {Object}   props          Component props.
 * @param {Object[]} props.items    Rows to edit.
 * @param {Object[]} props.fields   Field definitions: key, label, and
 *                                  optional type, help, and trim.
 * @param {Object}   props.newItem  Field values for an added row.
 * @param {string}   props.titleKey Field shown as each row's heading.
 * @param {string}   props.untitled Heading for a row with no title.
 * @param {string}   props.addLabel Add button label.
 * @param {Function} props.onChange Called with the next rows.
 * @return {Element} Element to render.
 */
function RowList( {
	items,
	fields,
	newItem,
	titleKey,
	untitled,
	addLabel,
	onChange,
} ) {
	const update = ( index, changes ) =>
		onChange(
			items.map( ( item, i ) =>
				i === index ? { ...item, ...changes } : item
			)
		);

	const move = ( index, offset ) => {
		const next = [ ...items ];
		[ next[ index ], next[ index + offset ] ] = [
			next[ index + offset ],
			next[ index ],
		];
		onChange( next );
	};

	return (
		<>
			{ items.map( ( item, index ) => (
				// Rows have no stable id; each one is fully controlled by
				// attributes, so the index is a safe key.
				<div className="yamp-dev-editor__row" key={ index }>
					<p className="yamp-dev-editor__row-title">
						{ item[ titleKey ] || untitled }
					</p>
					{ fields.map( ( field ) => (
						<TextControl
							__next40pxDefaultSize
							key={ field.key }
							label={ field.label }
							help={ field.help }
							type={ field.type || 'text' }
							value={ item[ field.key ] || '' }
							onChange={ ( value ) =>
								update( index, {
									[ field.key ]: field.trim
										? value.trim()
										: value,
								} )
							}
						/>
					) ) }
					<Flex justify="flex-start" wrap>
						<Button
							__next40pxDefaultSize
							variant="secondary"
							disabled={ index === 0 }
							accessibleWhenDisabled
							onClick={ () => move( index, -1 ) }
						>
							{ __( 'Move up', 'ya-portal-blocks' ) }
						</Button>
						<Button
							__next40pxDefaultSize
							variant="secondary"
							disabled={ index === items.length - 1 }
							accessibleWhenDisabled
							onClick={ () => move( index, 1 ) }
						>
							{ __( 'Move down', 'ya-portal-blocks' ) }
						</Button>
						<Button
							__next40pxDefaultSize
							variant="tertiary"
							isDestructive
							onClick={ () =>
								onChange(
									items.filter( ( _, i ) => i !== index )
								)
							}
						>
							{ __( 'Remove', 'ya-portal-blocks' ) }
						</Button>
					</Flex>
				</div>
			) ) }
			<Button
				__next40pxDefaultSize
				variant="primary"
				onClick={ () => onChange( [ ...items, { ...newItem } ] ) }
			>
				{ addLabel }
			</Button>
		</>
	);
}

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
					<p className="yamp-dev-editor__help">
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
					<p className="yamp-dev-editor__help">
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
					<p className="yamp-dev-editor__help">
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

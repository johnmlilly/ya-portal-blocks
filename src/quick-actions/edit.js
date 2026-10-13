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
	Button,
	Flex,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
/**
 * Local state hook, used to track which card's panel is open.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
 */
import { useState } from '@wordpress/element';
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
 * Icon keys understood by render.php, with their sidebar labels.
 */
const ICON_OPTIONS = [
	{ value: 'contact', label: __( 'Pencil', 'ya-portal-blocks' ) },
	{ value: 'directory', label: __( 'People', 'ya-portal-blocks' ) },
	{ value: 'birthdays', label: __( 'Cake', 'ya-portal-blocks' ) },
	{ value: 'logos', label: __( 'Palette', 'ya-portal-blocks' ) },
	{ value: 'link', label: __( 'Link', 'ya-portal-blocks' ) },
];

/**
 * Field values for a card added from the sidebar.
 */
const NEW_ACTION = { icon: 'link', label: '', description: '', url: '' };

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
	const actions = Array.isArray( attributes.actions )
		? attributes.actions
		: [];

	// One card panel is open at a time. Tracking it here (rather than letting
	// each panel keep its own state) keeps it on the same card when cards move.
	const [ openIndex, setOpenIndex ] = useState( 0 );

	const updateAction = ( index, changes ) => {
		setAttributes( {
			actions: actions.map( ( action, i ) =>
				i === index ? { ...action, ...changes } : action
			),
		} );
	};

	const moveAction = ( index, offset ) => {
		const target = index + offset;
		if ( target < 0 || target >= actions.length ) {
			return;
		}
		const next = [ ...actions ];
		[ next[ index ], next[ target ] ] = [ next[ target ], next[ index ] ];
		setAttributes( { actions: next } );
		setOpenIndex( target );
	};

	const removeAction = ( index ) => {
		setAttributes( { actions: actions.filter( ( _, i ) => i !== index ) } );
		setOpenIndex( null );
	};

	const addAction = () => {
		setOpenIndex( actions.length );
		setAttributes( { actions: [ ...actions, { ...NEW_ACTION } ] } );
	};

	return (
		<>
			<InspectorControls>
				{ actions.map( ( action, index ) => (
					// Cards have no stable id; each panel is fully controlled
					// by attributes, so the index is a safe key.
					<PanelBody
						key={ index }
						title={
							action.label ||
							__( 'Untitled card', 'ya-portal-blocks' )
						}
						opened={ openIndex === index }
						onToggle={ () =>
							setOpenIndex( openIndex === index ? null : index )
						}
					>
						<SelectControl
							label={ __( 'Icon', 'ya-portal-blocks' ) }
							value={ action.icon || 'link' }
							options={ ICON_OPTIONS }
							onChange={ ( icon ) =>
								updateAction( index, { icon } )
							}
						/>
						<TextControl
							__next40pxDefaultSize
							label={ __( 'Label', 'ya-portal-blocks' ) }
							value={ action.label || '' }
							onChange={ ( label ) =>
								updateAction( index, { label } )
							}
						/>
						<TextControl
							__next40pxDefaultSize
							label={ __( 'Description', 'ya-portal-blocks' ) }
							value={ action.description || '' }
							onChange={ ( description ) =>
								updateAction( index, { description } )
							}
						/>
						<TextControl
							__next40pxDefaultSize
							label={ __( 'Link', 'ya-portal-blocks' ) }
							help={ __(
								'A web address, or mailto:name@example.org for an email link. Leave empty to show the card without a link.',
								'ya-portal-blocks'
							) }
							value={ action.url || '' }
							onChange={ ( url ) =>
								updateAction( index, { url: url.trim() } )
							}
						/>
						<Flex justify="flex-start" wrap>
							<Button
								__next40pxDefaultSize
								variant="secondary"
								disabled={ index === 0 }
								accessibleWhenDisabled
								onClick={ () => moveAction( index, -1 ) }
							>
								{ __( 'Move up', 'ya-portal-blocks' ) }
							</Button>
							<Button
								__next40pxDefaultSize
								variant="secondary"
								disabled={ index === actions.length - 1 }
								accessibleWhenDisabled
								onClick={ () => moveAction( index, 1 ) }
							>
								{ __( 'Move down', 'ya-portal-blocks' ) }
							</Button>
							<Button
								__next40pxDefaultSize
								variant="tertiary"
								isDestructive
								onClick={ () => removeAction( index ) }
							>
								{ __( 'Remove card', 'ya-portal-blocks' ) }
							</Button>
						</Flex>
					</PanelBody>
				) ) }
				<PanelBody>
					<Button
						__next40pxDefaultSize
						variant="primary"
						onClick={ addAction }
					>
						{ __( 'Add card', 'ya-portal-blocks' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ServerSideRender
					block="yamp/quick-actions"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}

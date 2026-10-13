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
 * Local state hook, used to track which column's panel is open.
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
import DocumentListControl from '../shared/document-list-control';

/**
 * Column icon keys understood by render.php, with their sidebar labels.
 */
const ICON_OPTIONS = [
	{ value: 'sprout', label: __( 'Sprout', 'ya-portal-blocks' ) },
	{ value: 'cross', label: __( 'Cross', 'ya-portal-blocks' ) },
	{ value: 'cross-bold', label: __( 'Bold cross', 'ya-portal-blocks' ) },
	{ value: 'document', label: __( 'Document', 'ya-portal-blocks' ) },
];

/**
 * Field values for a column added from the sidebar.
 */
const NEW_STAGE = { icon: 'document', heading: '', documents: [] };

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
	const stages = Array.isArray( attributes.stages ) ? attributes.stages : [];
	const general =
		attributes.general && typeof attributes.general === 'object'
			? attributes.general
			: { heading: '', documents: [] };

	// One column panel is open at a time. Tracking it here (rather than
	// letting each panel keep its own state) keeps it on the same column when
	// columns move.
	const [ openIndex, setOpenIndex ] = useState( 0 );

	const updateStage = ( index, changes ) => {
		setAttributes( {
			stages: stages.map( ( stage, i ) =>
				i === index ? { ...stage, ...changes } : stage
			),
		} );
	};

	const moveStage = ( index, offset ) => {
		const target = index + offset;
		if ( target < 0 || target >= stages.length ) {
			return;
		}
		const next = [ ...stages ];
		[ next[ index ], next[ target ] ] = [ next[ target ], next[ index ] ];
		setAttributes( { stages: next } );
		setOpenIndex( target );
	};

	const removeStage = ( index ) => {
		setAttributes( { stages: stages.filter( ( _, i ) => i !== index ) } );
		setOpenIndex( null );
	};

	const addStage = () => {
		setOpenIndex( stages.length );
		setAttributes( {
			stages: [ ...stages, { ...NEW_STAGE, documents: [] } ],
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Section', 'ya-portal-blocks' ) }>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Heading', 'ya-portal-blocks' ) }
						help={ __(
							'Leave empty to hide the section heading.',
							'ya-portal-blocks'
						) }
						value={ attributes.heading || '' }
						onChange={ ( heading ) => setAttributes( { heading } ) }
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'All-members documents', 'ya-portal-blocks' ) }
					initialOpen={ false }
				>
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Heading', 'ya-portal-blocks' ) }
						help={ __(
							'On the live page, this list appears above the columns once it has at least one document.',
							'ya-portal-blocks'
						) }
						value={ general.heading || '' }
						onChange={ ( heading ) =>
							setAttributes( {
								general: { ...general, heading },
							} )
						}
					/>
					<DocumentListControl
						documents={ general.documents }
						onChange={ ( documents ) =>
							setAttributes( {
								general: { ...general, documents },
							} )
						}
					/>
				</PanelBody>
				{ stages.map( ( stage, index ) => (
					// Columns have no stable id; each panel is fully
					// controlled by attributes, so the index is a safe key.
					<PanelBody
						key={ index }
						title={
							stage.heading ||
							__( 'Untitled column', 'ya-portal-blocks' )
						}
						opened={ openIndex === index }
						onToggle={ () =>
							setOpenIndex( openIndex === index ? null : index )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Icon', 'ya-portal-blocks' ) }
							value={ stage.icon || 'document' }
							options={ ICON_OPTIONS }
							onChange={ ( icon ) =>
								updateStage( index, { icon } )
							}
						/>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Column heading', 'ya-portal-blocks' ) }
							value={ stage.heading || '' }
							onChange={ ( heading ) =>
								updateStage( index, { heading } )
							}
						/>
						<DocumentListControl
							documents={ stage.documents }
							onChange={ ( documents ) =>
								updateStage( index, { documents } )
							}
						/>
						<Flex
							justify="flex-start"
							wrap
							style={ { marginTop: '16px' } }
						>
							<Button
								__next40pxDefaultSize
								variant="secondary"
								disabled={ index === 0 }
								accessibleWhenDisabled
								onClick={ () => moveStage( index, -1 ) }
							>
								{ __( 'Move column up', 'ya-portal-blocks' ) }
							</Button>
							<Button
								__next40pxDefaultSize
								variant="secondary"
								disabled={ index === stages.length - 1 }
								accessibleWhenDisabled
								onClick={ () => moveStage( index, 1 ) }
							>
								{ __( 'Move column down', 'ya-portal-blocks' ) }
							</Button>
							<Button
								__next40pxDefaultSize
								variant="tertiary"
								isDestructive
								onClick={ () => removeStage( index ) }
							>
								{ __( 'Remove column', 'ya-portal-blocks' ) }
							</Button>
						</Flex>
					</PanelBody>
				) ) }
				<PanelBody>
					<Button
						__next40pxDefaultSize
						variant="primary"
						onClick={ addStage }
					>
						{ __( 'Add column', 'ya-portal-blocks' ) }
					</Button>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ServerSideRender
					block="yamp/formation-documents"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}

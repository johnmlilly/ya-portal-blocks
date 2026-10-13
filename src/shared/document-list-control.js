/**
 * Sidebar editor for a list of document rows, shared by the portal document
 * blocks.
 *
 * Document row contract: { title: string, type: 'pdf'|'form'|'doc'|'audio',
 * url: string }. Fully controlled: every change emits a new array through
 * `onChange` and never mutates `documents`.
 */
import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Card,
	CardBody,
	Flex,
	FlexBlock,
	SelectControl,
	TextControl,
} from '@wordpress/components';

/**
 * Document types understood by yamp_render_document_list().
 */
const TYPE_OPTIONS = [
	{ value: 'pdf', label: __( 'PDF', 'ya-portal-blocks' ) },
	{ value: 'form', label: __( 'Form', 'ya-portal-blocks' ) },
	{ value: 'doc', label: __( 'Doc', 'ya-portal-blocks' ) },
	{ value: 'audio', label: __( 'Audio', 'ya-portal-blocks' ) },
];

/**
 * Field values for a document added from the sidebar.
 */
const NEW_DOCUMENT = { title: '', type: 'pdf', url: '' };

/**
 * @param {Object}   props           Component props.
 * @param {Array}    props.documents Document rows.
 * @param {Function} props.onChange  Receives the next array of rows.
 * @return {Element} Element to render.
 */
export default function DocumentListControl( { documents, onChange } ) {
	const rows = Array.isArray( documents ) ? documents : [];

	const updateRow = ( index, changes ) => {
		onChange(
			rows.map( ( row, i ) =>
				i === index ? { ...row, ...changes } : row
			)
		);
	};

	const moveRow = ( index, offset ) => {
		const target = index + offset;
		if ( target < 0 || target >= rows.length ) {
			return;
		}
		const next = [ ...rows ];
		[ next[ index ], next[ target ] ] = [ next[ target ], next[ index ] ];
		onChange( next );
	};

	const removeRow = ( index ) => {
		onChange( rows.filter( ( _, i ) => i !== index ) );
	};

	const addRow = () => {
		onChange( [ ...rows, { ...NEW_DOCUMENT } ] );
	};

	// Fills the link from a Media Library pick, and the title only when the
	// row has none yet so a typed title is never overwritten.
	const selectMedia = ( index, media ) => {
		const changes = { url: media.url || '' };
		if ( ! rows[ index ].title && media.title ) {
			changes.title = media.title;
		}
		updateRow( index, changes );
	};

	return (
		<Flex direction="column" gap={ 3 }>
			{ rows.map( ( row, index ) => (
				// Rows have no stable id; each card is fully controlled by
				// props, so the index is a safe key.
				<Card key={ index } size="small">
					<CardBody>
						<Flex direction="column" gap={ 2 }>
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Title', 'ya-portal-blocks' ) }
								value={ row.title || '' }
								onChange={ ( title ) =>
									updateRow( index, { title } )
								}
							/>
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Type', 'ya-portal-blocks' ) }
								value={ row.type || 'pdf' }
								options={ TYPE_OPTIONS }
								onChange={ ( type ) =>
									updateRow( index, { type } )
								}
							/>
							{ /* Link: paste or type any address, or pick a
							   file with the Media Library button beside it. */ }
							<div>
								<BaseControl.VisualLabel>
									{ __( 'Link', 'ya-portal-blocks' ) }
								</BaseControl.VisualLabel>
								<Flex align="flex-start" gap={ 2 }>
									<FlexBlock>
										<TextControl
											__next40pxDefaultSize
											__nextHasNoMarginBottom
											hideLabelFromVision
											label={ __(
												'Link',
												'ya-portal-blocks'
											) }
											placeholder={ __(
												'Paste a link or choose a file',
												'ya-portal-blocks'
											) }
											help={ __(
												'Leave empty to show the document without a link.',
												'ya-portal-blocks'
											) }
											value={ row.url || '' }
											onChange={ ( url ) =>
												updateRow( index, {
													url: url.trim(),
												} )
											}
										/>
									</FlexBlock>
									<MediaUploadCheck>
										<MediaUpload
											onSelect={ ( media ) =>
												selectMedia( index, media )
											}
											render={ ( { open } ) => (
												<Button
													__next40pxDefaultSize
													variant="secondary"
													icon="admin-media"
													label={ __(
														'Choose from Media Library',
														'ya-portal-blocks'
													) }
													showTooltip
													onClick={ open }
												/>
											) }
										/>
									</MediaUploadCheck>
								</Flex>
							</div>
							<Flex justify="flex-start" wrap>
								<Button
									size="compact"
									variant="tertiary"
									disabled={ index === 0 }
									accessibleWhenDisabled
									onClick={ () => moveRow( index, -1 ) }
								>
									{ __( 'Move up', 'ya-portal-blocks' ) }
								</Button>
								<Button
									size="compact"
									variant="tertiary"
									disabled={ index === rows.length - 1 }
									accessibleWhenDisabled
									onClick={ () => moveRow( index, 1 ) }
								>
									{ __( 'Move down', 'ya-portal-blocks' ) }
								</Button>
								<Button
									size="compact"
									variant="tertiary"
									isDestructive
									onClick={ () => removeRow( index ) }
								>
									{ __( 'Remove', 'ya-portal-blocks' ) }
								</Button>
							</Flex>
						</Flex>
					</CardBody>
				</Card>
			) ) }
			<Button
				__next40pxDefaultSize
				variant="secondary"
				onClick={ addRow }
			>
				{ __( 'Add document', 'ya-portal-blocks' ) }
			</Button>
		</Flex>
	);
}

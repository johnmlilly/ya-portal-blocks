/**
 * Shared sidebar editor for lists of rows (events, contacts, buttons,
 * featured items). Not a block: block edit files import `RowList` from here.
 */

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
/**
 * Sidebar form controls.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import {
	Button,
	Flex,
	SelectControl,
	TextControl,
} from '@wordpress/components';
/**
 * Bordered group styles for each row in the sidebar.
 */
import './row-list.scss';

/**
 * An editable, reorderable list of rows in the block sidebar.
 *
 * @param {Object}   props          Component props.
 * @param {Object[]} props.items    Rows to edit.
 * @param {Object[]} props.fields   Field definitions: key, label, and
 *                                  optional type, help, trim, and
 *                                  options (renders a select).
 * @param {Object}   props.newItem  Field values for an added row.
 * @param {string}   props.titleKey Field shown as each row's heading.
 * @param {string}   props.untitled Heading for a row with no title.
 * @param {string}   props.addLabel Add button label.
 * @param {Function} props.onChange Called with the next rows.
 * @return {Element} Element to render.
 */
export function RowList( {
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
				<div className="yamp-row-editor__row" key={ index }>
					<p className="yamp-row-editor__row-title">
						{ item[ titleKey ] || untitled }
					</p>
					{ fields.map( ( field ) =>
						field.options ? (
							<SelectControl
								__next40pxDefaultSize
								key={ field.key }
								label={ field.label }
								help={ field.help }
								value={
									item[ field.key ] ||
									field.options[ 0 ].value
								}
								options={ field.options }
								onChange={ ( value ) =>
									update( index, { [ field.key ]: value } )
								}
							/>
						) : (
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
						)
					) }
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

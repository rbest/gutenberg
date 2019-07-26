/**
 * External dependencies
 */
import { startCase } from 'lodash';

/**
 * WordPress dependencies
 */
import {
	BaseControl,
	Button,
	Icon,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import { withInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import sizesTable, { findSizeBySlug } from './sizes';
import DimensionButtons from './buttons';

export function DimensionControl( props ) {
	const { title, property, device = 'all', deviceIcon = 'desktop', instanceId, currentSize, onSpacingChange, onReset } = props;

	/**
	 * Determines the size from the size slug (eg: `medium`)
	 * and decides whether to call the change or reset callback
	 * handlers
	 * @param  {Object} event the click event for size buttons
	 * @return {void}
	 */
	const onChangeSpacingSize = ( event ) => {
		const theSize = findSizeBySlug( sizesTable, event.target.value );

		if ( ! theSize ) {
			return;
		}

		if ( currentSize === theSize.slug ) {
			resetSpacing();
		} else {
			onSpacingChange( theSize.slug );
		}
	};

	/**
	 * Applies the callback to handle resetting
	 * a dimension spacing values
	 * @return {void}
	 */
	const resetSpacing = () => onReset();

	return (
		<BaseControl
			id={ `block-spacing-${ property }-${ device }-${ instanceId }` }
			className="block-editor-dimension-control"
		>
			<div className="block-editor-dimension-control__header">
				<BaseControl.VisualLabel className="block-editor-dimension-control__header-label">
					<Icon
						icon={ deviceIcon || device }
						label={ device }
					/>
					{ startCase( device ) }
				</BaseControl.VisualLabel>

				<Button
					disabled={ !!! currentSize }
					isDefault
					isSmall
					onClick={ resetSpacing }
					aria-label={ sprintf( __( 'Reset %s for %s' ), title, device ) }
				>
					{ __( 'Reset' ) }
				</Button>

			</div>

			<DimensionButtons
				{ ...props }
				id={ instanceId }
				device={ device }
				currentSize={ currentSize }
				onChangeSpacingSize={ onChangeSpacingSize }
				sizes={ sizesTable }
			/>

		</BaseControl>
	);
}

export default withInstanceId( DimensionControl );

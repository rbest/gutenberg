
/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '../button';
import RangeControl from '../range-control';
import SelectControl from '../select-control';

const DEFAULT_FONT_SIZE = 'default';
const CUSTOM_FONT_SIZE = 'custom';

function getSelectValueFromFontSize( fontSizes, value ) {
	if ( value ) {
		const fontSizeValue = fontSizes.find( ( font ) => font.size === value );
		return fontSizeValue ? fontSizeValue.slug : CUSTOM_FONT_SIZE;
	}
	return DEFAULT_FONT_SIZE;
}

function getSelectOptions( optionsArray ) {
	return [
		{ value: DEFAULT_FONT_SIZE, label: __( 'Default' ) },
		...optionsArray.map( ( option ) => ( { value: option.slug, label: option.name } ) ),
		{ value: CUSTOM_FONT_SIZE, label: __( 'Custom' ) },
	];
}

function FontSizePicker( {
	fallbackFontSize,
	fontSizes = [],
	disableCustomFontSizes = false,
	onChange,
	value,
	withSlider = false,
} ) {
	const [ currentSelectValue, setCurrentSelectValue ] = useState( getSelectValueFromFontSize( fontSizes, value ) );

	if ( disableCustomFontSizes && ! fontSizes.length ) {
		return null;
	}

	const onChangeValue = ( event ) => {
		const newValue = event.target.value;
		if ( newValue === '' ) {
			setDefault();
			return;
		}
		setCurrentSelectValue( getSelectValueFromFontSize( fontSizes, Number( newValue ) ) );
		onChange( Number( newValue ) );
	};

	const onSelectChangeValue = ( eventValue ) => {
		if ( eventValue === DEFAULT_FONT_SIZE ) {
			setDefault();
			return;
		}
		const selectedFont = fontSizes.find( ( font ) => font.slug === eventValue );
		setCurrentSelectValue( eventValue );
		onChange( selectedFont.size );
	};

	const setDefault = () => {
		onChange( undefined );
		setCurrentSelectValue( getSelectValueFromFontSize( fontSizes, undefined ) );
	};

	return (
		<fieldset className="components-font-size-picker">
			<legend>
				{ __( 'Font Size' ) }
			</legend>
			<div className="components-font-size-picker__controls">
				{ ( fontSizes.length > 0 ) &&
					<SelectControl
						className={ 'components-font-size-picker__select' }
						label={ 'Choose preset' }
						hideLabelFromVision={ true }
						value={ currentSelectValue }
						onChange={ onSelectChangeValue }
						options={ getSelectOptions( fontSizes ) }
					/>
				}
				{ ( ! withSlider && ! disableCustomFontSizes ) &&
					<input
						className="components-range-control__number"
						type="number"
						onChange={ onChangeValue }
						aria-label={ __( 'Custom' ) }
						value={ value || '' }
					/>
				}
				<Button
					className="components-color-palette__clear"
					type="button"
					disabled={ value === undefined }
					onClick={ setDefault }
					isSmall
					isDefault
				>
					{ __( 'Reset' ) }
				</Button>
			</div>
			{ withSlider &&
				<RangeControl
					className="components-font-size-picker__custom-input"
					label={ __( 'Custom Size' ) }
					value={ value || '' }
					initialPosition={ fallbackFontSize }
					onChange={ onChange }
					min={ 12 }
					max={ 100 }
					beforeIcon="editor-textcolor"
					afterIcon="editor-textcolor"
				/>
			}
		</fieldset>
	);
}

export default FontSizePicker;

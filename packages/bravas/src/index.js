/**
 * Internal dependencies
 */
import { varsys } from './varsys';

const defaultThemeConfig = {
	button: {
		backgroundColor: '#32373c',
		textColor: 'white',
	},
};

varsys.apply( defaultThemeConfig );

window.bravas = {
	varsys,
};

export * from './varsys';

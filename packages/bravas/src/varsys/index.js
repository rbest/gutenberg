// Varsys - Variable System

function noop() {
	return undefined;
}

const createCssVarProp = ( {
	namespace = '',
	key = '',
	parentNamespace = '',
} ) => {
	const baseName = parentNamespace ? `${ parentNamespace }-${ key }` : key;
	if ( ! namespace ) {
		return `--${ baseName }`;
	}
	return `--${ namespace }-${ baseName }`;
};

const addCssVarToDocument = ( prop, value ) => {
	document.documentElement.style.setProperty( prop, value );
};

const recursivelyApplyCssProps = ( {
	namespace = '',
	props = '',
	parentNamespace = '',
	setState = noop,
} ) => {
	const keys = Object.keys( props );
	keys.forEach( ( key ) => {
		const value = props[ key ];
		if ( typeof value === 'object' ) {
			const prevKey = parentNamespace ? `${ parentNamespace }-${ key }` : key;
			recursivelyApplyCssProps( {
				namespace,
				props: value,
				parentNamespace: prevKey,
				setState,
			} );
		} else {
			const cssVarProp = createCssVarProp( {
				namespace,
				key,
				parentNamespace,
			} );
			setState( {
				[ cssVarProp ]: value,
			} );
		}
	} );
};

// const themeVar = ( preferredVar, defaultVar, fallbackVar ) => {
// 	return `var(${ preferredVar }, var(${ defaultVar }, ${ fallbackVar }))`;
// };

export const createVarsys = ( options ) => {
	const { namespace = '', observables = [] } = options;
	let state = {};

	const __updateState = () => {
		Object.keys( state ).forEach( ( key ) => {
			addCssVarToDocument( key, state[ key ] );
		} );
	};

	const setState = ( nextState ) => {
		state = { ...state, ...nextState };
		__updateState();
	};

	let observable;

	// const handleOnChange = () => {};

	if ( observables.length ) {
	}

	return {
		observable,
		apply: ( props ) => {
			recursivelyApplyCssProps( { namespace, props, setState } );
		},
		render: () => {
			__updateState();
		},
		destroy: () => {
			if ( observable ) {
				observable.disconnect();
			}
		},
		getState: () => state,
		onChange: () => {},
	};
};

export const varsys = createVarsys( { namespace: 'bravas' } );

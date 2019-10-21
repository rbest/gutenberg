/**
 * External dependencies
 */
import { times } from 'lodash';

/**
 * WordPress dependencies
 */
import { IconButton } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { PageControlIcon } from './vectors';

export default function PageControl( { currentPage, numberOfPages, setCurrentPage } ) {
	return (
		<div className="edit-post-welcome-guide-modal__page-control">
			{ times( numberOfPages, ( page ) => (
				<IconButton
					key={ page }
					icon={ <PageControlIcon isSelected={ page === currentPage } /> }
					onClick={ () => setCurrentPage( page ) }
				/>
			) ) }
		</div>
	);
}

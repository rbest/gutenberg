/**
 * WordPress dependencies
 */
import { useState, Children } from '@wordpress/element';
import { KeyboardShortcuts, IconButton, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PageControl from './page-control';
import { BackButtonIcon, ForwardButtonIcon } from './vectors';

function Guide( { onRequestClose, children } ) {
	const [ currentPage, setCurrentPage ] = useState( 0 );

	const numberOfPages = Children.count( children );
	const canGoBack = currentPage > 0;
	const canGoForward = currentPage < numberOfPages - 1;

	const goBack = () => {
		if ( canGoBack ) {
			setCurrentPage( currentPage - 1 );
		}
	};

	const goForward = () => {
		if ( canGoForward ) {
			setCurrentPage( currentPage + 1 );
		}
	};

	return (
		<div className="edit-post-welcome-guide-modal__guide">
			<KeyboardShortcuts key={ currentPage } shortcuts={ {
				left: goBack,
				right: goForward,
			} } />
			{ children[ currentPage ] }
			<div className="edit-post-welcome-guide-modal__footer">
				{ canGoBack && (
					<IconButton
						className="edit-post-welcome-guide-modal__back-button"
						icon={ <BackButtonIcon /> }
						onClick={ goBack }
					>
						{ __( 'Previous' ) }
					</IconButton>
				) }
				<PageControl
					currentPage={ currentPage }
					numberOfPages={ numberOfPages }
					setCurrentPage={ setCurrentPage }
				/>
				{ canGoForward && (
					<IconButton
						className="edit-post-welcome-guide-modal__forward-button"
						icon={ <ForwardButtonIcon /> }
						onClick={ goForward }
					>
						{ __( 'Next' ) }
					</IconButton>
				) }
				{ ! canGoForward && (
					<Button
						className="edit-post-welcome-guide-modal__start-button"
						isPrimary
						isLarge
						onClick={ onRequestClose }
					>
						{ __( 'Get started' ) }
					</Button>
				) }
			</div>
		</div>
	);
}

function Page( { children } ) {
	return (
		<div className="edit-post-welcome-guide-modal__page">
			{ children }
		</div>
	);
}

Guide.Page = Page;

export default Guide;

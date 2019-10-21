/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { Modal } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Guide from './guide';
import { CanvasImage, EditorImage, BlockLibraryImage, inserterIconHTML } from './vectors';

export default function WelcomeGuideModal() {
	const isOpen = useSelect( ( select ) =>
		select( 'core/edit-post' ).isFeatureActive( 'welcomeGuide' ) );

	const { toggleFeature } = useDispatch( 'core/edit-post' );

	if ( ! isOpen ) {
		return null;
	}

	const closeModal = () => {
		toggleFeature( 'welcomeGuide' );
	};

	return (
		<Modal className="edit-post-welcome-guide-modal" onRequestClose={ closeModal }>
			<Guide onRequestClose={ closeModal }>
				<Guide.Page>
					<CanvasImage />
					<div className="edit-post-welcome-guide-modal__text">
						<h1>{ __( 'Welcome to the block editor' ) }</h1>
						<p>
							{ __( 'In the WordPress editor, each paragraph, image, or video is presented as a distinct “block” of content.' ) }
						</p>
					</div>
				</Guide.Page>
				<Guide.Page>
					<EditorImage />
					<div className="edit-post-welcome-guide-modal__text">
						<h1>{ __( 'Make each block your own' ) }</h1>
						<p>
							{ __( 'Each block comes with its own set of controls for changing things like color, width, and alignment. These will show and hide automatically when you have a block selected.' ) }
						</p>
					</div>
				</Guide.Page>
				<Guide.Page>
					<BlockLibraryImage />
					<div className="edit-post-welcome-guide-modal__text">
						<h1>{ __( 'Get to know the block library' ) }</h1>
						<p dangerouslySetInnerHTML={ {
							__html: sprintf(
								/* translators: %s: HTML which displays the inserter icon. */
								__( 'All of the blocks available to you live in the Block Library. You’ll find it wherever you see the %s icon.' ),
								inserterIconHTML
							),
						} } />
					</div>
				</Guide.Page>
			</Guide>
		</Modal>
	);
}

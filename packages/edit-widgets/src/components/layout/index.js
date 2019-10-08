/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	navigateRegions,
	Popover,
	SlotFillProvider,
} from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Header from '../header';
import Sidebar from '../sidebar';
import WidgetAreas from '../widget-areas';
import Notices from '../notices';

function Layout( { blockEditorSettings } ) {
	const [ selectedArea, setSelectedArea ] = useState( null );
	const onFocus = useCallback(
		() => {
			setSelectedArea( null );
		},
		[ setSelectedArea ]
	);
	return (
		<SlotFillProvider>
			<Header />
			<Sidebar />
			<Notices />
			<div
				className="edit-widgets-layout__content"
				role="region"
				aria-label={ __( 'Widgets screen content' ) }
				tabIndex="-1"
				onFocus={ onFocus }
			>
				<WidgetAreas
					selectedArea={ selectedArea }
					setSelectedArea={ setSelectedArea }
					blockEditorSettings={ blockEditorSettings }
				/>
			</div>
			<Popover.Slot />
		</SlotFillProvider>
	);
}

export default navigateRegions( Layout );

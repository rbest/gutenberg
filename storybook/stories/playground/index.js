/**
 * WordPress dependencies
 */
import '@wordpress/editor'; // This shouldn't be necessary

import { useEffect, useState } from '@wordpress/element';
import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
	BlockInspector,
	WritingFlow,
	ObserveTyping,
} from '@wordpress/block-editor';
import {
	Popover,
	SlotFillProvider,
	DropZoneProvider,
} from '@wordpress/components';
import { registerCoreBlocks } from '@wordpress/block-library';
import '@wordpress/format-library';
import '@wordpress/bravas';

/* eslint-disable no-restricted-syntax */
import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';
import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/editor.css';
import '@wordpress/block-library/build-style/theme.css';
import '@wordpress/format-library/build-style/style.css';
/* eslint-enable no-restricted-syntax */

/**
 * Internal dependencies
 */
import './style.scss';

const initialBlocks = [
	{
		clientId: '774ac3eb-a738-48f9-bf54-ed2543c7eaac',
		name: 'core/button',
		isValid: true,
		attributes: {
			text: 'Default Button',
			// backgroundColor: 'vivid-cyan-blue',
		},
		innerBlocks: [],
	},
	{
		clientId: 'f5773595-554d-48f8-8e70-d01325a946ea',
		name: 'core/button',
		isValid: true,
		attributes: {
			text: 'Christmas Button',
			// textColor: 'vivid-green-cyan',
			// backgroundColor: 'vivid-red',
		},
		innerBlocks: [],
	},
	{
		clientId: 'a5e69d80-f235-4849-9b8a-e7cb75630b4e',
		name: 'core/paragraph',
		isValid: true,
		attributes: {
			content: 'This is paragraph',
			dropCap: false,
		},
		innerBlocks: [],
	},
];

function App() {
	const [ blocks, updateBlocks ] = useState( initialBlocks );

	useEffect( () => {
		registerCoreBlocks();
	}, [] );

	return (
		<div className="playground">
			<SlotFillProvider>
				<DropZoneProvider>
					<BlockEditorProvider
						value={ blocks }
						onInput={ updateBlocks }
						onChange={ updateBlocks }
					>
						<div className="playground__sidebar">
							<BlockInspector />
						</div>
						<div className="editor-styles-wrapper">
							<BlockEditorKeyboardShortcuts />
							<WritingFlow>
								<ObserveTyping>
									<BlockList />
								</ObserveTyping>
							</WritingFlow>
						</div>
						<Popover.Slot />
					</BlockEditorProvider>
				</DropZoneProvider>
			</SlotFillProvider>
		</div>
	);
}

export default {
	title: 'Playground|Block Editor',
};

export const _default = () => {
	return <App />;
};

/**
 * External dependencies
 */
import uuid from 'uuid/v4';
import classnames from 'classnames';
import { WidthProvider, Responsive } from 'react-grid-layout';

/**
 * WordPress dependencies
 */
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { serialize } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import BlockAsyncModeProvider from './block-async-mode-provider';
import BlockListBlock from './block';
import BlockListAppender from '../block-list-appender';
import ButtonBlockAppender from '../inner-blocks/button-block-appender';

function appendNewBlocks(
	prevBlockClientIds,
	blockClientIds,
	nextLayouts,
	lastClickedBlockAppenderId
) {
	if (
		blockClientIds.length &&
		! prevBlockClientIds.includes( blockClientIds[ blockClientIds.length - 1 ] )
	) {
		const appenderItem = nextLayouts.xs.find(
			( item ) => item.i === lastClickedBlockAppenderId
		);
		nextLayouts = {
			...nextLayouts,
			xs: nextLayouts.xs
				.map( ( item ) => {
					switch ( item.i ) {
						case lastClickedBlockAppenderId:
							return {
								...appenderItem,
								i: `block-${ blockClientIds[ blockClientIds.length - 1 ] }`,
							};
						case blockClientIds[ blockClientIds.length - 1 ]:
							return null;
						default:
							return item;
					}
				} )
				.filter( ( item ) => item ),
		};
	}

	return nextLayouts;
}

function resizeOverflowingBlocks( nodes, nextLayouts ) {
	const cellChanges = {};
	for ( const node of Object.values( nodes ) ) {
		const foundItem = nextLayouts.xs.find( ( item ) => item.i === node.id );
		if ( ! foundItem ) {
			continue;
		}

		const { clientWidth, clientHeight } = node.parentNode;
		const minCols = Math.ceil( node.offsetWidth / ( clientWidth / foundItem.w ) );
		const minRows = Math.ceil(
			( node.offsetHeight - 20 ) / ( clientHeight / foundItem.h )
		);
		if ( foundItem.w < minCols || foundItem.h < minRows ) {
			cellChanges[ node.id ] = {
				w: Math.max( foundItem.w, minCols ),
				h: Math.max( foundItem.h, minRows ),
			};
		}
	}
	if ( Object.keys( cellChanges ).length ) {
		nextLayouts = {
			...nextLayouts,
			xs: nextLayouts.xs.map( ( item ) =>
				cellChanges[ item.i ] ? { ...item, ...cellChanges[ item.i ] } : item
			),
		};
	}

	return nextLayouts;
}

function cropAndFillEmptyCells( nextLayouts ) {
	const maxRow = Math.max(
		2,
		...nextLayouts.xs
			.filter( ( item ) => ! item.i.startsWith( 'block-appender' ) )
			.map( ( item ) => item.y + item.h - 1 )
	);
	if ( nextLayouts.xs.some( ( item ) => item.y > maxRow ) ) {
		nextLayouts = {
			...nextLayouts,
			xs: nextLayouts.xs.filter( ( item ) => item.y <= maxRow ),
		};
	}

	const emptyCells = {};
	for (
		let col = 0;
		col <= Math.max( 3, ...nextLayouts.xs.map( ( item ) => item.x + item.w - 1 ) );
		col++
	) {
		for ( let row = 0; row <= maxRow; row++ ) {
			emptyCells[ `${ col } | ${ row }` ] = true;
		}
	}
	for ( const item of nextLayouts.xs ) {
		for ( let col = item.x; col < item.x + item.w; col++ ) {
			for ( let row = item.y; row < item.y + item.h; row++ ) {
				delete emptyCells[ `${ col } | ${ row }` ];
			}
		}
	}
	if ( Object.keys( emptyCells ).length ) {
		nextLayouts = {
			...nextLayouts,
			xs: [
				...nextLayouts.xs,
				...Object.keys( emptyCells ).map( ( emptyCell ) => {
					const [ col, row ] = emptyCell.split( ' | ' );
					return {
						i: `block-appender-${ uuid() }`,
						x: Number( col ),
						y: Number( row ),
						w: 1,
						h: 1,
					};
				} ),
			],
		};
	}

	return nextLayouts;
}

const ResponsiveGridLayout = WidthProvider( Responsive );
function BlockGrid( {
	rootClientId,
	blockClientIds,
	nodes,
	className,
	hasMultiSelection,
	multiSelectedBlockClientIds,
	selectedBlockClientId,
	setBlockRef,
	onSelectionStart,
} ) {
	const { grid } = useSelect(
		( select ) => select( 'core/block-editor' ).getBlockAttributes( rootClientId ),
		[ rootClientId ]
	);
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	const [ layouts, setLayouts ] = useState(
		grid ?
			{
				...grid,
				xs: [
					...grid.xs.map( ( item, i ) => ( {
						...item,
						i: `block-${ blockClientIds[ i ] }`,
					} ) ),
				],
			} :
			{
				xs: [ ...new Array( 12 ) ].map( ( n, i ) => ( {
					i: `block-appender-${ i }`,
					x: i % 4,
					y: Math.floor( i / 4 ),
					w: 1,
					h: 1,
				} ) ),
			}
	);

	const lastClickedBlockAppenderIdRef = useRef();
	const blockClientIdsRef = useRef( blockClientIds );

	useEffect( () => {
		let nextLayouts = layouts;

		nextLayouts = appendNewBlocks(
			blockClientIdsRef.current,
			blockClientIds,
			nextLayouts,
			lastClickedBlockAppenderIdRef.current
		);
		nextLayouts = resizeOverflowingBlocks( nodes, nextLayouts );
		nextLayouts = cropAndFillEmptyCells( nextLayouts );

		if ( layouts !== nextLayouts ) {
			setLayouts( nextLayouts );
		}

		blockClientIdsRef.current = blockClientIds;
	}, [ layouts, blockClientIds, nodes ] );

	return (
		<div
			className={ classnames(
				'editor-block-list__layout block-editor-block-list__layout block-editor-block-list__grid',
				className
			) }
		>
			<ResponsiveGridLayout
				verticalCompact={ false }
				draggableCancel='input,textarea,[contenteditable=""],[contenteditable="true"]'
				layouts={ layouts }
				margin={ [ 0, 0 ] }
				onLayoutChange={ ( layout, nextLayouts ) => {
					setLayouts( nextLayouts );
					updateBlockAttributes( rootClientId, {
						grid: Object.keys( nextLayouts ).reduce( ( acc, breakpoint ) => {
							acc[ breakpoint ] = nextLayouts[ breakpoint ].filter(
								( item ) => ! item.i.startsWith( 'block-appender' )
							);
							return acc;
						}, {} ),
					} );
				} }
			>
				{ [
					...layouts.xs
						.filter( ( item ) => item.i.startsWith( 'block-appender' ) )
						.map( ( item ) => (
							<div
								key={ item.i }
								id={ item.i }
								onClick={ ( { currentTarget: { id } } ) =>
									( lastClickedBlockAppenderIdRef.current = id )
								}
								onKeyPress={ ( { currentTarget: { id } } ) =>
									( lastClickedBlockAppenderIdRef.current = id )
								}
								role="button"
								tabIndex="0"
							>
								<BlockListAppender
									rootClientId={ rootClientId }
									renderAppender={ ButtonBlockAppender }
								/>
							</div>
						) ),
					...blockClientIds.map( ( clientId ) => {
						const isBlockInSelection = hasMultiSelection ?
							multiSelectedBlockClientIds.includes( clientId ) :
							selectedBlockClientId === clientId;

						return (
							<div
								key={ 'block-' + clientId }
								style={ {
									padding: '0 20px',
								} }
							>
								<BlockAsyncModeProvider
									key={ 'block-' + clientId }
									clientId={ clientId }
									isBlockInSelection={ isBlockInSelection }
								>
									<BlockListBlock
										rootClientId={ rootClientId }
										clientId={ clientId }
										blockRef={ setBlockRef }
										onSelectionStart={ onSelectionStart }
										isLocked
									/>
								</BlockAsyncModeProvider>
							</div>
						);
					} ),
				] }
			</ResponsiveGridLayout>
		</div>
	);
}

BlockGrid.Content = ( { attributes: { grid }, innerBlocks } ) => {
	const maxRow = Math.max(
		2,
		...grid.xs
			.filter( ( item ) => ! item.i.startsWith( 'block-appender' ) )
			.map( ( item ) => item.y + item.h - 1 )
	);
	const maxCol = Math.max( 3, ...grid.xs.map( ( item ) => item.x + item.w - 1 ) );
	return (
		<div
			className="grid"
			style={ {
				display: 'grid',
				gridTemplateRows: `repeat(${ maxRow + 1 }, 1fr)`,
				gridTemplateColumns: `repeat(${ maxCol + 1 }, 1fr)`,
			} }
		>
			{ grid.xs.map( ( item, i ) => (
				<div
					key={ i }
					style={ {
						gridArea: `${ item.y + 1 } / ${ item.x + 1 } / ${ item.y +
							1 +
							item.h } / ${ item.x + 1 + item.w }`,
					} }
				>
					{ innerBlocks[ i ] && (
						<RawHTML key={ innerBlocks[ i ].clientId }>
							{ serialize( innerBlocks[ i ], { isInnerBlocks: true } ) }
						</RawHTML>
					) }
				</div>
			) ) }
		</div>
	);
};

export default BlockGrid;

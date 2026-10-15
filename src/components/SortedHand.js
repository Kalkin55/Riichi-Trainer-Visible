import React from 'react';
import { Row } from 'reactstrap';
import Tile from './Tile';
import { convertRedFives } from '../scripts/TileConversions';

/** Returns the efficiency info for a tile, or undefined if efficiency isn't being shown. */
function getEfficiency(props, tile) {
    if (!props.efficiency) return undefined;
    return props.efficiency[convertRedFives(tile)];
}

function SortedHand(props) {
    const tiles = [];

    let hand = props.tiles;

    if (!hand) {
        return <Row />;
    }

    let lastDraw = props.lastDraw;
    let index = 0;

    for (let i = 0; i < hand.length; i++) {
        tiles.push((
            <Tile className="handTile"
                key={index++}
                tile={hand[i]}
                efficiency={getEfficiency(props, hand[i])}
                efficiencyRevealed={props.efficiencyRevealed}
                onClick={props.onTileClick}
                showIndexes={props.showIndexes}
            />
        ));
    }

    if (lastDraw > -1) {
        tiles.push((
            <Tile className="handTile"
                key={index++}
                tile={lastDraw}
                efficiency={getEfficiency(props, lastDraw)}
                efficiencyRevealed={props.efficiencyRevealed}
                onClick={props.onTileClick}
                showIndexes={props.showIndexes}
            />
        ));
    }

    return (
        <Row>
            {tiles}
        </Row>
    );
}

export default SortedHand;
import React from 'react';
import { Row } from 'reactstrap';
import Tile from './Tile';
import { convertRedFives } from '../scripts/TileConversions';

/** Returns the efficiency info for a tile, or undefined if efficiency isn't being shown. */
function getEfficiency(props, tile) {
    if (!props.efficiency) return undefined;
    return props.efficiency[convertRedFives(tile)];
}

function Hand(props) {
    const tiles = [];
    let index = 0;

    let hand = props.tiles;

    if (!hand) {
        return <Row />;
    }

    let lastDraw = props.lastDraw;
    let hasLastDraw = lastDraw > -1;

    if (hasLastDraw) {
        hand[lastDraw]--;
    }

    for (let i = 0; i < hand.length; i++) {
        if (i % 10 === 5 && hand[i - 5] > 0) {
            for (let j = 0; j < hand[i - 5]; j++) {
                tiles.push((
                    <Tile className="handTile"
                        key={index++}
                        tile={i - 5}
                        displayTile={hasLastDraw && props.blind ? 30 : i - 5}
                        efficiency={getEfficiency(props, i - 5)}
                        efficiencyRevealed={props.efficiencyRevealed}
                        onClick={props.onTileClick}
                        showIndexes={props.showIndexes}
                    />
                ));
            }
        }

        if (hand[i] === 0) continue;
        if (i % 10 === 0) continue;

        for (let j = 0; j < hand[i]; j++) {
            tiles.push((
                <Tile className="handTile"
                    key={index++}
                    tile={i}
                    displayTile={hasLastDraw && props.blind ? 30 : i}
                    efficiency={getEfficiency(props, i)}
                    efficiencyRevealed={props.efficiencyRevealed}
                    onClick={props.onTileClick}
                    showIndexes={props.showIndexes}
                />
            ));
        }

    }

    if (hasLastDraw) {
        hand[lastDraw]++;
        tiles.push((
            <Tile className="handTile"
                key={index++}
                tile={lastDraw}
                displayTile={lastDraw}
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

export default Hand;
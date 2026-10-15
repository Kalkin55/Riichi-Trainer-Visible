import React from 'react';
import { getTileImage, getTileAsText } from '../scripts/TileConversions';
import { useTranslation } from 'react-i18next';
import { TILE_INDEXES } from '../Constants';

/**
 * Picks a color for a discard's efficiency label. Forward discards go from orange (worst forward discard) to green (best).
 * Backward discards are red, and are additionally struck through by their CSS class.
 * @param {DiscardEfficiency} efficiency
 */
function getEfficiencyColor(efficiency) {
    if (efficiency.backward) return "hsl(0, 75%, 45%)";

    let hue = 30 + 90 * efficiency.ratio;
    return `hsl(${hue}, 70%, ${efficiency.best ? 32 : 40}%)`;
}

function EfficiencyLabel(props) {
    let { t } = useTranslation();
    let efficiency = props.efficiency;

    if (!props.revealed || !efficiency) {
        return <span className="efficiency efficiencyHidden">&nbsp;</span>;
    }

    let className = "efficiency";
    if (efficiency.best) className += " efficiencyBest";
    if (efficiency.backward) className += " efficiencyBackward";

    let title = efficiency.backward
        ? t("trainer.efficiency.backwardTitle", { ukeire: efficiency.ukeire })
        : t("trainer.efficiency.title", { ukeire: efficiency.ukeire });

    return (
        <span className={className} style={{ backgroundColor: getEfficiencyColor(efficiency) }} title={title}>
            {efficiency.ukeire}
        </span>
    );
}

function Tile(props) {
    let { t } = useTranslation();

    let displayTile = props.displayTile || props.tile;
    let showEfficiency = props.efficiency !== undefined;

    return (
        <div className={props.className + (showEfficiency ? " withEfficiency" : "")}>
            {showEfficiency && <EfficiencyLabel efficiency={props.efficiency} revealed={props.efficiencyRevealed} />}
            <img
                className="tile"
                name={props.tile}
                src={getTileImage(displayTile)}
                title={getTileAsText(t, displayTile)}
                alt={getTileAsText(t, displayTile)}
                onClick={props.onClick}
            />
            <span className="index">{props.showIndexes ? TILE_INDEXES[displayTile] : ""}</span>
        </div>
    );
}

export default Tile;

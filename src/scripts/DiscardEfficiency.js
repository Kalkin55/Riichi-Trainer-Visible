import { convertRedFives } from "./TileConversions";
import { calculateUkeire } from "./UkeireCalculator";

/**
 * @typedef {Object} DiscardEfficiency
 * @property {number} ukeire The number of unseen tiles that would reduce the shanten of the hand after this discard.
 * @property {number} shanten The shanten of the hand after this discard.
 * @property {boolean} backward Whether this discard increases the hand's shanten compared to the best discard.
 * @property {boolean} best Whether this discard is tied for the highest ukeire without going backward.
 * @property {number} ratio Where this discard's ukeire falls between the worst (0) and best (1) discards that don't go backward. 0 for backward discards.
 */

/**
 * Calculates the efficiency of each possible discard, for displaying above each tile.
 * Unlike calculateDiscardUkeire, discards that increase shanten are given their real ukeire
 * (counted against their own shanten) and flagged as backward, rather than being reported as 0.
 * @param {TileCounts} hand The number of each tile in the player's hand.
 * @param {TileCounts} remainingTiles The number of each tile the player cannot see.
 * @param {Function} shantenFunction The function to use to calculate shanten.
 * @returns {DiscardEfficiency[]} The efficiency of each discard, indexed by tile with red fives converted. Undefined for tiles not in the hand.
 */
export function calculateDiscardEfficiency(hand, remainingTiles, shantenFunction) {
    let results = Array(hand.length).fill(undefined);
    let convertedHand = convertRedFives(hand);
    let bestShanten = Infinity;

    for (let tile = 0; tile < convertedHand.length; tile++) {
        if (convertedHand[tile] === 0) continue;

        convertedHand[tile]--;
        let shanten = shantenFunction(convertedHand);
        let ukeire = calculateUkeire(convertedHand, remainingTiles, shantenFunction, shanten).value;
        convertedHand[tile]++;

        results[tile] = { ukeire, shanten, backward: false, best: false, ratio: 0 };
        bestShanten = Math.min(bestShanten, shanten);
    }

    let bestUkeire = 0;
    let worstUkeire = Infinity;

    for (let result of results) {
        if (!result) continue;

        result.backward = result.shanten > bestShanten;
        if (result.backward) continue;

        bestUkeire = Math.max(bestUkeire, result.ukeire);
        worstUkeire = Math.min(worstUkeire, result.ukeire);
    }

    for (let result of results) {
        if (!result || result.backward) continue;

        // Spread the forward discards across the full range so small differences are still easy to see.
        result.ratio = bestUkeire > worstUkeire ? (result.ukeire - worstUkeire) / (bestUkeire - worstUkeire) : 1;
        result.best = result.ukeire === bestUkeire;
    }

    return results;
}

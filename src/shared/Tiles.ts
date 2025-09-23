export class Tile {
	name: string;
	// friendlyName: string;
	// description: string;
	weight: number;
	polarity: Polarity;

	constructor(name: string, weight: number, polarity: Polarity = Polarity.NONE) {
		this.name = name;
		this.weight = weight;
		this.polarity = polarity;
	}
}

export enum Polarity {
	NONE,
	LEFT,
	RIGHT,
}

export function canModify(base: Polarity, modifier: Polarity): boolean {
	if (base === Polarity.NONE) return true;
	if (base === modifier) return false;
	return true;
}

export function modifyPolarity(base: Polarity, modifier: Polarity): Polarity {
	// If base is NONE, adopt the modifier
	if (base === Polarity.NONE) return modifier;

	// If modifier is NONE, keep the base
	if (modifier === Polarity.NONE) return base;

	// If both are the same, keep the base
	if (base === modifier) return base;

	// If they are opposite, cancel out
	return Polarity.NONE;
}

export function PullTile(currentPolarity: Polarity, tileset: [Tile]): [Polarity, Tile] {
	const tile = tileset[math.floor(math.random() * tileset.size())];
	if (canModify(currentPolarity, tile.polarity)) {
		return [modifyPolarity(currentPolarity, tile.polarity), tile];
	} else {
		return PullTile(currentPolarity, tileset);
	}
}

export const tiles = [new Tile("Jumps", 4)];

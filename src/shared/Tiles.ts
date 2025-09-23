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

export function PullTile(currentPolarity: Polarity, tileset: [Tile]): [Polarity, Tile] {
	const tile = tileset[math.floor(math.random() * tileset.size())];
	if (canModify(currentPolarity, tile.polarity)) {
		return [tile.polarity === Polarity.NONE ? currentPolarity : tile.polarity, tile];
	} else {
		return PullTile(currentPolarity, tileset);
	}
}

export const tiles = [new Tile("Jumps", 4)];

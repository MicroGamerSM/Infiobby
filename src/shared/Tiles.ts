import { Possible } from "./types";

const ComponentsFolder = game.Workspace.FindFirstChild("Parts");

export class Tile {
	component: Model;
	// friendlyName: string;
	// description: string;
	weight: number;
	polarity: Polarity;

	Initialize(): Model {
		const part = this.component.Clone();
		const module: Possible<ModuleScript> = part.FindFirstChildOfClass("ModuleScript");
		if (module !== undefined) {
			// eslint breaks here.
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			const setup: unknown = require(module);
			if (typeIs(setup, "function")) {
				setup();
			}
		}
		return part;
	}

	constructor(name: string, weight: number, polarity: Polarity = Polarity.NONE) {
		this.component = (ComponentsFolder?.FindFirstChild(name) as Model) ?? error(`could not find ${name}`);
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

export function PullTile(currentPolarity: Polarity, tileset: TilePool): [Polarity, Tile] {
	const tile = tileset[math.floor(math.random() * tileset.size())];
	if (canModify(currentPolarity, tile.polarity)) {
		return [modifyPolarity(currentPolarity, tile.polarity), tile];
	} else {
		return PullTile(currentPolarity, tileset);
	}
}

export const tiles = [new Tile("Jumps", 4)];

export type TilePool = Tile[];

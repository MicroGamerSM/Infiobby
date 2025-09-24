import { Polarity } from "shared/Tiles";

export class TileSpawner {
	checkpointAndLevelSpawnTogether: boolean = false;
	timeToRise: number;
	timetoStay: number;
	timeToFall: number;

	origin: CFrame;
	private currentStart: CFrame;
	private polarity: Polarity;

	Reset() {
		this.currentStart = this.origin;
	}

	AddTileAsync() {}

	constructor(
		checkpointAndLevelSpawnTogether: boolean,
		timeToRise: number,
		timeToStay: number,
		timeToFall: number,
		origin: CFrame,
	) {
		this.checkpointAndLevelSpawnTogether = checkpointAndLevelSpawnTogether;
		this.timeToRise = timeToRise;
		this.timetoStay = timeToStay;
		this.timeToFall = timeToFall;
		this.origin = origin;
		this.currentStart = origin;

		this.polarity = Polarity.NONE;
	}
}

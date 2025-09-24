export class TileSpawner {
	checkpointAndLevelSpawnTogether: boolean = false;
	timeToRise: number;
	timetoStay: number;
	timeToFall: number;

	private origin: CFrame;
	private currentStart: CFrame;

	Reset() {
		this.currentStart = this.origin;
	}

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
	}
}

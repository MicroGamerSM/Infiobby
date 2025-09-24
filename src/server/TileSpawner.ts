import { Polarity, PullTile, TilePool } from "shared/Tiles";

const TweenService = game.GetService("TweenService");

export class TileSpawner {
	checkpointAndLevelSpawnTogether: boolean = false;
	timeToRise: number;
	timetoStay: number;
	timeToFall: number;

	origin: CFrame;

	private riseTweenInfo: TweenInfo;
	private fallTweenInfo: TweenInfo;

	private currentStart: CFrame;
	private polarity: Polarity;
	private queuedTiles: number;

	tilePool: TilePool;

	private CreateRiseTween(part: BasePart, goal: CFrame): Tween {
		return TweenService.Create(part, this.riseTweenInfo, {
			CFrame: goal,
		});
	}

	private CreateFallTween(part: BasePart, goal: CFrame): Tween {
		return TweenService.Create(part, this.fallTweenInfo, {
			CFrame: goal,
		});
	}

	Reset() {
		this.currentStart = this.origin;
		this.polarity = Polarity.NONE;
	}

	private SpawnTile() {
		const [newPolarity, tileRef] = PullTile(this.polarity, this.tilePool);
		this.polarity = newPolarity;
		const tile: Model = tileRef.Setup();

		const underCFrame = this.currentStart.add(new Vector3(0, -50, 0));
		const aboveCFrame = this.currentStart;

		tile.PivotTo(underCFrame);

		const riseTween = this.CreateRiseTween(tile.PrimaryPart!, aboveCFrame);
		riseTween.Play();
		riseTween.Completed.Wait();
		task.wait(this.timetoStay);
		const fallTween = this.CreateFallTween(tile.PrimaryPart!, underCFrame);
		fallTween.Play();

		task.spawn(() => {
			riseTween.Completed.Wait();
			task.wait(this.timetoStay);

			const fallTween = this.CreateFallTween(tile.PrimaryPart!, underCFrame);
			fallTween.Play();
		});
	}

	AddTileToQueue() {
		this.queuedTiles++;
	}

	AddQueuedTiles() {
		while (this.queuedTiles > 0) {
			this.SpawnTile();
			this.queuedTiles--;
		}
	}

	constructor(
		checkpointAndLevelSpawnTogether: boolean,
		timeToRise: number,
		timeToStay: number,
		timeToFall: number,
		origin: CFrame,
		tilePool: TilePool,
	) {
		this.checkpointAndLevelSpawnTogether = checkpointAndLevelSpawnTogether;
		this.timeToRise = timeToRise;
		this.timetoStay = timeToStay;
		this.timeToFall = timeToFall;
		this.tilePool = tilePool;

		this.origin = origin;

		this.currentStart = origin;
		this.polarity = Polarity.NONE;
		this.queuedTiles = 0;

		this.riseTweenInfo = new TweenInfo(this.timeToRise, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
		this.fallTweenInfo = new TweenInfo(this.timeToFall, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
	}
}

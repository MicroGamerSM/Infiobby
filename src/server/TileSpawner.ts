import { TweenService } from "@rbxts/services";
import { Polarity, PullTile, Tile, TilePool } from "shared/Tiles";
import { RemoveFromArray } from "shared/util";

export type CheckpointHitArguments = [Player, Model];

export class TileSpawner {
	checkpointRiseDelay: number;
	timeToRise: number;
	timetoStay: number;
	timeToFall: number;

	origin: CFrame;

	private riseTweenInfo: TweenInfo;
	private fallTweenInfo: TweenInfo;

	private currentStart: CFrame;
	private polarity: Polarity;
	private queuedTiles: number;

	private tiles: Model[];
	private onCheckpointConnections: ((...args: CheckpointHitArguments) => void)[] = [];

	tilePool: TilePool;
	checkpoint: Tile;

	public ConnectToCheckpoint(connection: (...args: CheckpointHitArguments) => void): () => void {
		this.onCheckpointConnections.push(connection);
		return () => {
			RemoveFromArray(this.onCheckpointConnections, connection);
		};
	}

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
		this.tiles.forEach((tile) => {
			tile.Destroy();
		});
		this.tiles = [];
		this.onCheckpointConnections = [];
	}

	private SpawnTile(tile: Model) {
		const underCFrame = this.currentStart.add(new Vector3(0, -50, 0));
		const aboveCFrame = this.currentStart;

		this.tiles.push(tile);
		tile.PivotTo(underCFrame);
		tile.Parent = game.Workspace;

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
			const indexes = this.tiles.map((model, index) => (model === tile ? index : undefined)).filterUndefined();
			indexes.forEach((index) => this.tiles.unorderedRemove(index));
		});
	}

	private SpawnRandomTile() {
		const [newPolarity, tileRef] = PullTile(this.polarity, this.tilePool);
		this.polarity = newPolarity;
		const tile: Model = tileRef.Initialize();
		this.SpawnTile(tile);
	}

	private SpawnCheckpoint() {
		const model = this.checkpoint.Initialize({
			OnHit: (player: Player) => {
				this.onCheckpointConnections.forEach((connection) => connection(player, model));
			},
		});
		this.SpawnTile(model);
	}

	AddTileToQueue(count: number = 1) {
		this.queuedTiles += count;
	}

	AddQueuedTiles() {
		while (this.queuedTiles > 0) {
			this.SpawnRandomTile();
			this.SpawnCheckpoint();
			this.queuedTiles--;
		}
	}

	constructor(
		origin: CFrame,
		tilePool: TilePool,
		timeToRise: number = 0.5,
		timeToStay: number = 3,
		timeToFall: number = 2,
		checkpointRiseDelay: number = 0,
	) {
		this.timeToRise = timeToRise;
		this.timetoStay = timeToStay;
		this.timeToFall = timeToFall;
		this.checkpointRiseDelay = checkpointRiseDelay;
		this.tilePool = tilePool;

		this.origin = origin;

		this.currentStart = origin;
		this.polarity = Polarity.NONE;
		this.queuedTiles = 0;

		this.riseTweenInfo = new TweenInfo(this.timeToRise, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);
		this.fallTweenInfo = new TweenInfo(this.timeToFall, Enum.EasingStyle.Quad, Enum.EasingDirection.Out);

		this.tiles = [];
		this.checkpoint = new Tile("Checkpoint", 0, Polarity.NONE);
	}
}

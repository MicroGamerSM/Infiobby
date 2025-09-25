import { Bridge, EventV2 } from "shared/Networker";
import { TileSpawner } from "./TileSpawner";

// Inform all players that the round has started.
const RoundStartedEvent: EventV2<undefined, undefined> = EventV2.Get("RoundStarted");
// Inform a player they have been teleported to the round.
const TeleportedIntoRoundEvent: EventV2<undefined, undefined> = EventV2.Get("TeleportedIntoRound");
// Inform all players that the round has ended.
const RoundEndEvent: EventV2<undefined, undefined> = EventV2.Get("RoundEnded");
// Know when a player hits a checkpoint (checkpoint hit is server-side)
const CheckpointHitBridge: Bridge<[Player, Model], undefined> = Bridge.Get("CheckpointHit");

export class RoundManager {
	activePlayers: Player[] = [];
	spawn: BasePart;
	spawner: TileSpawner;

	private active: boolean = false;
	private hitCheckpoints: Model[] = [];

	InitializePlayers(players: Player[]) {
		players.forEach((player) => {
			const index = this.activePlayers.push(player);
			player.Character?.PivotTo(this.spawn.CFrame);
			TeleportedIntoRoundEvent.FireClient(player);
			player.GetPropertyChangedSignal("Parent").Once(() => {
				this.activePlayers.remove(index);
			});

			player.GetPropertyChangedSignal("Character").Once(() => {
				this.activePlayers.remove(index);
			});
		});
	}

	StartRound(players: Player[]) {
		this.InitializePlayers(players);
		RoundStartedEvent.FireAllClients();

		this.active = true;

		CheckpointHitBridge.SetCrossCallback((player: Player, checkpoint: Model) => {
			print(`${player} hit a checkpoint!`);
			this.hitCheckpoints.push(checkpoint);
			this.spawner.AddTileToQueue();
		});
	}

	constructor(spawn: BasePart, spawner: TileSpawner) {
		this.spawn = spawn;
		this.spawner = spawner;
	}
}

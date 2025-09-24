import { EventV2 } from "shared/Networker";
import { TileSpawner } from "./TileSpawner";

// Inform all players that the round has started.
const RoundStartedEvent: EventV2<undefined, undefined> = EventV2.Get("RoundStarted");
// Inform a player they have been teleported to the round.
const TeleportedIntoRoundEvent: EventV2<undefined, undefined> = EventV2.Get("TeleportedIntoRound");
// Inform all players that the round has ended.
const RoundEndEvent: EventV2<undefined, undefined> = EventV2.Get("RoundEnded");

class RoundManager {
	activePlayers: Player[] = [];
	spawn: BasePart;
	spawner: TileSpawner;

	TeleportPlayers() {
		this.activePlayers.forEach((player) => {
			player.Character?.PivotTo(this.spawn.CFrame);
			TeleportedIntoRoundEvent.FireClient(player);
		});
	}

	StartRound(players: Player[]) {
		this.activePlayers = players;
		RoundStartedEvent.FireAllClients();
		this.TeleportPlayers();
	}

	constructor(spawn: BasePart, spawner: TileSpawner) {
		this.spawn = spawn;
		this.spawner = spawner;
	}
}

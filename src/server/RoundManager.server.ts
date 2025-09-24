import { EventV2 } from "shared/Networker";

// Inform all players that the round has started.
const RoundStartedEvent: EventV2<undefined, undefined> = EventV2.Get("RoundStarted");
// Inform a player they have been teleported to the round.
const TeleportedIntoRoundEvent: EventV2<undefined, undefined> = EventV2.Get("TeleportedIntoRound");
// Inform all players that the round has ended.
const RoundEndEvent: EventV2<undefined, undefined> = EventV2.Get("RoundEnded");

class RoundManager {
	activePlayers: Player[] = [];
	spawnPart: BasePart;
	startPart: BasePart;
	generationBeginPoint: BasePart;

	TeleportPlayers() {
		this.activePlayers.forEach((player) => {
			player.Character?.MoveTo(this.spawnPart.Position);
			TeleportedIntoRoundEvent.FireClient(player);
		});
	}

	StartRound(players: Player[]) {
		this.activePlayers = players;
		RoundStartedEvent.FireAllClients();
		this.TeleportPlayers();
	}

	constructor(spawn: BasePart, start: BasePart) {
		this.spawnPart = spawn;
		this.startPart = start;
		this.generationBeginPoint = start;
	}
}

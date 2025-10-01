import { RemoveFromArray } from "shared/util";
import { TileSpawner } from "./TileSpawner";

const Players = game.GetService("Players");

type Disconnectable = RBXScriptConnection | (() => void);

//#region Meta
export enum RoundState {
	LOBBY,
	COUNTDOWN,
	STARTING,
	RUNNING,
	ENDING,
	RESETTING,
}

interface RoundReward {
	xp: number;
	credits: number;
	firstCheckpoints: number;
}
//#endregion

export class RoundManager {
	private activePlayers: Player[] = [];
	private spawn: BasePart;
	private spawner: TileSpawner;

	private disconnectOnReset: Disconnectable[] = [];

	private rewards: Map<Player, RoundReward> = new Map();
	private hitCheckpoints: Model[] = [];

	//#region State Manager

	private state: RoundState = RoundState.LOBBY;
	stateChanged = new Instance("BindableEvent");

	public setState(newState: RoundState) {
		print(`Transitioning from ${RoundState[this.state]} → ${RoundState[newState]}`);
		this.state = newState;
		this.stateChanged.Fire(newState);

		this.handleState(newState);
	}

	private handleState(state: RoundState) {
		switch (state) {
			case RoundState.LOBBY:
				this.enterLobby();
				break;
			case RoundState.COUNTDOWN:
				this.enterCountdown();
				break;
			case RoundState.STARTING:
				this.enterStarting();
				break;
			case RoundState.RUNNING:
				this.enterRunning();
				break;
			case RoundState.ENDING:
				this.enterEnding();
				break;
			case RoundState.RESETTING:
				this.enterResetting();
				break;
		}
	}

	//#endregion

	//#region State Machine
	/** Enter LOBBY */
	private enterLobby() {}
	/** Enter COUNTDOWN */
	private enterCountdown() {
		task.delay(15, () => this.setState(RoundState.STARTING));
	}
	/** Enter STARTING */
	private enterStarting() {
		this.activePlayers.forEach((player) => {
			this.rewards.set(player, { xp: 5, credits: 1, firstCheckpoints: 0 });
			this.autodisconnect(
				player.GetPropertyChangedSignal("Parent").Once(() => {
					RemoveFromArray(this.activePlayers, player);
					this.onPlayerCountReduced();
				}),
				player.CharacterRemoving.Once(() => {
					RemoveFromArray(this.activePlayers, player);
					this.onPlayerCountReduced();
				}),
			);
		});
	}
	/** Enter RUNNING */
	private enterRunning() {
		this.spawner.AddTileToQueue(5);
		this.autodisconnect(
			this.spawner.ConnectToCheckpoint((player: Player, checkpoint: Model) => {
				const FirstHit = this.hitCheckpoints.filter((value) => value === checkpoint).size() === 0;
				if (FirstHit) {
					this.hitCheckpoints.push(checkpoint);
					this.TriggerCheckpointFirst(player);
				}
				this.TriggerCheckpoint(player);
			}),
		);
	}
	/** Enter ENDING */
	private enterEnding() {
		this.rewards.forEach((reward, player) => {
			if (player.Parent !== Players) {
				warn(`Cannot award ${player}: They aren't in Players?`);
				return;
			}
			this.ApplyRewards(player, reward);
		});
	}
	/** Enter RESETTING */
	private enterResetting() {
		this.disconnectOnReset.forEach((connection) => {
			if (typeIs(connection, "function")) connection();
			else connection.Disconnect();
		});
		this.disconnectOnReset.clear();
		this.rewards.clear();
		this.hitCheckpoints.clear();
		this.spawner.Reset();
		this.setState(RoundState.LOBBY);
	}
	//#endregion

	//#region Other
	private autodisconnect(...connections: Disconnectable[]) {
		connections.forEach((connection) => {
			this.disconnectOnReset.push(connection);
		});
	}

	onPlayerCountReduced() {
		if (this.activePlayers.size() === 0) {
			this.setState(RoundState.ENDING);
		}
	}

	ApplyRewards(player: Player, reward: RoundReward) {
		warn("NOT IMPLEMENTED: iM RoundManager.ApplyRewards(player: Player, reward: RoundReward)");
		print(`${player} rewarded ${reward.xp} XP, ${reward.credits} credits`);
	}

	private TriggerCheckpointFirst(player: Player) {
		this.spawner.AddTileToQueue();

		const reward = this.rewards.get(player);
		if (reward === undefined) {
			warn(`${player} hit a checkpoint with no reward matrix!`);
			return;
		}
		reward.firstCheckpoints++;
	}
	private TriggerCheckpoint(player: Player) {
		const reward = this.rewards.get(player);
		if (reward === undefined) {
			warn(`${player} hit a checkpoint with no reward matrix!`);
			return;
		}
	}
	//#endregion

	constructor(spawn: BasePart, spawner: TileSpawner) {
		this.spawn = spawn;
		this.spawner = spawner;
	}
}

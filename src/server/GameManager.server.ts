import { Workspace } from "@rbxts/services";
import { RoundManager, RoundState } from "./RoundManager";
import { TileSpawner } from "./TileSpawner";

const Start: BasePart = Workspace.WaitForChild("Start") as BasePart;
const RoundMachine = new RoundManager(
	Workspace.WaitForChild("RoundSpawn") as BasePart,
	Workspace.WaitForChild("JoinBox") as BasePart,
	new TileSpawner(Start.CFrame, []),
);

RoundMachine.setState(RoundState.LOBBY);

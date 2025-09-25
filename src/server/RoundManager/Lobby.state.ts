import { IState } from "shared/stateMachine/IState";
import { RoundContext, RoundSignal, RoundState } from "./RoundState";
import { Possible } from "shared/types";

export class LobbyState extends RoundState {
	onEnter(source: Possible<IState<RoundContext, RoundSignal>>, context: RoundContext): void {}

	onExit(target: IState<RoundContext, RoundSignal>): void {}
}

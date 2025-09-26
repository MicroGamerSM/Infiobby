/* eslint-disable @typescript-eslint/no-unused-vars */
import { IState } from "shared/stateMachine/IState";
import { RoundContext, RoundSignal, RoundState } from "./RoundState";
import { Possible } from "shared/types";

export class LobbyState extends RoundState {
	onEnter(source: Possible<IState<RoundContext, RoundSignal>>): void {}

	onExit(target: IState<RoundContext, RoundSignal>): void {}
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { IState } from "shared/stateMachine/IState";
import { Possible } from "shared/types";

export type RoundContext = [];

export type RoundSignal = [];

export class RoundState implements IState<RoundContext, RoundSignal> {
	context: Possible<RoundContext>;

	onEnter(source: Possible<IState<RoundContext, RoundSignal>>, context: RoundContext): void {}

	onExit(target: IState<RoundContext, RoundSignal>): void {}

	onSignal(signal: string, ..._args: RoundSignal): void {
		print(`Got signal ${signal}`);
	}

	Enter(source: Possible<IState<RoundContext, RoundSignal>>, context: []): void {
		print(`Entering from state ${source}`);
		this.context = context;
		this.onEnter(source, context);
	}

	Exit(target: IState<RoundContext, RoundSignal>): void {
		print(`Exiting to state ${target}`);
		this.onExit(target);
	}
}

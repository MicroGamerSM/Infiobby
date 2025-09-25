import { Possible } from "shared/types";
import { IState } from "./IState";

export class StateMachine<context, signal extends unknown[]> {
	private currentState: Possible<IState<context, signal>>;

	private context: context;

	Transition(newState: IState<context, signal>) {
		if (newState === this.currentState) {
			return;
		}
		this.currentState?.onExit(newState);
		newState.onEnter(this.currentState, this.context);
		this.currentState = newState;
	}

	Signal(signal: string, ...args: signal) {
		this.currentState?.onSignal(signal, ...args);
	}

	constructor(context: context) {
		this.context = context;
	}
}

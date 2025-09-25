import { Possible } from "shared/types";

export interface IState<context, signal extends unknown[]> {
	onEnter(source: Possible<IState<context, signal>>, context: context): void;
	onExit(target: IState<context, signal>): void;
	onSignal(signal: string, ...args: signal): void;

	Enter(source: Possible<IState<context, signal>>, context: context): void;
	Exit(target: IState<context, signal>): void;
}

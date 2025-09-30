import { DebugContext, DebugModule } from "../DebugModule";

export class GameVersionModule implements DebugModule {
	Evaluate(context: DebugContext): string {
		return `${context.Branch} V${context.Version}`;
	}
}

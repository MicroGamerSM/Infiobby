import { VersionData } from "shared/VersionData";
import { DebugContext, DebugModule } from "../DebugModule";

export class GameVersionDebugModule implements DebugModule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	Evaluate(context: DebugContext): string {
		return `Branch: ${VersionData.Branch}
		Commit: ${VersionData.Commit}
		Studio: ${context.IsStudio ? "Studio" : "Player"}`;
	}
}

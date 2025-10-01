import { VersionData } from "shared/VersionData";
import { DebugContext, DebugModule } from "../DebugModule";

export class GameVersionDebugModule implements DebugModule {
	Evaluate(context: DebugContext): string {
		return `Branch: ${VersionData.Branch}
		Commit: ${VersionData.Commit}
		Studio: ${context.IsStudio ? "Studio" : "Player"}`;
	}
}

import { DebugContext, DebugModule } from "../DebugModule";

export function trucate(num: number, decimals: number): number {
	const factor = 10 ** decimals;
	// floor works for positive, but for negatives we need to use ceil
	return num >= 0 ? math.floor(num * factor) / factor : math.ceil(num * factor) / factor;
}

export class FramerateDebugModule implements DebugModule {
	Evaluate(context: DebugContext): string {
		return `Frametime: ${trucate(context.FrameTime, 4)}`;
	}
}

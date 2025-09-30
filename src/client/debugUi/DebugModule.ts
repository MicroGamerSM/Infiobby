export interface DebugModule {
	Evaluate(context: DebugContext): string;
}

export interface DebugContext {
	Branch: string;
	Version: string;
	FrameTime: number;
}

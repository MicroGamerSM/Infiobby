export interface DebugModule {
	Evaluate(context: DebugContext): string;
}

export interface DebugContext {
	FrameTime: number;
}

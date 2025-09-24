export function WaitUntil(predicate: () => boolean) {
	while (!predicate()) {
		task.wait();
	}
}

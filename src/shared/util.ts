const Players = game.GetService("Players");

export function WaitUntil(predicate: () => boolean) {
	while (!predicate()) {
		task.wait();
	}
}

export function GetPlayersInZone(zone: BasePart): Player[] {
	const playersInside: Player[] = [];

	// Must have CanTouch = true for GetTouchingParts to work
	zone.CanTouch = true;

	for (const touching of zone.GetTouchingParts()) {
		const character = touching.Parent;
		if (!character) continue;

		const player = Players.GetPlayerFromCharacter(character);
		if (player && !playersInside.includes(player)) {
			playersInside.push(player);
		}
	}

	return playersInside;
}

export function RemoveFromArray<T extends defined>(array: T[], item: T) {
	const index = array.indexOf(item);
	if (index !== -1) {
		const lastIndex = array.size() - 1;
		array[index] = array[lastIndex]; // swap with last element
		array.pop(); // remove last element
	}
}

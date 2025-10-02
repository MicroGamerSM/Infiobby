import { Players, TextService } from "@rbxts/services";
import { Possible } from "./types";

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

export function StartsWith(str: string, prefix: string): boolean {
	return str.sub(1, prefix.size()) === prefix;
}

export function RemovePrefix(str: string, prefix: string): string {
	if (str.sub(1, prefix.size()) === prefix) {
		return str.sub(prefix.size() + 1);
	}
	return str;
}

/**
 * If the string starts with nothing, "D-" (not case sensitive), searches display names. "U-" searches usernames, and "I-" searches IDs.
 * @param player The string to look for a player with.
 * @returns The player found.
 */
export function StringToPlayer(player: string): Possible<Player> {
	// Normalize prefix
	const upper = player.upper();
	let search = player;
	let mode: "display" | "username" | "id" = "display";

	if (upper.sub(1, 2) === "D-") {
		mode = "display";
		search = player.sub(3); // remove "D-"
	} else if (upper.sub(1, 2) === "U-") {
		mode = "username";
		search = player.sub(3); // remove "U-"
	} else if (upper.sub(1, 2) === "I-") {
		mode = "id";
		search = player.sub(3); // remove "I-"
	}

	for (const p of Players.GetPlayers()) {
		if (mode === "display" && p.DisplayName.lower() === search.lower()) {
			return p;
		}
		if (mode === "username" && p.Name.lower() === search.lower()) {
			return p;
		}
		if (mode === "id") {
			const num = tonumber(search);
			if (num !== undefined && p.UserId === num) {
				return p;
			}
		}
	}

	return undefined;
}

export function CensorString(source: Player, target: Player, value: string): string {
	return TextService.FilterStringAsync(
		value,
		source.UserId,
		Enum.TextFilterContext.PrivateChat,
	).GetNonChatStringForUserAsync(target.UserId);
}

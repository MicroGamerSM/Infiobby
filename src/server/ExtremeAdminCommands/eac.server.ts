import { Players } from "@rbxts/services";
import { StartsWith, RemovePrefix, StringToPlayer } from "shared/util";

const adminIds: number[] = [5742671914];
const prefix: string = "!";

function HandleCommand(player: Player, command: string, ...args: string[]) {
	switch (command) {
		case "exit": {
			player.Kick("You have exited.");
			break;
		}
		case "kick": {
			const target = StringToPlayer(args[0]);
			const messageParts = args;
			messageParts.remove(0);
			let message = messageParts.join(" ");
			if (message === "" || message === " " || message === undefined)
				message = "You were kicked by an administrator.";
			target?.Kick(message);
			break;
		}
	}
}

Players.PlayerAdded.Connect((player) => {
	if (adminIds.find((value) => value === player.UserId) === undefined) return;
	print("hi admin");
	player.Chatted.Connect((message) => {
		const data = message.split(" ");
		const command = data.remove(0);
		if (command === undefined) return;
		// eslint-disable-next-line roblox-ts/lua-truthiness
		if (!StartsWith(command, prefix)) return;
		HandleCommand(player, RemovePrefix(command, prefix), ...data);
	});
});

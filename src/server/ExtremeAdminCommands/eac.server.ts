import { StartsWith, RemovePrefix } from "shared/util";

const Players = game.GetService("Players");

const adminIds: number[] = [5742671914];
const prefix: string = "!";

function HandleCommand(player: Player, command: string, ...args: string[]) {
	switch (command) {
		case "exit":
			player.Kick("You have exited.");
			break;
	}
}

Players.PlayerAdded.Connect((player) => {
	if (adminIds.find((value) => value === player.UserId) === undefined) return;
	print("hi admin");
	player.Chatted.Connect((message) => {
		const data = message.split(" ");
		const command = data.remove(0);
		if (command === undefined) return;
		if (!StartsWith(command, prefix)) return;
		HandleCommand(player, RemovePrefix(command, prefix), ...data);
	});
});

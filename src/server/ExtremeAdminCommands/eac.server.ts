const Players = game.GetService("Players");

const adminIds: number[] = [5742671914];

// Example usage in Roblox-TS
const result = parseIfPrefixed("!hello world test", "!");
print(result); // ["hello", "world", "test"]

function HandleCommand(player: Player, command: string, ...args: string[]) {
	switch (command) {
		case "/exit":
			player.Kick("You have exited.");
			break;
	}
}

Players.PlayerAdded.Connect((player) => {
	if (adminIds.find((value) => value === player.UserId) === undefined) return;
	print("hi admin");
	player.Chatted.Connect((message) => {
		HandleCommand(player, ...message.split(" "));
	});
});

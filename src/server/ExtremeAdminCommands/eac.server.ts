const Players = game.GetService("Players");

const adminIds: number[] = [5742671914];

Players.PlayerAdded.Connect((player: Player) => {
	if (adminIds.find((value) => value === player.UserId) === undefined) return;
	print("hi admin");
});

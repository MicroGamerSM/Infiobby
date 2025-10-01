import { DebugContext, DebugModule } from "./DebugModule";
import { FramerateDebugModule } from "./Modules/FramerateDebugModule";
import { GameVersionDebugModule } from "./Modules/GameVersionDebugModule";

const ActivationKey = Enum.KeyCode.F3;
const Font = Enum.Font.RobotoMono;

const UserInputService = game.GetService("UserInputService");
const RunService = game.GetService("RunService");
const Players = game.GetService("Players");

const LocalPlayer = Players.LocalPlayer;
const IsStudio = RunService.IsStudio();

const Gui = new Instance("ScreenGui");
Gui.ResetOnSpawn = false;
Gui.DisplayOrder = 999999999;
Gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
Gui.Parent = LocalPlayer.WaitForChild("PlayerGui");

function CreateDebugLabel(
	xAnchor: Enum.TextXAlignment,
	yAnchor: Enum.TextYAlignment = Enum.TextYAlignment.Top,
): TextLabel {
	const Label = new Instance("TextLabel");
	Label.Transparency = 1;
	Label.Size = new UDim2(1, 0, 1, 0);
	Label.BorderSizePixel = 0;
	Label.Position = new UDim2(0, 0, 0, 0);
	Label.TextXAlignment = xAnchor;
	Label.TextYAlignment = yAnchor;
	Label.Font = Font;
	Label.Parent = Gui;
	return Label;
}

const LeftText = CreateDebugLabel(Enum.TextXAlignment.Left);
const RightText = CreateDebugLabel(Enum.TextXAlignment.Right);

const LeftModules: DebugModule[] = [new GameVersionDebugModule()];
const RightModules: DebugModule[] = [new FramerateDebugModule()];

let UiOpen: boolean = IsStudio;

UserInputService.InputBegan.Connect((input: InputObject, gameProcessedEvent: boolean) => {
	if (gameProcessedEvent) return;
	if (input.UserInputType !== Enum.UserInputType.Keyboard) return;
	if (input.KeyCode !== ActivationKey) return;
	UiOpen = !UiOpen;
	SetUiVisibility();
});

function SetUiVisibility() {
	LeftText.Visible = UiOpen;
	RightText.Visible = UiOpen;
}

RunService.PreRender.Connect((deltaTimeRender: number) => {
	const Context: DebugContext = { FrameTime: deltaTimeRender, IsStudio: IsStudio };

	let LeftValue = "Debug GUI";
	LeftModules.forEach((Module: DebugModule) => {
		LeftValue += "\n" + Module.Evaluate(Context);
	});
	let RightValue = "";
	RightModules.forEach((Module: DebugModule) => {
		RightValue += "\n" + Module.Evaluate(Context);
	});

	LeftText.Text = LeftValue;
	RightText.Text = RightValue;
});

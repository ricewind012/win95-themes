import classes from "./classes.js";
import ElementUtils from "../shared++/ElementUtils.js";

declare var SteamClient: any;

function SetTokenAsVar(token: string) {
	document.body.style.setProperty(
		"--" + token,
		"'" + window.opener.LocalizationManager.LocalizeString("#" + token) + "'",
	);
}

(async () => {
	let el = (s: string) => document.querySelector<HTMLElement>(`.${s}`);

	if (document.title == "Steam") {
		// Align tabs with sidebar width
		let sidebar = await ElementUtils.wait(
			`.${classes.library.LeftListSizableContainer}`,
		);
		let tabs = await ElementUtils.wait(
			`.${classes.gamelistbar.GameListHomeAndSearch}`,
			sidebar,
		);

		ElementUtils.act(
			sidebar,
			() => {
				tabs.style.marginLeft = `${sidebar.style.width} !important`;
			},
			{
				attributes: true,
				attributeFilter: ["style"],
			},
		);

		// Set a variable for when an application is downloading
		SetTokenAsVar("BottomBar_Manage");
	}

	if (document.title == "Screenshot Manager") {
		[
			"Generic_Delete",
			"ScreenshotUploader_CopyURL",
			"ScreenshotUploader_Settings",
			"ScreenshotUploader_ShowOnDisk",
		].forEach((e) => SetTokenAsVar(e));
	}

	if (document.title == "Steam Settings") {
		SteamClient.Window.ResizeTo(1010, 722, true);
	}

	if (document.title == "Game Servers") {
		SteamClient.Window.SetMinSize(500, 500);
	}

	if (document.title.startsWith("Game Info - ")) {
		SteamClient.Window.ResizeTo(500, 600, true);
	}
})();

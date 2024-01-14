import classes from "./classes.js";
import ElementUtils from "../shared++/ElementUtils.js";

declare var SteamClient: any;

(async () => {
	let el = (s: string) => document.querySelector<HTMLElement>(`.${s}`);

	if (document.title == "Steam") {
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

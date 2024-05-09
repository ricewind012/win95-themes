const LocalizeString = e => window.opener.LocalizationManager.LocalizeString(e)

const tokens = (() => {
		switch (document.title) {
			case LocalizeString("#WindowName_SteamDesktop"):
				return ["AllCollectionsView_InfoIconCollections", "BottomBar_Manage"];

			case LocalizeString("#ScreenshotUploader_Heading"):
			case "ScreenshotManager": // Overlay
				return [
					"Generic_Delete",
					"ScreenshotUploader_CopyURL",
					"ScreenshotUploader_Settings",
					"ScreenshotUploader_ShowOnDisk",
				];
		}
	})();

	for (const token of tokens) {
		document.body.style.setProperty(
			"--" + token,
			"'" + LocalizeString("#" + token) + "'",
		);
	}

	switch (document.title) {
		case LocalizeString("#Menu_Servers"):
			SteamClient.Window.SetMinSize(500, 500);
			break;
	}

const { LocalizationManager } = window.opener;

const tokens = (() => {
	switch (document.title) {
		case LocalizeString("#WindowName_SteamDesktop"):
			return ["AllCollectionsView_InfoIconCollections"];

		case LocalizeString("#SignIn_Title"):
			return ["NavigateBack"];

		case LocalizeString("#ScreenshotUploader_Heading"):
		case "ScreenshotManager": // Overlay
			return [
				"Generic_Delete",
				"ScreenshotUploader_CopyURL",
				"ScreenshotUploader_Settings",
				"ScreenshotUploader_ShowOnDisk",
			];

		default:
			return [];
	}
})();

for (const token of tokens) {
	document.body.style.setProperty(
		"--" + token,
		"'" + LocalizationManager.LocalizeString("#" + token) + "'",
	);
}

switch (document.title) {
	case LocalizeString("#Menu_Servers"):
		SteamClient.Window.SetMinSize(500, 500);
		break;
}

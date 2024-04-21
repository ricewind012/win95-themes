function SetTokenAsVar(token) {
	document.body.style.setProperty(
		"--" + token,
		"'" + window.opener.LocalizationManager.LocalizeString("#" + token) + "'",
	);
}

switch (document.title) {
	case "Steam":
		["AllCollectionsView_InfoIconCollections", "BottomBar_Manage"].forEach(
			(e) => {
				SetTokenAsVar(e);
			},
		);
		break;

	case "ScreenshotManager":
	case "Screenshot Manager":
		[
			"Generic_Delete",
			"ScreenshotUploader_CopyURL",
			"ScreenshotUploader_Settings",
			"ScreenshotUploader_ShowOnDisk",
		].forEach((e) => {
			SetTokenAsVar(e);
		});
		break;

	case "Game Servers":
		SteamClient.Window.SetMinSize(500, 500);
		break;
}

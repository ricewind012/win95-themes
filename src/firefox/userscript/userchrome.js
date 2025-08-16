const sss = Cc["@mozilla.org/content/style-sheet-service;1"].getService(
	Ci.nsIStyleSheetService,
);
const sheet = sss.preloadSheet(
	makeURI("chrome://userChrome/content/userChrome.au.css"),
	sss.AUTHOR_SHEET,
);

function AddSheet(wnd) {
	wnd.windowUtils.addSheet(sheet, Ci.nsIDOMWindowUtils.AUTHOR_SHEET);
}

export function InitUserChrome() {
	// author
	AddSheet(window);
	UC_API.Windows.onCreated(AddSheet);

	// agent
	sss.loadAndRegisterSheet(
		Services.io.newURI("chrome://userChrome/content/userChrome.ag.css"),
		sss.AGENT_SHEET,
	);
}

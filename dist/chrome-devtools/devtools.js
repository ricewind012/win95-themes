// This has to reside here, as you can't fetch relative paths.
fetch("./chrome-devtools.css")
	.then((e) => e.text())
	.then((e) => {
		chrome.devtools.panels.applyStyleSheet(e);
	});

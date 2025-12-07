const SIDEBAR_PREF = "sidebar.visibility";

/**
 * Only bool prefs!
 */
const THEME_PREFS = [
	"win95.customize-mode-as-window",
	"win95.navbar-button-labels",
];

/**
 * Prefs that are currently set to `true`.
 *
 * @type {Set<string>}
 */
const activePrefs = new Set();

window.addEventListener("unload", () => {
	Services.prefs.removeObserver(SIDEBAR_PREF, onSidebarPrefChange);
	for (const pref of THEME_PREFS) {
		Services.prefs.removeObserver(pref, onThemePrefChange);
	}
});

function setPrefsAttribute() {
	const value = [...activePrefs].join(" ");
	document.documentElement.setAttribute("win95-active-prefs", value);
}

/**
 * Alerts the user that "expand on hover" sidebar option is not yet supported to
 * the user and automatically reverts the pref to normal.
 */
function onSidebarPrefChange() {
	const value = Services.prefs.getStringPref(SIDEBAR_PREF);
	if (value === "expand-on-hover") {
		Services.prompt.alert(
			window,
			"Windows 95 theme",
			"Sidebar expand on hover is not yet supported!",
		);
		Services.prefs.setStringPref(SIDEBAR_PREF, "always-show");
	}
}

function onThemePrefChange(_subject, _topic, pref) {
	if (pref === SIDEBAR_PREF) {
		onSidebarPrefChange();
		return;
	}

	const value = Services.prefs.getBoolPref(pref);
	if (value) {
		activePrefs.add(pref);
	} else {
		activePrefs.delete(pref);
	}
	setPrefsAttribute();
}

export function initThemePrefs() {
	// TODO(sidebar): remove on "expand on hover" support
	Services.prefs.addObserver(SIDEBAR_PREF, onSidebarPrefChange);
	for (const pref of THEME_PREFS) {
		let value = false;
		try {
			value = Services.prefs.getBoolPref(pref);
		} catch {
			Services.prefs.setBoolPref(pref, false);
		}
		if (value) {
			activePrefs.add(pref);
		}
		Services.prefs.addObserver(pref, onThemePrefChange);
		setPrefsAttribute();
	}
}

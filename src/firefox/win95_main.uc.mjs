// ==UserScript==
// @name         Windows 95 userscript
// @description  Adds some additional functionality for the Windows 95 theme.
// @author       ricewind
// ==/UserScript==

import { initThemePrefs } from "./userscript/prefs.js";
import { initResizer } from "./userscript/resizer.js";

function main() {
	initResizer();
	initThemePrefs();
}

main();

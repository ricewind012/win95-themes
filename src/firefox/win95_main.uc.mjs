// ==UserScript==
// @name         Windows 95 userscript
// @description  Adds some additional functionality for the Windows 95 theme.
// @author       ricewind
// @onlyonce
// ==/UserScript==

import { initResizer } from "./userscript/resizer.js";
import { initStatusbar } from "./userscript/statusbar.js";

function main() {
	initStatusbar();
	initResizer();
}

main();

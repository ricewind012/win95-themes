// ==UserScript==
// @name         Resizer
// @description  Adds some functionality provided by the Windows 95 theme.
// @author       me
// @include      main
// ==/UserScript==

import { InitMisc } from "./userscript/misc.js";
import { InitResizer } from "./userscript/resizer.js";
import { InitUserChrome } from "./userscript/userchrome.js";

function main() {
	InitMisc();
	InitUserChrome();
	InitResizer();
}

main();

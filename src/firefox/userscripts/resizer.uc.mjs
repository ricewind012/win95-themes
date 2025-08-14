// ==UserScript==
// @name         Resizer
// @description  Adds a resizer for the main window.
// @author       me
// @include      main
// ==/UserScript==

const resizer = document.createXULElement("resizer");
resizer.setAttribute("dir", "bottomright");
document.documentElement.appendChild(resizer);

function HandlePointerEvent(el, fnMoveCallback) {
	el.addEventListener("pointerdown", () => {
		function fnMove(ev) {
			fnMoveCallback(ev);
		}

		function fnUp() {
			removeEventListener("pointermove", fnMove);
			removeEventListener("pointerup", fnUp);
			document.documentElement.removeAttribute("style");
		}

		addEventListener("pointermove", fnMove, { passive: true });
		addEventListener("pointerup", fnUp, { passive: true });
	});
}

HandlePointerEvent(resizer, (ev) => {
	window.resizeTo(ev.pageX, ev.pageY);
});

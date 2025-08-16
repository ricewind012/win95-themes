function HandlePointerEvent(el, callback) {
	el.addEventListener("pointerdown", () => {
		function move(ev) {
			callback(ev);
		}

		function up() {
			removeEventListener("pointermove", move);
			removeEventListener("pointerup", up);
			document.documentElement.removeAttribute("style");
		}

		addEventListener("pointermove", move, { passive: true });
		addEventListener("pointerup", up, { passive: true });
	});
}

export function InitResizer() {
	const resizer = document.createXULElement("resizer");
	resizer.setAttribute("dir", "bottomright");
	document.documentElement.appendChild(resizer);

	// The other way is to listen to <html>'s attribute changes, but that hangs
	// Firefox for whatever reason...
	HandlePointerEvent(resizer, (ev) => {
		window.resizeTo(ev.pageX, ev.pageY);
	});
}

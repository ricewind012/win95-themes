const RESIZE_HANDLE_SIZE = 14;

/**
 * Registers a pointer event with an automatic canceling on `pointerup`.
 *
 * @param {Element} el
 * @param {(ev: PointerEvent) => void} callback
 */
function handlePointerEvent(el, callback) {
	el.addEventListener("pointerdown", () => {
		function move(ev) {
			callback(ev);
		}

		function up() {
			removeEventListener("pointermove", move);
			removeEventListener("pointerup", up);
		}

		addEventListener("pointermove", move, { passive: true });
		addEventListener("pointerup", up, { passive: true });
	});
}

export function initResizer() {
	const resizer = document.createElement("div");
	resizer.id = "window-resize-handle";
	document.documentElement.appendChild(resizer);

	// The other way is to listen to <html>'s "style" attribute changes, but
	// that hangs Firefox for whatever reason...
	handlePointerEvent(resizer, (ev) => {
		window.resizeTo(
			ev.pageX + RESIZE_HANDLE_SIZE,
			// magic number
			ev.pageY + RESIZE_HANDLE_SIZE * 2.5,
		);
	});
}

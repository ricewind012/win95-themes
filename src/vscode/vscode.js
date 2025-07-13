const codiconStylesText = document
	.getElementById("codiconStyles")
	?.innerText.split("\n");

/**
 * Do something on a DOM mutation event.
 *
 * @param {Node} el Parent element.
 * @param {MutationCallback} callback The function to be called on DOM mutation.
 * @param {MutationObserverInit} opts MutationObserver options.
 */
function act(el, callback, opts) {
	const observer = new MutationObserver(callback);
	observer.observe(el, opts);

	return observer;
}

function icon(s) {
	return codiconStylesText
		.filter((e) => e.match(s))
		.map((e) => `&-${e.match(/^\.codicon-(.*?):/)[1]}`)
		.join(",\n");
}

(async () => {
	/**
	 * Append the theme to shadow DOM hosts.
	 **/
	const container = await ElementUtils.wait(".monaco-workbench");

	// The extension does not provide IDs.
	const theme = [...document.head.children]
		.find((e) => e.textContent.includes("color-button-face"))
		.cloneNode(true);

	act(
		container,
		() => {
			if (!container.classList.contains("context-menu-visible")) {
				return;
			}

			const hosts = container.querySelectorAll(".shadow-root-host");
			for (const el of hosts) {
				el.shadowRoot.appendChild(theme);
			}
		},
		{ attributes: true },
	);
})();

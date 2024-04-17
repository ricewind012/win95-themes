const ElementUtils = {
	/**
	 * Create an element.
	 *
	 * @param tag HTML tag.
	 * @param attrs Key/value attributes.
	 * @param parent Element to prepend to.
	 * @param prepend Prepend the element to its parent?
	 */
	make(tag, attrs, parent = null, prepend = false) {
		const el = document.createElement(tag);
		for (const k in attrs) {
			el.setAttribute(k, attrs[k]);
		}
		if (parent) {
			if (prepend) {
				parent.prepend(el);
			} else {
				parent.appendChild(el);
			}
		}
		return el;
	},
	/**
	 * Do something on a DOM mutation event.
	 *
	 * @param el Element to look in.
	 * @param callback The function to be called on DOM mutation.
	 * @param opts MutationObserver options.
	 */
	act(el, callback, opts) {
		const observer = new MutationObserver(callback);
		observer.observe(el, opts);
		return observer;
	},
	/**
	 * Wait for an element.
	 *
	 * @param selector CSS selector.
	 * @param parent Element to look in.
	 */
	wait(selector, parent = document) {
		return new Promise((resolve) => {
			const el = parent.querySelector(selector);
			if (el) {
				resolve(el);
			}
			const observer = new MutationObserver(() => {
				const el = parent.querySelector(selector);
				if (!el) {
					return;
				}
				resolve(el);
				observer.disconnect();
			});
			observer.observe(document.body, {
				subtree: true,
				childList: true,
			});
		});
	},
};

function icon(s) {
	console.log(
		document
			.getElementById("codiconStyles")
			?.innerText.split("\n")
			.filter((e) => e.match(s))
			.map((e) => `&-${e.match(/^\.codicon-(.*?):/)[1]}`)
			.join(",\n"),
	);
}

(async () => {
	/**
	 * Append the theme to shadow hosts.
	 **/
	const container = await ElementUtils.wait(".monaco-workbench");

	// The extension does not provide IDs.
	const theme = [...document.head.children]
		.find((e) => e.textContent.includes("color-button-face"))
		.cloneNode(true);

	ElementUtils.act(
		container,
		() => {
			if (!container.classList.contains("context-menu-visible")) {
				return;
			}

			const hosts = [...container.querySelectorAll(".shadow-root-host")];

			for (const el of hosts) {
				el.shadowRoot.appendChild(theme);
			}
		},
		{ attributes: true },
	);
})();

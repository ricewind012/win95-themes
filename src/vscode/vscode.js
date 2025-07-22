// ElementUtils is prepended by the extension, no need to import

/** @typedef {import("../shared++/ElementUtils.js").ElementUtils} ElementUtils */

const codiconStylesText = document
	.getElementById("codiconStyles")
	?.innerText.split("\n");

window.icon = (s) => {
	return codiconStylesText
		.filter((e) => e.match(s))
		.map((e) => `&-${e.match(/^\.codicon-(.*?):/)[1]}`)
		.join(",\n");
};

// Append the theme to shadow DOM hosts.
const container = await ElementUtils.wait(".monaco-workbench");
const stylesheet = Object.assign(document.createElement("link"), {
	href: "./external.css",
	rel: "stylesheet",
});

ElementUtils.act(
	container,
	() => {
		if (!container.classList.contains("context-menu-visible")) {
			return;
		}

		const hosts = container.querySelectorAll(".shadow-root-host");
		for (const el of hosts) {
			el.shadowRoot.appendChild(stylesheet);
		}
	},
	{ attributes: true },
);

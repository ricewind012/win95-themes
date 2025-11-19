/**
 * @import { ElementUtils } from "../shared++/ElementUtils.js"
 */

// Icon generation
const codicons = document.getElementById("codiconStyles").innerText.split("\n");
const iconMap = {
	ea7c: ["overflow", "mono"],
	ea7f: ["file-open", "normal"],
	ea76: ["close", "mono"],
	ea81: ["clear", "normal"],
	eaa4: ["book", "normal"],
	eabf: ["clear", "normal"],
	eaf8: ["settings", "normal"],
	eb37: ["reload", "normal"],
	eb51: ["settings", "normal"],
	eb84: ["list", "normal"],
	eb86: ["tree", "normal"],
};

window.icon = (s) => {
	return codicons
		.filter((e) => e.match(s))
		.slice(0, -1)
		.map((e) => e.match(/^(\.codicon-.*?):/)[1])
		.join(",\n");
};

// Currently no way other than copy pasting the output into
// global/icons_generated.scss for now.
window.generateCodiconMap = () => {
	return Object.entries(iconMap)
		.map(
			([k, v]) =>
				`${icon(k)} {\n\t--button-img: icon("${v[0]}", "${v[1]}");\n}`,
		)
		.join("\n\n");
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

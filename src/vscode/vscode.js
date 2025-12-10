/**
 * @import { ElementUtils } from "../shared++/ElementUtils.js"
 */

// Icon generation
// This has to be ran manually, so check if ElementUtils is available.
if (typeof ElementUtils === "undefined") {
	const codicons = document
		.getElementById("codiconStyles")
		.innerText.split("\n");
	/** @type {Record<string, [string, "mono" | "normal"]} */
	const iconMap = {
		ea6c: ["warning-32", "normal"],
		ea7c: ["overflow", "mono"],
		ea7f: ["file-open", "normal"],
		ea9a: ["arrow-bottom", "mono"],
		ea60: ["plus", "mono"],
		ea74: ["question-32", "normal"],
		ea75: ["padlock", "normal"],
		ea76: ["close", "mono"],
		ea80: ["folder-add", "normal"],
		ea81: ["clear", "normal"],
		ea94: ["file-preview", "normal"],
		eaa1: ["arrow-top", "mono"],
		eaa4: ["book", "normal"],
		eab1: ["case-sensitive", "mono"],
		eab4: ["arrow-bottom", "mono"],
		eab5: ["arrow-left", "mono"],
		eab6: ["arrow-right", "mono"],
		eabf: ["clear", "normal"],
		eae2: ["clear", "normal"],
		eaf1: ["search", "normal"],
		eaf8: ["settings", "normal"],
		eafd: ["file-preview", "normal"],
		eb2e: ["case-preserve", "mono"],
		eb3c: ["replace-all", "mono"],
		eb4c: ["arrow-top", "mono"],
		eb7e: ["whole-word", "mono"],
		eb37: ["reload", "normal"],
		eb38: ["regex", "mono"],
		eb51: ["settings", "normal"],
		eb56: ["sidebar", "normal"],
		eb84: ["list", "normal"],
		ebeb: ["window-edit", "normal"],
		ebf2: ["vscode-panel-bottom-on", "mono"],
		ebf3: ["vscode-panel-left-on", "mono"],
		ebf4: ["vscode-panel-right-on", "mono"],
		ec00: ["vscode-panel-right-off", "mono"],
		ec01: ["vscode-panel-bottom-off", "mono"],
		ec02: ["vscode-panel-left-off", "mono"],
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
}

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

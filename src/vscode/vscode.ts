function icon(s: string): void {
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
	const container: Element = await ElementUtils.wait(".monaco-workbench");

	// The extension does not provide IDs.
	const theme: Node = [...document.head.children]
		.find((e) => e.textContent.includes("color-button-face"))
		.cloneNode(true);

	ElementUtils.act(
		container,
		() => {
			if (!container.classList.contains("context-menu-visible")) {
				return;
			}

			const hosts: Element[] = [
				...container.querySelectorAll(".shadow-root-host"),
			];

			if (!hosts.length) {
				return;
			}

			for (const el of hosts) {
				el.shadowRoot.appendChild(theme);
			}
		},
		{ attributes: true },
	);
})();

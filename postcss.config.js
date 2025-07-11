import postcssSassPlugin from "@csstools/postcss-sass";
import postcssFunctions from "postcss-functions";
import postcssSassParser from "postcss-scss";

import fs from "node:fs";
import path from "node:path";

const unquote = (str) => str.replace(/"/g, "");

/**
 * `icon("name")` => `url("data:image/svg+xml;base64,${base64}")`
 *
 * @param {string} name File name without the extension.
 */
function Icon(name) {
	name = unquote(name);

	const fileName = `${name}.svg`;
	const file = path.join("assets", "icons", fileName);
	const base64 = fs.readFileSync(file, { encoding: "base64" });

	return `url("data:image/svg+xml;base64,${base64}")`;
}

const appendImportantPlugin = (opts) => (css) => {
	const NOT_IMPORTANT_MATCH = / notimportant$/;

	css.walkRules((rule) => {
		const nodes = rule.nodes.filter(
			(node) =>
				node.type !== "comment" &&
				!opts.filter.some((sel) => node.parent.selectors.includes(sel)),
		);
		for (const node of nodes) {
			if (node.value.match(NOT_IMPORTANT_MATCH)) {
				node.value = node.value.replace(NOT_IMPORTANT_MATCH, "");
				continue;
			}

			node.important = true;
		}
	});
};
appendImportantPlugin.postcss = true;

/** @type {import("postcss-load-config").Config} */
export default {
	map: false,
	parser: postcssSassParser,
	plugins: [
		postcssFunctions({
			functions: {
				icon: Icon,
			},
		}),
		postcssSassPlugin({
			includePaths: ["src"],
			silenceDeprecations: ["legacy-js-api", "mixed-decls"],
		}),
		appendImportantPlugin({
			filter: [":root"],
		}),
	],
};

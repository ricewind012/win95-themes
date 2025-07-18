import postcssSassPlugin from "@csstools/postcss-sass";
import postcssFunctions from "postcss-functions";
import postcssSassParser from "postcss-scss";
import {
	appendImportantPlugin,
	selectorReplacerPlugin,
} from "steam-theming-utils/postcss-plugins";

import fs from "node:fs";
import path from "node:path";

const unquote = (str) => str.replace(/"/g, "");

/**
 * `icon("name")` => `url("data:image/svg+xml;base64,${base64}")`
 *
 * @param {string} name File name without the extension.
 */
function icon(name) {
	const fileName = `${unquote(name)}.svg`;
	const file = path.join("assets", "icons", fileName);
	const base64 = fs.readFileSync(file, { encoding: "base64" });

	return `url("data:image/svg+xml;base64,${base64}")`;
}

/** @type {import("postcss-load-config").Config} */
export default {
	map: false,
	parser: postcssSassParser,
	plugins: [
		postcssFunctions({
			functions: {
				icon,
			},
		}),
		postcssSassPlugin({
			includePaths: ["src"],
			silenceDeprecations: ["legacy-js-api", "mixed-decls"],
		}),
		selectorReplacerPlugin(),
		appendImportantPlugin({
			filter: [/^:root/],
		}),
	],
};

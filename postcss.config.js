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
 * @typedef {"mono" | "normal"} IconType
 */

/**
 * Output: `file("name"[, "type"])` => `url("data:image/png;base64,${base64}")`
 *
 * @param {string} name File name without the extension.
 * @param {IconType} type
 */
function file(name, type = "normal") {
	const fileName = `${unquote(name)}.png`;
	const file = path.join("assets", "icons", unquote(type), fileName);
	const base64 = fs.readFileSync(file, { encoding: "base64" });

	return `url("data:image/png;base64,${base64}")`;
}

/**
 * Output: `icon("name"[, "type"])` => `var(--icon-${type}-${name})`
 *
 * @param {string} name File name without the extension.
 * @param {IconType} type
 */
function icon(name, type = "normal") {
	return `var(--icon-${unquote(type)}-${unquote(name)})`;
}

/** @type {import("postcss-load-config").Config} */
export default {
	map: false,
	parser: postcssSassParser,
	plugins: [
		postcssFunctions({
			functions: {
				file,
				icon,
			},
		}),
		postcssSassPlugin({
			includePaths: ["src"],
			silenceDeprecations: ["legacy-js-api", "mixed-decls", "moz-document"],
		}),
		selectorReplacerPlugin(),
		appendImportantPlugin({
			filter: [/^:root/],
		}),
	],
};

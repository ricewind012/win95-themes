import fs from "node:fs";
import path from "node:path";
import postcssSassPlugin from "@csstools/postcss-sass";
import {
	appendImportantPlugin,
	selectorReplacementPlugin,
} from "@web-app-class-maps/postcss-plugins";
import removeEmpty from "postcss-discard-empty";
import postcssFunctions from "postcss-functions";
import postcssSassParser from "postcss-scss";

const unquote = (str) => str.replace(/"/g, "");

/**
 * @typedef {"mono" | "normal"} IconType
 */

const functions = {
	/**
	 * Output: `file("name"[, "type"])` => `url("data:image/png;base64,${base64}")`
	 *
	 * @param {string} name File name without the extension.
	 * @param {IconType} type
	 */
	file: (name, type = "normal") => {
		const fileName = `${unquote(name)}.png`;
		const file = path.join("assets", "icons", unquote(type), fileName);
		const base64 = fs.readFileSync(file, { encoding: "base64" });

		return `url("data:image/png;base64,${base64}")`;
	},

	/**
	 * Output: `icon("name"[, "type"])` => `var(--icon-${type}-${name})`
	 *
	 * @param {string} name File name without the extension.
	 * @param {IconType} type
	 */
	icon: (name, type = "normal") => {
		return `var(--icon-${unquote(type)}-${unquote(name)})`;
	},
};

/** @type {import("postcss-load-config").Config} */
export default {
	map: false,
	parser: postcssSassParser,
	plugins: [
		postcssFunctions({ functions }),
		postcssSassPlugin({
			includePaths: ["src"],
			silenceDeprecations: ["legacy-js-api", "mixed-decls", "moz-document"],
		}),
		selectorReplacementPlugin({
			ignoreExternalRules: (path) => {
				path = path.slice(path.indexOf("/") + 1);
				return path.startsWith("shared") || path.startsWith("steam/shared");
			},
			ignoreReplacement: (path) => {
				path = path.slice(path.indexOf("/") + 1);
				return (
					path.startsWith("shared") ||
					(path.startsWith("steam/client/desktop/millennium") &&
						!path.includes("quickaccesscontrols")) ||
					path.startsWith("steam/client/popups/contextmenus/friendsui") ||
					path.startsWith("steam/friends") ||
					path.startsWith("steam/shared")
				);
			},
		}),
		appendImportantPlugin({
			filter: [/^(:where\()?:root/],
		}),
		removeEmpty(),
	],
};

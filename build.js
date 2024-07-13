import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import postcssStyl from "postcss-styl";
import stylus from "stylus";

const SHARED_DIR = path.join("src", "shared");
const SHARED_PP_DIR = path.join("src", "shared++");
const SHARED_STYLUS_DIR = path.join("src", "shared-styl");

const ERROR_POINTER_STRING = "\n^^^ HERE";
const STEAM_CLASS_MAPS_FILE = "class_map.json";

const readDir = (e) => fs.readdirSync(e).map((p) => path.join(e, p));
const readFile = (e) => fs.readFileSync(e).toString();
const mapText = (text, fn) => text.split("\n").map(fn).join("\n");
const selectorReplacerPlugin = (opts) => (css) => {
	css.walkRules((rule) => {
		rule.selector = rule.selector.replace(opts.match, opts.replace);
	});
};
selectorReplacerPlugin.postcss = true;
const usePostcss = (opts, css) =>
	postcss(selectorReplacerPlugin(opts))
		.process(css, {
			syntax: postcssStyl,
		})
		.catch((e) => {
			if (e.postcssNode) {
				console.log(
					"%o @ %o is undefined",
					e.postcssNode.nodes[0].parent.selector.replace(/\n/g, " "),
					path.basename(e.stack.split("\n")[1]),
				);
			} else {
				const source = e.input.source.split("\n");
				const line = e.message.split(":")[1];
				source[line] =
					source[line] === ""
						? ERROR_POINTER_STRING
						: source[line] + ERROR_POINTER_STRING;

				console.log("%s\nInput:\n%s", e.message, source.join("\n"));
			}
		});

const progs = fs.readdirSync("src").filter((e) => !e.startsWith("shared"));
if (process.argv.length === 2 || !progs.some((e) => process.argv[2] === e)) {
	console.error(
		"Usage: %s [%s]",
		path.basename(process.argv[1]),
		progs.join("|"),
	);
	process.exit(2);
}

const file = process.argv[2];
const rootDir = path.join("src", file);
const outFile = path.join("dist", file, `${file}.css`);

const includedDirsFilter = (() => {
	switch (file) {
		case "discord":
			return (e) => e === "vencord";
		case "steam":
			return (e) => e !== `${file}.styl` && e !== "imports";
		default:
			return (e) => fs.lstatSync(path.join(rootDir, e)).isDirectory();
	}
})();
const includedDirs = fs
	.readdirSync(rootDir)
	.filter(includedDirsFilter)
	.map((e) => `${rootDir}/${e}/*`);

const processedFiles = (() => {
	switch (file) {
		case "steam": {
			const importsDir = path.join("src", file, "imports");
			const map = JSON.parse(readFile(STEAM_CLASS_MAPS_FILE));

			return fs.readdirSync(importsDir).map((e) =>
				usePostcss(
					{
						match: /#(\w+)/g,
						replace: (_, s) => {
							const id = map[e.replace(".styl", "")][s];
							if (!id) {
								console.log("%o @ %o is undefined", `#${s}`, e);
							}

							return `.${id}`;
						},
					},
					readFile(path.join(importsDir, e)),
				),
			);
		}

		case "discord":
			return readDir(rootDir)
				.filter(
					(e) =>
						e !== path.join(rootDir, "vencord") &&
						fs.lstatSync(e).isDirectory(),
				)
				.flatMap((file) => readDir(file))
				.map((e) => [file, readFile(e)])
				.map((e) =>
					usePostcss(
						{
							match: /\.(\w+)/g,
							replace: '[class*="$1_"]',
						},
						e[1],
					),
				);

		default:
			return [];
	}
})();

const promises = await Promise.all(processedFiles);
if (promises.some((e) => !e)) {
	process.exit(1);
}

const imports = [
	[
		...readDir(SHARED_STYLUS_DIR),
		...readDir(SHARED_PP_DIR),
		path.join(rootDir, `${file}.styl`),
		...includedDirs,
	]
		.map((e) => `@import '${e}';`)
		.join("\n"),
	promises.map((e) => e.css).join("\n"),
].join("\n");

// Variables have to be manually edited due to a Stylus bug (or its age).
const cssVars = readFile(path.join(SHARED_DIR, "variables.css")).replace(
	/ \/ /g,
	" \\/ ",
);
const actualCssVars = mapText(cssVars, (e) =>
	e.endsWith(")") ? `${e} \\` : e,
);
const renderer = stylus(actualCssVars + imports);

renderer.render((err, css) => {
	if (err) {
		fs.writeFileSync("/tmp/a", actualCssVars + imports);
		throw new Error(err.message);
	}

	fs.writeFileSync(
		outFile,
		mapText(css, (e) => e.replace(/;$/g, " !important;")),
	);
});

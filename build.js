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
const usePostcss = (opts, css, file) =>
	postcss(selectorReplacerPlugin(opts))
		.process(css, {
			// TODO: remove file
			from: file,
			syntax: postcssStyl,
		})
		.catch((e) => {
			if (!!e.postcssNode) {
				console.log(
					"%o @ %o is undefined",
					e.postcssNode.nodes[0].parent.selector.replace(/\n/g, " "),
					e.stack.split("\n")[1].replace(/.*\//, ""),
				);
			} else {
				const source = e.input.source.split("\n");
				const line = e.message.split(":")[1];
				source[line] =
					source[line] == ""
						? ERROR_POINTER_STRING
						: source[line] + ERROR_POINTER_STRING;

				console.log("%s\nInput:\n%s", e.message, source.join("\n"));
			}
		});

const progs = fs.readdirSync("src").filter((e) => !e.startsWith("shared"));
if (process.argv.length == 2 || !progs.some((e) => process.argv[2] == e)) {
	console.error(
		"Usage: %s [%s]",
		path.basename(process.argv[1]),
		progs.join("|"),
	);
	process.exit(2);
}

// TODO: move into "imports" below
const sharedFiles = readDir(SHARED_PP_DIR);
const file = process.argv[2];
const rootDir = path.join("src", file);
const outFile = path.join("dist", file, `${file}.css`);

const sharedCss = readDir(SHARED_STYLUS_DIR);
/*
const includedDirs = (isSteam ? ["other"] : fs.readdirSync(rootDir))
	.filter((e) => fs.lstatSync(path.join(rootDir, e)).isDirectory())
	.map((e) => `${rootDir}/${e}/*`);
	*/
const includedDirs = (() => {
	switch (file) {
		case "discord":
			return ["vencord"].map((e) => `${rootDir}/${e}/*`);
		case "steam":
			return fs
				.readdirSync(rootDir)
				.filter((e) => e != `${file}.styl` && e != "imports")
				.map((e) => path.join(rootDir, e))
				.map((e) => `${e}/*`);
		default:
			return fs
				.readdirSync(rootDir)
				.filter((e) => fs.lstatSync(path.join(rootDir, e)).isDirectory())
				.map((e) => `${rootDir}/${e}/*`);
	}
})();
let imports = [
	...sharedCss,
	...sharedFiles,
	path.join(rootDir, `${file}.styl`),
	...includedDirs,
]
	.map((e) => `@import '${e}';`)
	.join("\n");

const processedFiles = (() => {
	switch (file) {
		case "steam":
			const importsDir = path.join("src", file, "imports");
			const map = JSON.parse(readFile(STEAM_CLASS_MAPS_FILE));

			return fs.readdirSync(importsDir).map((e) =>
				usePostcss(
					{
						match: /#(\w+)/g,
						replace: (_, s) => {
							const id = map[e.replace(".styl", "")][s];
							if (!id) {
								console.log("%o @ %o is undefined", "#" + s, e);
							}

							return "." + id;
						},
					},
					readFile(path.join(importsDir, e)),
					e,
				),
			);

		case "discord":
			return readDir(rootDir)
				.filter(
					(e) =>
						e != path.join(rootDir, "vencord") && fs.lstatSync(e).isDirectory(),
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
						e[0],
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

imports += promises.map((e) => e.css).join("\n");

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
		fs.writeFileSync('/tmp/a', actualCssVars + imports)
		throw new Error(err.message);
	}

	fs.writeFileSync(
		outFile,
		mapText(css, (e) => e.replace(/;$/g, " !important;")),
	);
});

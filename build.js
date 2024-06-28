import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import postcssStyl from "postcss-styl";
import stylus from "stylus";

const SHARED_DIR = path.join("src", "shared");
const SHARED_PP_DIR = path.join("src", "shared++");
const SHARED_STYLUS_DIR = path.join("src", "shared-styl");

const STEAM_CLASS_MAPS_FILE = "steam_class_maps.json";

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
	postcss(selectorReplacerPlugin(opts)).process(css, {
		from: undefined,
		syntax: postcssStyl,
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
			const maps = JSON.parse(readFile(STEAM_CLASS_MAPS_FILE));
			const keys = Object.keys(maps);

			return fs.readdirSync(importsDir).map((e) =>
				usePostcss(
					{
						match: /#(\w+)/g,
						replace: (_, s) => {
							const className = `${e.replace(".styl", "")}_${s}_`;

							return "." + maps[keys.find((e) => e.startsWith(className))];
						},
					},
					readFile(path.join(importsDir, e)),
				),
			);

		case "discord":
			return readDir(rootDir)
				.filter(
					(e) =>
						e != path.join(rootDir, "vencord") && fs.lstatSync(e).isDirectory(),
				)
				.flatMap((e) => readDir(e))
				.map((e) => readFile(e))
				.map((e) =>
					usePostcss(
						{
							match: /\.(\w+)/g,
							replace: '[class*="$1_"]',
						},
						e,
					),
				);

		default:
			return [];
	}
})();

imports += (await Promise.all(processedFiles)).map((e) => e.css).join("\n");

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
		throw new Error(err.message);
	}

	fs.writeFileSync(
		outFile,
		mapText(css, (e) => e.replace(/;$/g, " !important;")),
	);
});

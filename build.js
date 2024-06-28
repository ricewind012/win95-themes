import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import postcssScss from "postcss-scss";
import * as sass from "sass-embedded";

const SHARED_DIR = path.join("src", "shared");
const SHARED_PP_DIR = path.join("src", "shared++");

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
		syntax: postcssScss,
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

const file = process.argv[2];
const rootDir = path.join("src", file);
const outFile = path.join("dist", file, `${file}.css`);

const sharedCss = [
	...readDir(SHARED_DIR).filter((e) => e != path.join(SHARED_DIR, ".git")),
	...readDir(SHARED_PP_DIR),
]
	.map(readFile)
	.join("\n")
	// scss is shit
	.replace("invert()", "string.unquote('invert()')");

const includedDirs = (() => {
	switch (file) {
		case "discord":
			return ["vencord"];
		case "steam":
			return fs
				.readdirSync(rootDir)
				.filter((e) => e != `${file}.scss` && e != "imports");
		default:
			return fs
				.readdirSync(rootDir)
				.filter((e) => fs.lstatSync(path.join(rootDir, e)).isDirectory());
	}
})();

const normalFiles = [
	path.join(rootDir, `${file}.scss`),
	...includedDirs.map((e) => path.join(rootDir, e)).map(readDir),
]
	.flat()
	.map(readFile)
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
							const className = `${e.replace(".scss", "")}_${s}_`;

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

const theEntireThing = [
	"@use 'sass:string';",
	sharedCss,
	normalFiles,
	(await Promise.all(processedFiles)).map((e) => e.css).join("\n"),
]
	.join("\n")
	// scss is shit
	.replace(/@extend :root.focused .titlebar/g, "");

sass
	.compileStringAsync(theEntireThing)
	.then((e) => {
		fs.writeFileSync(
			outFile,
			mapText(e.css, (e) => e.replace(/;$/g, " !important;")),
		);
	})
	.catch((e) => {
		console.log(e.message);
		fs.writeFileSync("/tmp/error", theEntireThing);
		process.exit(1);
	});

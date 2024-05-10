import fs from "node:fs";
import path from "node:path";
import stylus from "stylus";

const SHARED_DIR = path.join("src", "shared");
const SHARED_PP_DIR = path.join("src", "shared++");
const SHARED_STYLUS_DIR = path.join("src", "shared-styl");

const STEAM_CLASS_MAPS_FILE = "steam_class_maps.json";

const readFile = (e) => fs.readFileSync(e).toString();
const mapText = (text, fn) => text.split("\n").map(fn).join("\n");

const progs = fs.readdirSync("src").filter((e) => !e.startsWith("shared"));
if (process.argv.length == 2 || !progs.some((e) => process.argv[2] == e)) {
	console.error(
		"Usage: %s [%s]",
		path.basename(process.argv[1]),
		progs.join("|"),
	);
	process.exit(2);
}

const sharedFiles = fs
	.readdirSync(SHARED_PP_DIR)
	.map((e) => path.join(SHARED_PP_DIR, e));
const file = process.argv[2];
const isSteam = file == "steam";
const rootDir = path.join("src", file);
const outFile = path.join("dist", file, `${file}.css`);

const sharedCss = fs
	.readdirSync(SHARED_STYLUS_DIR)
	.map((e) => path.join(SHARED_STYLUS_DIR, e));
const includedDirs = (isSteam ? ["other"] : fs.readdirSync(rootDir))
	.filter((e) => fs.lstatSync(path.join(rootDir, e)).isDirectory())
	.map((e) => `${rootDir}/${e}/*`);
let imports = [
	...sharedCss,
	...sharedFiles,
	path.join(rootDir, `${file}.styl`),
	...includedDirs,
]
	.map((e) => `@import '${e}';`)
	.join("\n");

if (isSteam) {
	const importsPath = path.join("src", file, "imports");
	const maps = JSON.parse(readFile(STEAM_CLASS_MAPS_FILE));
	const keys = Object.keys(maps);

	imports += fs
		.readdirSync(importsPath)
		.map((e) =>
			readFile(path.join(importsPath, e)).replace(/#(\w+)/g, (_, s) => {
				// TODO: doesn't work if directly passed to startsWith()
				let klass = `${e.replace(".styl", "")}_${s}_`;

				return "." + maps[keys.find((e) => e.startsWith(klass))];
			}),
		)
		.join("\n");
}

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

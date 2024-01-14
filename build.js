let fs = require('node:fs');
let path = require('node:path');

let stylus = require('stylus');
let ts = require('typescript');

let progs = fs.readdirSync('src')
	.filter(e => !e.startsWith('shared'));

const SHARED_DIR = path.join('src', 'shared');
const SHARED_PP_DIR = path.join('src', 'shared++');
const SHARED_STYLUS_DIR = path.join('src', 'shared-styl');

function usage() {
	console.error(
		'Usage: %s [%s] [styl|ts]',
		path.basename(process.argv[1]),
		progs.join('|')
	);
	process.exit(2);
}

if (process.argv.length == 2)
	usage();
if (!progs.some(e => process.argv[2] == e))
	usage();
if (process.argv[3] != 'styl' && process.argv[3] != 'ts')
	usage();

let sharedFiles = fs.readdirSync(SHARED_PP_DIR)
	.filter(e => e.endsWith(process.argv[3]))
	.map(e => path.join(SHARED_PP_DIR, e));
let file = (() => {
	switch (process.argv[2]) {
		case 'steam': return 'libraryroot.custom';
		default:      return process.argv[2];
	}
})();
let isSteam = process.argv[2] == 'steam';
let rootDir = path.join('src', process.argv[2]);
let outExt = process.argv[3] == 'ts' ? 'js' : 'css';
let outFile = path.join('dist', process.argv[2], `${file}.${outExt}`);

switch (process.argv[3]) {
	case 'styl':
		let sharedCss = fs.readdirSync(SHARED_STYLUS_DIR)
			.map(e => path.join(SHARED_STYLUS_DIR, e));
		let includedDirs = (isSteam ? [ 'other' ] : fs.readdirSync(rootDir))
			.filter(e => fs.lstatSync(path.join(rootDir, e)).isDirectory())
			.map(e => `${rootDir}/${e}/*`);
		let imports = [
			path.join(rootDir, `${file}.styl`),
			...sharedCss,
			...sharedFiles,
			...includedDirs,
		]
			.map(e => `@import '${e}';`)
			.join('\n');

		if (isSteam) {
			let importsPath = path.join('src', process.argv[2], 'imports');

			imports += fs.readdirSync(importsPath)
				.map(e => fs.readFileSync(path.join(importsPath, e))
					.toString()
					.replace(/#(\w+)/g, `[class*="${e.replace('.styl', '')}_$1_"]`)
				)
				.join('\n');
		}

		// Variables have to be manually edited due to a Stylus bug (or its age).
		let cssVars = fs.readFileSync(path.join(SHARED_DIR, 'variables.css'))
			.toString()
			.replace(/ \/ /g, ' \\/ ')
			.split('\n')
			.map(e => e.endsWith(')') ? `${e} \\` : e)
			.join('\n');
		let renderer = stylus(cssVars + imports);

		renderer.render((err, css) => {
			if (err)
				throw new Error(err.message);

			css = css
				.split('\n')
				.map(e => e
					.replace(/;$/g, ' !important;')
					// TODO: remove when Steam updates chrome
					.replace(/:is/g, ':-webkit-any')
				)
				.join('\n');

			fs.writeFileSync(outFile, css);
		});
		break;

	case 'ts':
		let programOutOption = isSteam
			? { outDir: 'dist' }
			: { outFile: outFile };
		let program = ts.createProgram(
			[
				...sharedFiles.filter(e => e.endsWith(process.argv[3])),
				path.join(rootDir, `${file}.ts`),
			], Object.assign({
				target:  ts.ScriptTarget.ESNext,
				module:  ts.ModuleKind.ESNext,
				lib:     [
					"esnext",
					"dom",
					"dom.iterable",
				].map(e => `lib.${e}.d.ts`),
			}, programOutOption)
		);
		let result = program.emit();

		ts.getPreEmitDiagnostics(program)
			.concat(result.diagnostics)
			.forEach(e => {
				if (e.file) {
					let {
						line,
						character,
					} = ts.getLineAndCharacterOfPosition(e.file, e.start);
					let msg = ts.flattenDiagnosticMessageText(e.messageText, '\n');

					console.log(
						'%s (%s.%s): %s',
						e.file.fileName,
						line + 1,
						character + 1,
						msg
					);
				} else {
					console.log(ts.flattenDiagnosticMessageText(e.messageText, '\n'));
				}
			});

		// The extension doesn't assign [type="module"] to its <scripts>s
		if (!isSteam) {
			fs.writeFileSync(
				outFile,
				fs.readFileSync(path.join('dist', 'shared++', 'ElementUtils.js'))
					.toString()
					.split('\n')
					.slice(0, -2)
					.join('\n')
				+ fs.readFileSync(outFile).toString()
			);
		}

		process.exit(result.emitSkipped ? 1 : 0);
}

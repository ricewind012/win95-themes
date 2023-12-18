let classes: any = {};

declare var SteamClient: any;

new Set(
	[...document.querySelectorAll<HTMLStyleElement>('[rel="stylesheet"]')]
		.map(e => [...e.sheet.cssRules])
		.flatMap(e => e.map((e: CSSStyleRule) => e.selectorText))
		.flatMap(e =>
			e?.match(/_[\w-]{5}(::(before|after))?$/) && e
				.match(/\.[\w-]+/g)
				?.filter(e => e.includes('_') && !e.match(/^\._?Dialog/))
		)
		.filter(Boolean)
		.map(e => e.replace('.', ''))
).forEach(e => {
  let classnorm: string = e.replace(/_[\w-]{5}$/, '');
  let namespace = classnorm.replace(/_[a-zA-Z]+$/, '');
  let classname = classnorm.replace(`${namespace}_`, '');

  if (!classes[namespace])
		classes[namespace] = {};
  classes[namespace][classname] = e;
});

let el = (s: string) => document.querySelector<HTMLElement>(`.${s}`);

if (document.title == 'Steam') {
	(async () => {
		let sidebar = await ElementUtils.wait(`.${classes.library.LeftListSizableContainer}`);
		let tabs = await ElementUtils.wait(
			`.${classes.gamelistbar.GameListHomeAndSearch}`,
			sidebar
		);

		ElementUtils.act(
			sidebar,
			() => {
				tabs.style.marginLeft = `${sidebar.style.width} !important`;
			},
			{
				attributes: true,
				attributeFilter: [ 'style' ],
			}
		);
	})();
}

if (document.title == 'Steam Settings') {
	SteamClient.Window.ResizeTo(1010, 722, true);
}
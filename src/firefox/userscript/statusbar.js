function onTabEvent(ev) {
	const { detail, target, type } = ev;

	console.warn("Got tab event %o", { detail, target, type });
}

export function initStatusbar() {
	document.addEventListener("TabAttrModified", onTabEvent);
	document.addEventListener("TabSelect", onTabEvent);
	document.addEventListener("TabOpen", onTabEvent);
	document.addEventListener("TabClose", onTabEvent);
}

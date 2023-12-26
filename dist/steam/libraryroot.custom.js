var ElementUtils;
(function (ElementUtils) {
    /**
     * Create an element.
     * @param tag HTML tag.
     * @param attrs Key/value attributes.
     * @param parent Element to prepend to.
     * @param prepend Prepend the element to its parent?
     */
    function make(tag, attrs, parent = null, prepend = false) {
        let el = document.createElement(tag);
        for (let k in attrs)
            el.setAttribute(k, attrs[k]);
        if (parent)
            if (prepend)
                parent.prepend(el);
            else
                parent.appendChild(el);
        return el;
    }
    ElementUtils.make = make;
    /**
     * Do something on a DOM mutation event.
     * @param el Element to look in.
     * @param callback The function to be called on DOM mutation.
     * @param opts MutationObserver options.
     */
    function act(el, callback, opts) {
        let observer = new MutationObserver(callback);
        observer.observe(el, opts);
        return observer;
    }
    ElementUtils.act = act;
    /**
     * Wait for an element.
     * @param selector CSS selector.
     * @param parent Element to look in.
     */
    function wait(selector, parent = document) {
        return new Promise((resolve) => {
            let el = parent.querySelector(selector);
            if (el)
                resolve(el);
            let observer = new MutationObserver(() => {
                let el = parent.querySelector(selector);
                if (!el)
                    return;
                resolve(el);
                observer.disconnect();
            });
            observer.observe(document.body, {
                subtree: true,
                childList: true,
            });
        });
    }
    ElementUtils.wait = wait;
})(ElementUtils || (ElementUtils = {}));
let classes = {};
new Set([...document.querySelectorAll('[rel="stylesheet"]')]
    .map(e => [...e.sheet.cssRules])
    .flatMap(e => e.map((e) => e.selectorText))
    .flatMap(e => e?.match(/_[\w-]{5}(::(before|after))?$/) && e
    .match(/\.[\w-]+/g)
    ?.filter(e => e.includes('_') && !e.match(/^\._?Dialog/)))
    .filter(Boolean)
    .map(e => e.replace('.', ''))).forEach(e => {
    let classnorm = e.replace(/_[\w-]{5}$/, '');
    let namespace = classnorm.replace(/_[a-zA-Z]+$/, '');
    let classname = classnorm.replace(`${namespace}_`, '');
    if (!classes[namespace])
        classes[namespace] = {};
    classes[namespace][classname] = e;
});
(async () => {
    let el = (s) => document.querySelector(`.${s}`);
    if (document.title == 'Steam') {
        let sidebar = await ElementUtils.wait(`.${classes.library.LeftListSizableContainer}`);
        let tabs = await ElementUtils.wait(`.${classes.gamelistbar.GameListHomeAndSearch}`, sidebar);
        ElementUtils.act(sidebar, () => {
            tabs.style.marginLeft = `${sidebar.style.width} !important`;
        }, {
            attributes: true,
            attributeFilter: ['style'],
        });
    }
    if (document.title == 'Steam Settings') {
        SteamClient.Window.ResizeTo(1010, 722, true);
    }
    if (document.title == 'Game Servers') {
        SteamClient.Window.SetMinSize(500, 500);
    }
})();

const ElementUtils = {
    /**
     * Create an element.
     *
     * @param tag HTML tag.
     * @param attrs Key/value attributes.
     * @param parent Element to prepend to.
     * @param prepend Prepend the element to its parent?
     */
    make(tag, attrs, parent = null, prepend = false) {
        const el = document.createElement(tag);
        for (const k in attrs) {
            el.setAttribute(k, attrs[k]);
        }
        if (parent) {
            if (prepend) {
                parent.prepend(el);
            }
            else {
                parent.appendChild(el);
            }
        }
        return el;
    },
    /**
     * Do something on a DOM mutation event.
     *
     * @param el Element to look in.
     * @param callback The function to be called on DOM mutation.
     * @param opts MutationObserver options.
     */
    act(el, callback, opts) {
        const observer = new MutationObserver(callback);
        observer.observe(el, opts);
        return observer;
    },
    /**
     * Wait for an element.
     *
     * @param selector CSS selector.
     * @param parent Element to look in.
     */
    wait(selector, parent = document) {
        return new Promise((resolve) => {
            const el = parent.querySelector(selector);
            if (el) {
                resolve(el);
            }
            const observer = new MutationObserver(() => {
                const el = parent.querySelector(selector);
                if (!el) {
                    return;
                }
                resolve(el);
                observer.disconnect();
            });
            observer.observe(document.body, {
                subtree: true,
                childList: true,
            });
        });
    },
};
export default ElementUtils;

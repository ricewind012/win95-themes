const ElementUtils = {
	/**
	 * Create an element.
	 * @param tag HTML tag.
	 * @param attrs Key/value attributes.
	 * @param parent Element to prepend to.
	 * @param prepend Prepend the element to its parent?
	 */
	make(
		tag: string,
		attrs: any,
		parent: HTMLElement | null = null,
		prepend: boolean = false,
	): HTMLElement {
		let el = document.createElement(tag);

		for (let k in attrs)
			el.setAttribute(k, attrs[k]);

		if (parent)
			if (prepend)
				parent.prepend(el);
			else
				parent.appendChild(el);

		return el;
	},

	/**
	 * Do something on a DOM mutation event.
	 * @param el Element to look in.
	 * @param callback The function to be called on DOM mutation.
	 * @param opts MutationObserver options.
	 */
	act(
		el: Element,
		callback: (records: MutationRecord[]) => any,
		opts: MutationObserverInit,
	): MutationObserver {
		let observer = new MutationObserver(callback);

		observer.observe(el, opts);

		return observer;
	},

	/**
	 * Wait for an element.
	 * @param selector CSS selector.
	 * @param parent Element to look in.
	 */
	wait(
		selector: string,
		parent: Document | Element = document,
	): Promise<HTMLElement> {
		return new Promise((resolve) => {
			let el: HTMLElement | null = parent.querySelector(selector);

			if (el)
				resolve(el);

			let observer = new MutationObserver(() => {
				let el: HTMLElement | null = parent.querySelector(selector);

				if (!el)
					return;

				resolve(el);
				observer.disconnect();
			});

			observer.observe(document.body, {
				subtree:   true,
				childList: true,
			});
		});
	},
}

export default ElementUtils;

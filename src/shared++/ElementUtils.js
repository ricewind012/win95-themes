export const ElementUtils = {
	/**
	 * Do something on a DOM mutation event.
	 *
	 * @param {Node} el Element to look in.
	 * @param {MutationCallback} callback The function to be called on DOM mutation.
	 * @param {MutationObserver} opts
	 */
	act(el, callback, opts) {
		const observer = new MutationObserver(callback);
		observer.observe(el, opts);

		return observer;
	},

	/**
	 * Create an element.
	 *
	 * @param {string} tag HTML tag.
	 * @param {Record<string, string>} attrs Key/value attributes.
	 * @param {Node} parent Element to prepend to.
	 * @param {boolean} prepend Prepend the element to its parent?
	 */
	make(tag, attrs, parent = null, prepend = false) {
		const el = document.createElement(tag);

		for (const k in attrs) {
			el.setAttribute(k, attrs[k]);
		}

		if (parent) {
			if (prepend) {
				parent.prepend(el);
			} else {
				parent.appendChild(el);
			}
		}

		return el;
	},

	/**
	 * Wait for an element.
	 *
	 * @param {string} selector CSS selector.
	 * @param {Node} parent Element to look in.
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
				childList: true,
				subtree: true,
			});
		});
	},
};

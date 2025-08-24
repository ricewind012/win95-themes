# Firefox

Last tested version is 143.0a1! Closest ESR version is 140, so if the theme happens to not receive updates, you can try using that one instead.

## Usage

1. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. Execute the following in terminal (edit the paths!):

```sh
theme_path="/path/to/win95-themes/dist"
profile_path="/path/to/profile/chrome"
rm "$profile_path/CSS"/*
ln -s "$theme_path/src/firefox/win95_main.uc.mjs" "$profile_path/JS"
ln -s "$theme_path/firefox_global.css" "$profile_path/CSS/firefox_global.uc.css"
ln -s "$theme_path/firefox_agent.css" "$profile_path/CSS/win95_agent.uc.css"
ln -s "$theme_path/firefox_author.css "$profile_path/CSS/win95_author.uc.css"
ln -s "$theme_path/firefox_author.css" "$profile_path/userChrome.css"
ln -s "$theme_path/firefox_content.css" "$profile_path/userContent.css"
```

3. Add to `user.js` the following:

```js
user_pref("ui.prefersReducedMotion", 1);
user_pref("widget.gtk.overlay-scrollbars.enabled", false);
user_pref("widget.non-native-theme.scrollbar.size.override", 16);
user_pref("widget.non-native-theme.scrollbar.style", 4);

// Optional - may work without them, but I did not test with defaults
user_pref("browser.tabs.tabMinWidth", 120);
user_pref("browser.theme.dark-private-windows", false);
user_pref("browser.urlbar.trimURLs", false);
user_pref("identity.fxaccounts.enabled", false);

// These also have to be enabled, as they are very likely to be removed sooner
// or later
user_pref("sidebar.revamp", true);
```

### Preferences

TODO PLSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS do this

- win95.customize-mode-as-window
  Will not work if window size is <= 830px.

- win95.navbar-buttons-text
  Will display buttons' text in nav bar.

## Caveats

- FUCKING NONE (yet)

## Differences

- All URL bar action/status buttons have been removed
- "Expand on hover" sidebar option is not yet supported (will revert automatically if set)

## TODO

1. Tabs
   - Tree tab groups
   - Sidebar expand on hover ?

2. Content (including sidebar panels)
   Will have to wait for Mozilla to replace XUL elements with their newer ones, so not any time soon.

   Maybe also open about pages in a window and give them a window styling:

   ```js
   Services.ww.openWindow(
   	null,
   	"about:addons",
   	null,
   	"chrome,titlebar,width=600,height=800",
   	null,
   );

   // also need this for about pages, or... see #3
   user_pref("userChromeJS.persistent_domcontent_callback", true);
   ```

3. Patch Firefox (maybe)
   Actually considering patching `/opt/firefox-nightly/browser/omni.ja` to include my CSS because of the shadow DOM bullshit actively sabotaging my time... Might actually be better than relying on user{Chrome,Content}.css magic.

4. Places window
   It will be most likely 2030 when they finally decide to rewrite it or whatever, but I only need `<tree>` removed.

5. Extensions support
   - Stylus
   - uBlock Origin
   - Violentmonkey

## Preview

![Main Window](../img/firefox.png)

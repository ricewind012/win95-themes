# Firefox

Last tested version is 143.0a1!

## Usage

1. Install [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).
2. TODO: scripts (maybe)
3. Execute the following in terminal (edit the paths!):

```sh
theme_path="/path/to/win95-themes/dist"
profile_path="/path/to/profile/chrome"
ln -s "$theme_path/firefox_agent.css "$profile_path/resources/userChrome.ag.css"
ln -s "$theme_path/firefox_author.css" "$profile_path/userChrome.css"
ln -s "$theme_path/firefox_author.css "$profile_path/resources/userChrome.au.css"
```

4. Add to `user.js` the following:

```js
user_pref("ui.prefersReducedMotion", 1);
user_pref("widget.gtk.overlay-scrollbars.enabled", false);
user_pref("widget.non-native-theme.scrollbar.size.override", 16);
user_pref("widget.non-native-theme.scrollbar.style", 4);

// Optional - may work, but I did not test with these on
user_pref("browser.tabs.tabMinWidth", 100);
user_pref("browser.theme.dark-private-windows", false);
user_pref("browser.urlbar.trimURLs", false);
user_pref("identity.fxaccounts.enabled", false);

// These also have to be enabled, as they are very likely to be removed sooner
// or later
user_pref("sidebar.revamp", true);
```

## Caveats

- Made only for vertical tabs

## Differences

- All URL bar action/status buttons have been removed
- Zoom in/out in main menu is disabled

## Preview

![Main Window](../img/firefox.png)

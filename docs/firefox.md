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

## Caveats

- FUCKING NONE (yet)

## Differences

- All URL bar action/status buttons have been removed

## TODO

1. Tabs
   - Pinned tabs
   - Tab groups

2. Content
   Will have to wait for Mozilla to replace XUL elements with their newer ones, so not any time soon.

## Preview

![Main Window](../img/firefox.png)

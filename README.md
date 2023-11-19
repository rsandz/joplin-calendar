# Joplin Plugin

> **Warning**
> This Plugin is currently Work-In-Progress

This plugin for [Joplin](https://joplinapp.org/) adds a simple calendar which also helps track notes created on each day.

![Showcase](./images/showcase.png)

# Features

- The plugin contains a calendar and a notes list.
- Clicking on a calendar date shows the notes created or updated on that date.
  - Showing updated notes can be disabled in the settings.
- Navigate to the notes by clicking on the titles in the notes list.

> **Info**
> The create date for a note can be manually change by clicking on the "🛈" button.

- Calendar dates have dots beneath them indicating the number of notes written on that day.

  - Each dot represents 2 notes created, up to a maximum of 4 dots.

- When holding the `ctrl` key, button icons may change and will instead do the following:
  - Clicking on the calendar buttons will move between years.
  - Clicking on the note list buttons will move between days with notes.

## Keyboard Shortcuts

### Joplin Wide

| Action              | Default Shortcut  |
| ------------------- | ----------------- |
| Toggle the Calendar | CmdOrCtrl+Shift+` |

### After clicking on Calendar

- Use the arrow key to move between dates.

- Use Ctrl to jump between days with notes.
  - Use Ctrl+Left or Ctrl+Up to jump to the nearest date in the past with a note.
  - Use Ctrl+Right or Ctrl+Down to jump to the nearest date in the future with a note.

### After clicking on the note list

- Use up and down arrow keys to select notes.

# Development

## Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.
Alternatively, to automatically rebuild the plugin on source code changes, run `npm run watch`

## Testing the plugin

Jest is used for unit tests. Run them with: `npm run test`.

## Updating the plugin framework

To update the plugin framework, run `npm run update`.

In general this command tries to do the right thing - in particular it's going to merge the changes in package.json and .gitignore instead of overwriting. It will also leave "/src" as well as README.md untouched.

The file that may cause problem is "webpack.config.js" because it's going to be overwritten. For that reason, if you want to change it, consider creating a separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.

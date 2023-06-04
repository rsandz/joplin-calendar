# Joplin Plugin

> **Warning**
> This Plugin is currently Work-In-Progress

This plugin for [Joplin](https://joplinapp.org/) adds a simple calendar which also helps track notes created on each day.

![Showcase](./images/showcase.png)

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

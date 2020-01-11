# modular-js-helper

Atom plugin for easily `import`-ing or `require`-ing your modules. We want this plugin to be the most helpful, most robust, and most complete modular JS(and TS) helper.

+ [🗣 Help by answering questions](/tcrowe/modular-js-helper/issues)
+ [🤔 Help by reviewing PRs](/tcrowe/modular-js-helper/pulls)
+ [💰 Crowdfund](#crowdfund)

Module types:

+ CommonJS `require`
+ ESM `import`
+ AMD `define`

It searches:

+ files in each project
+ `node_modules`
+ `package.json` → `dependencies` & `devDependencies`

## Table of Contents

+ [Crowdfund](#crowdfund)
+ [Why? Aren't there other plugins that do this already?](#why-arent-there-other-plugins-that-do-this-already)
+ [Development](#development)
  + [Configuration](#configuration)
  + [Scripts](#scripts)
+ [Copying, license, and contributing](#copying-license-and-contributing)

## Crowdfund

Thank you for contributing your time or money to help this plugin. Funds will go directly to contributors that are answering questions, writing code, or to fund bounties.

[Contact @tcrowe](https://tcrowe.github.io/contact/) until we setup payment options as a community.

## Why? Aren't there other plugins that do this already?

*Yes, but* they don't work or they aren't really that helpful. You have to be able to search all the known files and modules. Once you've cataloged the files you then need to intelligently add the snippet into the code.

This plugin searches in many different places and allows you to configure the way it searches. The configuration allows you to choose `import`, `require`, or even `define` from AMD modules.

These are the others which are for specific use cases, incomplete, not working, or out-of-date.

`require`-ing

+ <https://atom.io/packages/require>
+ <https://atom.io/packages/relative-require>
+ <https://atom.io/packages/node-require>
+ <https://atom.io/packages/insert-require>
+ <https://atom.io/packages/node-requirer>

`import`-ing

+ <https://atom.io/packages/import-it>
+ <https://atom.io/packages/atom-import-js>
+ <https://atom.io/packages/import-helper>
+ <https://atom.io/packages/atom-import-module>

## Development

Atom plugins can be difficult to develop so lets go over how to develop on this and power it up to be the best plugin.

### Configuration

See [./package.json#configSchema](./package.json)

It's a JSON Schema object.

[Atom Config object](https://flight-manual.atom.io/api/v1.42.0/Config/)

### Scripts

```sh
# analyze code during development
npm run dev

# before commit, run production script, format docs
npm run prd
```

`npm run prd` will format the readme with `remark` and run tests with `mocha`.

## Copying, license, and contributing

Copyright (C) Tony Crowe 2020 <https://tcrowe.github.io/contact/>

Thank you for using and contributing to make modular-js-helper better.

⚠️ Please run `npm run prd` before submitting a patch.

⚖️ modular-js-helper is Free Software protected by the GPL 3.0 license. See [./COPYING](./COPYING) for more information. (free as in freedom)

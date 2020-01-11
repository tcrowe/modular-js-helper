const path = require("path");
const { CompositeDisposable } = require("atom");
const parallel = require("async/parallel");
const SelectList = require("atom-select-list");
const isNil = require("lodash/isNil");
const merge = require("lodash/merge");
const configPrefix = "modular-js-helper";
const listNodeModules = require("./lib/list-node-modules");
const listPackageJsonItems = require("./lib/list-package-json-items");
const sourceFileList = require("./lib/source-file-list");
const squeeze = require("./lib/squeeze");
const relative = require("relative");
const filterKeyForItem = item => item.name;

/**
 * Select list requires a DOM element to populate so this creates it
 * @param {object} item
 * @returns {object} DOM element
 */
function elementForItem(item) {
  const el = document.createElement("li");
  // el.classList.add("inline-block");
  el.innerHTML = item.name;
  return el;
}

const quoteMap = {
  single: "'",
  double: '"',
  template: "`"
};

/**
 * The atom editor plugin for modular-js-helper
 * @type {object}
 */
const modularJsHelperPlugin = {
  subscriptions: null,
  panel: null,
  list: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that displays Hello World
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "modular-js-helper:find-then-insert": () => this.findThenInsert()
      })
    );
  },

  close() {
    if (isNil(this.list) === false) {
      // this.list.destroy();
    }
    if (isNil(this.panel) === false) {
      this.panel.destroy();
    }
  },

  deactivate() {
    this.close();
    this.subscriptions.dispose();
  },

  // didChangeQuery(query) {
  //   console.log("didChangeQuery", query);
  // },

  // didChangeSelection(item) {
  //   console.log("didChangeSelection", item);
  // },

  didConfirmSelection(item) {
    const { moduleSystem, declarationKeyword, quotes } = atom.config.get(
      configPrefix
    );
    const editor = atom.workspace.getActiveTextEditor();
    const { type, name } = item;
    let op = "";
    let modPath = name;
    let formattedName = name
      .split(path.sep)
      .pop()
      .split(".")[0]
      .split(/\W/g);

    formattedName = squeeze(formattedName)
      .map(function(item, index) {
        if (index === 0) {
          return item.toLowerCase();
        }
        return item[0].toUpperCase() + item.substring(1).toLowerCase();
      })
      .join("");

    if (type === "source") {
      // get path relative to editor file
      // modPath = path.relative(editor.getPath(), modPath);
      modPath = relative(editor.getPath(), modPath);
      if (path.isAbsolute(modPath) === false) {
        modPath = `./${modPath}`;
      }
    }

    const quoteChar = quoteMap[quotes];

    if (moduleSystem === "commonjs") {
      op = [
        declarationKeyword,
        " ",
        formattedName,
        " = require(",
        quoteChar,
        modPath,
        quoteChar,
        ")"
      ];
    } else if (moduleSystem === "esm") {
      op = ["import ", formattedName, " from ", quoteChar, modPath, quoteChar];
    } else if (moduleSystem === "amd") {
      op = [
        "define(",
        quoteChar,
        modPath,
        ", function(",
        formattedName,
        ") {})"
      ];
    }

    const [selection] = editor.insertText(op.join(""));

    // TODO: how do you put the cursor to the end of the line?
    console.log("selection", selection);
    editor.moveToEndOfLine();

    this.close();
  },

  didConfirmEmptySelection() {
    this.close();
    // console.log("didConfirmEmptySelection");
  },

  didCancelSelection() {
    this.close();
    // console.log("didCancelSelection");
  },

  updateList(opts) {
    const listOpts = merge(
      {},
      {
        items: [],
        // maxItems: 6,
        filterKeyForItem,
        elementForItem,
        // didChangeQuery: this.didChangeQuery.bind(this),
        // didChangeSelection: this.didChangeSelection.bind(this),
        didConfirmSelection: this.didConfirmSelection.bind(this),
        didConfirmEmptySelection: this.didConfirmEmptySelection.bind(this),
        didCancelSelection: this.didCancelSelection.bind(this)
      },
      opts
    );

    if (isNil(this.list) === true) {
      this.list = new SelectList(listOpts);
    } else {
      this.list.update(listOpts);
    }

    this.list.focus();
  },

  updatePanel() {
    this.panel = atom.workspace.addModalPanel({ item: this.list });
  },

  findThenInsert() {
    const plugin = this;
    // atom.notifications.addInfo("Hello World");

    const config = atom.config.get("modular-js-helper");

    const {
      searchProjectSourcePath,
      projectSourcePath,
      searchPackageJson,
      searchNodeModules
      // usePackageJsonConfigs,
    } = config;

    let { extensions, excludes } = config;

    extensions = extensions
      .split(",")
      .map(item => item.trim())
      .join(",");

    excludes = excludes.split(",").map(item => item.trim());

    const steps = [];

    this.updateList({ loadingMessage: "Searching for modules" });
    this.updatePanel();

    //
    // searching files
    //
    if (searchProjectSourcePath === true) {
      atom.project.rootDirectories.forEach(function(rootDirectory) {
        const sourcePath = path.join(rootDirectory.path, projectSourcePath);
        steps.push(done =>
          sourceFileList({ sourcePath, extensions, excludes }, done)
        );
      });
    }

    //
    // searching node modules
    //
    if (searchNodeModules === true) {
      atom.project.rootDirectories.forEach(function(rootDirectory) {
        const nodeModulesPath = path.join(rootDirectory.path, "node_modules");
        steps.push(done => listNodeModules(nodeModulesPath, done));
      });
    }

    //
    // search package.json files
    //
    if (searchPackageJson === true) {
      atom.project.rootDirectories.forEach(function(rootDirectory) {
        steps.push(done =>
          listPackageJsonItems(
            path.join(rootDirectory.path, "package.json"),
            done
          )
        );
      });
    }

    parallel(steps, function(err, res) {
      if (isNil(err) === false) {
        console.error("error in searching steps", err);
        return;
      }

      let items = squeeze(res);
      plugin.updateList({ items, loadingMessage: "" });
    });
  }
};

module.exports = modularJsHelperPlugin;

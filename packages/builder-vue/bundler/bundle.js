const fs = require("fs");
const path = require("path");
const debug = require("debug")("vue");
const mkdirp = require("mkdirp");
const crypto = require("crypto");
const ISDEV = process.env.NODE_ENV !== "production";
function sha1(data) {
  return crypto
    .createHash("sha1")
    .update(data, "binary")
    .digest("hex");
}

module.exports = async (
  filename,
  bundlePath,
  basePath,
  publicBundlePath,
  targetNode
) => {
  const Bundler = require("zero-parcel-bundler");
  mkdirp.sync(bundlePath);

  // we need a entry file
  var entryFileName = path.join(
    process.env.BUILDPATH,
    "/entry." + sha1(filename) + ".js"
  );
  const entry = createEntry(
    path.relative(path.dirname(entryFileName), filename)
  );
  // save entry code in a file and feed it to parcel
  fs.writeFileSync(entryFileName, entry, "utf8");

  // Bundler options
  const bundler = new Bundler(targetNode ? filename : entryFileName, {
    outDir: bundlePath,
    outFile: targetNode ? "bundle.node.js" : "bundle.js",
    publicUrl: publicBundlePath,
    rootDir: process.env.SOURCEPATH,
    watch: !process.env.ISBUILDER,
    hmr: ISDEV && !process.env.ISBUILDER && !targetNode,
    logLevel: 2,
    target: targetNode ? "node" : "browser",
    cacheDir: path.join(
      process.env.BUILDPATH,
      "_cache",
      sha1(filename),
      targetNode ? "node" : "browser"
    ),
    cache: !process.env.ISBUILDER,
    minify: !ISDEV,
    autoinstall: false,
    sourceMaps: false //!ISDEV
  });
  //console.log("rootDir", bundler.options.rootDir)

  const bundle = await bundler.bundle();

  //https://github.com/parcel-bundler/parcel/issues/1401
  if (targetNode) {
    const bundleNodeFile = path.join(bundlePath, "bundle.node.js");
    if (fs.existsSync(bundleNodeFile)) {
      var bundleContent = fs.readFileSync(bundleNodeFile, "utf8");
      bundleContent = `;var parcelRequire;\n` + bundleContent;
      fs.writeFileSync(bundleNodeFile, bundleContent, "utf8");
    } else {
      debug("bundle for node doesn't exists.", bundleNodeFile);
    }
  }

  return bundle;
};

const createEntry = componentPath => {
  componentPath = componentPath.replace(/\\/g, "/"); // fix slashes for fwd on windows
  componentPath = componentPath.startsWith(".")
    ? componentPath
    : "./" + componentPath;
  return `
  import Vue from 'vue';
  import Meta from 'vue-meta'
  import Page from '${componentPath}';
  const PageExt = Vue.extend(Page);
  Vue.use(Meta, {
    keyName: "head"
  })

  //const App = new Vue(PageExt)
  if (typeof window === 'undefined'){
    module.exports = new Vue(PageExt)
  }
  else{
    new PageExt({
      el: '#__ZERO',
      data: window.__ZERO_ASYNCDATA
    })
    delete window.__ZERO_ASYNCDATA
  }
  
`;
};

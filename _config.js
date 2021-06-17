import lume from "lume/mod.js";
import date from "lume/plugins/date.js";
import postcss from "lume/plugins/postcss.js";
import terser from "lume/plugins/terser.js";
import code_highlight from "lume/plugins/code_highlight.js";
import base_path from "lume/plugins/base_path.js";
import slugify_urls from "lume/plugins/slugify_urls.js";

const site = lume({
  location: "https://example.com/",
});

site
  .ignore("README.md")
  .copy("img")
  .use(postcss())
  .use(terser())
  .use(date())
  .use(code_highlight())
  .use(base_path())
  .use(slugify_urls({ alphanumeric: false }));

export default site;

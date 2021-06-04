import lume from "lume/mod.js";
import date from "lume/plugins/date.js";
import postcss from "lume/plugins/postcss.js";
import code_highlight from "lume/plugins/code_highlight.js";
import base_path from "lume/plugins/base_path.js";

const site = lume({
  location: new URL("https://example.com/"),
});

site.ignore("README.md");
site.copy("img");

site.use(postcss());
site.use(date());
site.use(code_highlight());
site.use(base_path());

site.filter(
  "head",
  (array = [], n) => (n < 0) ? array.slice(n) : array.slice(0, n),
);
site.filter("min", (...numbers) => Math.min.apply(null, numbers));

export default site;

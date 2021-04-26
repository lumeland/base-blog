import lume from "https://deno.land/x/lume@v0.18.0/mod.js";
import date from "https://deno.land/x/lume@v0.18.0/plugins/date.js";
import postcss from "https://deno.land/x/lume@v0.18.0/plugins/postcss.js";

const site = lume({
  location: new URL("https://example.com/"),
});

site.ignore("README.md");
site.copy("img");

site.use(postcss());
site.use(date());

site.filter(
  "head",
  (array = [], n) => (n < 0) ? array.slice(n) : array.slice(0, n),
);
site.filter("min", (...numbers) => Math.min.apply(null, numbers));

export default site;

// import lume from "https://deno.land/x/lume/mod.js";
import lume from "../lume/mod.js";
import date from "../lume/filters/date.js";
import postcss from "../lume/plugins/postcss.js";

const site = lume({
  location: new URL("https://example.com/"),
});

site.filter("date", date());
site.ignore("README.md");
site.copy("img");

site.use(postcss());

// Get the first `n` elements of a collection.
site.filter("head", (array = [], n) => {
  if (n < 0) {
    return array.slice(n);
  }

  return array.slice(0, n);
});

site.filter("min", (...numbers) => Math.min.apply(null, numbers));

export default site;

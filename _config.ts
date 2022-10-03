import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import postcss from "lume/plugins/postcss.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import netlifyCMS from "lume/plugins/netlify_cms.ts";
import pageFind from "lume/plugins/pagefind.ts";

const site = lume({
  location: new URL("https://example.com/"),
});

site
  .ignore("README.md")
  .copy("img")
  .use(postcss())
  .use(date())
  .use(codeHighlight())
  .use(basePath())
  .use(pageFind({
    ui: {
      resetStyles: false,
    },
  }))
  .use(slugifyUrls({ alphanumeric: false }))
  .use(resolveUrls())
  .use(netlifyCMS({ netlifyIdentity: true }));

export default site;

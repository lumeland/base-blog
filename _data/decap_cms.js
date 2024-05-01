import f from "https://deno.land/x/netlify_cms_config@v0.2.0/mod.ts";

f.defaultRequired = false;

const config = {
  backend: {
    name: "git-gateway",
    branch: "master",
  },
  media_folder: "img",
  collections: [],
};

// Posts
config.collections.push(
  f.folder("Posts", "posts")
    .description("Here you can create or edit your posts")
    .preview(false)
    .create(true)
    .viewFilter("Draft", "draft", true)
    .fields([
      f.string("Title"),
      f.string("Description"),
      f.datetime("Date"),
      f.list("Tags"),
      f.boolean("Draft").required(false),
      f.markdown("Body"),
    ])
    .toJSON(),
);

const pageFields = [
  f.string("Title"),
  f.string("Url"),
  f.markdown("Body"),
  f.object("Menu", [
    f.boolean("Visible"),
    f.number("Order"),
  ]),
  f.hidden("templateClass"),
  f.hidden("layout"),
];

// Individual pages
config.collections.push(
  f.files("Pages")
    .description("Here you can edit your individual pages")
    .preview(false)
    .file("About", "about.md", pageFields)
    .file("404", "404.md", pageFields)
    .toJSON(),
);

export default config;

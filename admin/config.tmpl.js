import { stringify } from "lume/deps/yaml.js";

export const url = "./config.yml";

export default (data, { url }) => {
  const config = {
    backend: {
      name: "git-gateway",
      branch: "master",
    },
    media_folder: "img",
    display_url: url("/"),
    collections: [],
  };

  // Posts
  config.collections.push({
    label: "Posts",
    name: "posts",
    description: "Here you can create or edit your posts",
    folder: "posts",
    preview: false,
    create: true,
    view_filters: [
      {
        label: "Drafts",
        field: "draft",
        pattern: true,
      },
    ],
    fields: [
      field("title"),
      field("description"),
      field("date", "datetime"),
      field("tags", "list"),
      field("draft", "boolean"),
      field("body", "markdown"),
    ],
  });

  const pageFields = [
    field("title"),
    field("url", "string"),
    field("body", "markdown"),
    field("menu", "object", {
      fields: [
        field("visible", "boolean"),
        field("order", "number"),
      ],
    }),
    field("templateClass", "hidden"),
    field("layout", "hidden"),
  ];

  // Individual pages
  config.collections.push({
    label: "pages",
    name: "pages",
    description: "Here you can edit your individual pages",
    preview: false,
    files: [
      {
        label: "about",
        name: "about",
        file: "/about.md",
        fields: pageFields,
      },
      {
        label: "404",
        name: "404",
        file: "/404.md",
        fields: pageFields,
      },
    ],
  });

  return stringify(config);
};

function field(label, widget = "string", extra = {}) {
  return { label, name: label.toLowerCase(), widget, ...extra };
}

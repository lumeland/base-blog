import { stringify } from "lume/deps/yaml.js";

export const url = "./config.yml";

export default (data, {url}) => {
  const config = {
    backend: {
      name: "git-gateway",
      branch: "master"
    },
    media_folder: "img",
    display_url: url("/"),
    collections: []
  };

  const posts = {
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
      }
    ],
    fields: [
      field("Title"),
      field("Description"),
      field("Date", "datetime"),
      field("Tags", "list"),
      field("Draft", "boolean"),
      field("Body", "markdown"),
    ]
  };

  config.collections.push(posts);

  return stringify(config);
}

function field(label, widget = "string", name = label.toLowerCase()) {
  return { label, name, widget };
}

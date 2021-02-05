export const layout = "layouts/tag.njk";

export default function* ({ search }) {
  for (const tag of search.tags()) {
    yield {
      permalink: `tags/${tag}`,
      title: `Tagged “${tag}”`,
      tag,
    };
  }
}

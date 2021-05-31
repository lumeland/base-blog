export const layout = "layouts/archive.njk";
export const title = "Archive";

export default function* ({ search, paginate }) {
  const posts = search.pages("type=posts");

  for (const data of paginate(posts, { url: (n) => `posts/${n}/`, size: 10 })) {
    // Show the first page in the menu
    if (data.pagination.page === 1) {
      data.menu = {
        visible: true,
        order: 1,
      };
    }

    yield data;
  }
}

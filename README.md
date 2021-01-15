# lume-base-blog

A starter repository showing how to build a blog with the [Lume](https://github.com/lumeland/lume) static site generator.

This project started as a fork of [eleventy-base-blog](https://github.com/11ty/eleventy-base-blog) but adapted to Lume.

## Demos

* [GitHub Pages](https://lumeland.github.io/base-blog/)

## Getting Started

### 1. Clone this Repository

```
git clone https://github.com/lumeland/base-blog.git my-blog-name
```

### 2. Navigate to the directory

```
cd my-blog-name
```

Specifically have a look at `_config.js` to see if you want to configure any option differently. See the [Lume documentation site](https://lumeland.github.io/) for more info.

### 3. Edit _data/site.yml

### 4. Run Lume

```
lume --serve
```

### Implementation Notes

* `about.md` shows how to add a content page.
* `posts/` has the blog posts but really they can live in any directory. The `posts/_data.yml` file adds the `post` tag to all posts
* Add the `menu` tag to add a template to the top level site navigation. For example, this is in use on `index.njk` and `about.md`. You can configure the order with `menuOrder` and the text with `menuTitle`.
* Content can be any template format (blog posts needn’t be markdown, for example).
* `css` files are processed with `postcss` plugin.
* `img` folder is copied as is, (keeping the same directory structure).
* The blog post feed template is in `feed/feed.njk`. This is also a good example of using a global data files in that it uses `_data/site.yml`.
* This example uses four layouts:
  * `_includes/layouts/base.njk`: the top level HTML structure
  * `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
  * `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
  * `_includes/layouts/tag.njk`: the tag page template (wrapped into `base.njk`)
* `_includes/postlist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts. `index.njk` has an example of how to use it.

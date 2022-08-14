# lume-base-blog

A starter repository showing how to build a blog with the
[Lume](https://github.com/lumeland/lume) static site generator.

This project started as a fork of
[eleventy-base-blog](https://github.com/11ty/eleventy-base-blog) but adapted to
Lume and with the NetlifyCMS.

## Getting Started

1. Make sure you have [Deno installed](https://deno.land/#installation).
2. Clone this Repository
   `git clone https://github.com/lumeland/base-blog.git my-blog-name`
3. Edit `_data/site.yml`. Specifically have a look at `_config.js` to see if you
   want to configure any option differently. See the
   [Lume documentation site](https://lume.land/).
4. Run Lume with `deno task serve`.

### Implementation Notes

- `about.md` shows how to add a content page.
- `posts/` has the blog posts but really they can live in any directory. The
  `posts/_data.yml` file adds the value for `type` and `layout` fields to all
  posts.
- The `menu` field adds any page to the top level site navigation. For example,
  this is in use on `index.njk` and `about.md`. You can configure the order with
  `menu.order` and the text with `menu.title`.
- `css` files are processed with `postcss` plugin. The imported styles are in
  `_includes/css`
- `img` folder is copied as is, (keeping the same directory structure).
- The blog post feed template is in `feed.xml.njk` and `feed.tmpl.js`.
- This example uses four layouts stored in `_includes/layouts/`:
  - `base.njk`: the top level HTML structure
  - `home.njk`: the home page template (wrapped into `base.njk`)
  - `post.njk`: the blog post template (wrapped into `base.njk`)
  - `tag.njk`: the tag page template (wrapped into `base.njk`)
- `_includes/templates/postlist.njk` is a Nunjucks a reusable template used to
  display a list of all the posts. `index.njk` has an example of how to use it.
- `admin/` has the [NetlifyCMS](https://www.netlifycms.org/) configuration so
  you can edit or create new posts using a friendly CMS.

## Deployment

### GitHub Pages

- [Get your own Lume blog on Github Pages](https://github.com/lumeland/base-blog/generate)
- Open the file `.github/workflows/build.yml` and edit the `--location` option
  with the url of the site, for example
  `--location=https://username.github.io/repo/`
- Enable Github Pages and select the branch `gh-pages` as source.
- [See a live demo](https://lumeland.github.io/base-blog/)

### GitLab Pages

- Open the file `.github/workflows/build.yml` and edit the `--location` option
  with the url of the site, for example
  `--location=https://username.gitlab.io/repo/`
- [See a live demo](https://oscarotero.gitlab.io/base-blog/)

### Deno Deploy

- [Create a project in Deno Deploy](https://deno.com/deploy) and configure it.
  - Link to your git repository
  - Set the GitHub Actions deployment mode.
- Open the file `.github/workflows/deno_deploy.yml` and edit the following:
  - The `--location` option with the url of the site, for example:
    `--location=https://my-blog.deno.dev`
  - The project name in the `denoland/deployctl` step with the name of your
    project.
- [See a live demo](https://lume-blog.deno.dev)

### Vercel

- [Get your own Lume blog on Vercel](https://vercel.com/new/git/external?repository-url=https://github.com/lumeland/base-blog)
- You need to config your the project manually with the following values:
  - **Build Command:**
    `curl -fsSL https://deno.land/x/install/install.sh | sh && /vercel/.deno/bin/deno task build --location=https://example.vercel.app/`.
    Edit the `--location` option with the name of your domain.
  - **Output directory:** `_site`
- [See a live demo](https://lume-blog.vercel.app/)

### Netlify

- [Get your own Lume blog on Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/lumeland/base-blog)
- Open the `netlify.toml` file and edit the
  `--location=https://deno-blog.netlify.app/` option with your own domain.
- [See a live demo](https://lume-blog.netlify.app/)
- If you want to use NetlifyCMS:
  - Activate the Identity service in your Netlify settings panel.
  - Activate the Git Gateway.
  - Invite the users to edit the content.

### Fleek

- [Import your project](https://app.fleek.co/#/start/connect-repository)
- Open the `.fleek.json` file and edit the
  `--location=https://example.on.fleek.co` option with your own domain.
- [See a live demo](https://lume-blog.on.fleek.co/)

### Cloudflare Pages

- Configure the project with the following values:
  - **Build Command:**
    `curl -fsSL https://deno.land/x/install/install.sh | sh && /opt/buildhome/.deno/bin/deno task build --location=https://example.pages.dev/`.
    Edit the `--location` option with the name of your domain.
  - **Output directory:** `_site`
- [See a live demo](https://base-blog.pages.dev/)

### AWS Amplify

- Configure the `amplify.yml` file with the following values:
  ```yml
  version: 1
  frontend:
    phases:
      build:
        commands:
          - curl -fsSL https://deno.land/x/install/install.sh | sh
          - /root/.deno/bin/deno task build
    artifacts:
      baseDirectory: /_site
      files:
        - '**/*'
    cache:
      paths: []
  ```
- [See a live demo](https://master.docjzml5t5if1.amplifyapp.com/)

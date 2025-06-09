const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const Blog = require("./Models/blogs");

async function generateSitemap(hostname) {
  const stream = new SitemapStream({ hostname });

  const currentDate = new Date().toISOString();

  // Static routes
  stream.write({ url: "/", changefreq: "daily", lastmod: currentDate });
  stream.write({ url: "/request", changefreq: "monthly", lastmod: currentDate });
  stream.write({ url: "/privacypolicy", changefreq: "yearly", lastmod: currentDate });
  stream.write({ url: "/login", changefreq: "daily", lastmod: currentDate });

  // Fetch total number of blogs to determine the number of pages
  const limit = 8; // Number of blogs per page
  const totalBlogs = await Blog.countDocuments({});
  const totalPages = Math.ceil(totalBlogs / limit);

  // Add paginated routes
  for (let page = 2; page <= totalPages; page++) {
    stream.write({
      url: `/?page=${page}`,
      changefreq: "weekly",
      lastmod: currentDate,
    });
  }

  const blogs = await Blog.find({}, "urlSlug updatedAt").lean();
  for (const blog of blogs) {
    stream.write({
      url: `/book-summary/${blog.urlSlug}`,
      changefreq: "weekly",
      lastmod: blog.updatedAt.toISOString(),
    });
  }

  stream.end();
  return streamToPromise(Readable.from(stream)).then((data) => data.toString());
}

module.exports = generateSitemap;
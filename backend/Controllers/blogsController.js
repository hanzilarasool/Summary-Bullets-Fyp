const Blog = require("../Models/blogs");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const slugify = require("slugify");

exports.getAllBlogs = catchAsyncErrors(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || "";
    const genres = req.query.genres ? req.query.genres.split(",") : [];
    const category = req.query.category || "";
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { bookName: { $regex: search, $options: "i" } },
      ];
    }

    if (genres.length > 0) {
      query.genres = { $in: genres };
    }

    if (category) {
      query.categories = category;
    }

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find(query)
      .select(
        "title author bookName coverImage isDraft introduction readingTime genres categories"
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.status(200).json({
      blogs,
      currentPage: page,
      totalPages,
      totalBlogs,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
});
exports.createBlog = catchAsyncErrors(async (req, res) => {
  try {
    // Generate a slug for the book name
    const createUrlSlug = slugify(req.body.bookName, {
      lower: true,
      strict: true,
    });

    // Check for existing blog with the same book name or URL slug
    const existingBlog = await Blog.findOne({
      $or: [{ bookName: req.body.bookName }, { urlSlug: createUrlSlug }],
    });

    if (existingBlog) {
      return res.status(400).json({
        message: "A blog with this book name or URL slug already exists",
      });
    }

    // Add the generated slug to the blog data
    const blogData = {
      ...req.body,
      urlSlug: createUrlSlug,
    };

    // Save the blog to the database
    const newBlog = new Blog(blogData);
    const savedBlog = await newBlog.save();

    // Respond with the saved blog
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({
      message:
        "An error occurred while creating the blog. Please check your input.",
      error: error.message,
    });
  }
});

// Get a single blog by ID
exports.getBlog = catchAsyncErrors(async (req, res) => {
  try {
    const blog = await Blog.findOne({ urlSlug: req.params.urlSlug });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blog", error: error.message });
  }
});
exports.updateBlog = catchAsyncErrors(async (req, res) => {
  try {
    const currentBlog = await Blog.findOne({ urlSlug: req.params.urlSlug });

    if (!currentBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Generate URL slug if bookName is being changed
    let newUrlSlug = currentBlog.urlSlug;
    if (req.body.bookName && req.body.bookName !== currentBlog.bookName) {
      newUrlSlug = slugify(req.body.bookName, {
        lower: true,
        strict: true,
      });

      // Check if the new URL slug already exists
      const existingBlog = await Blog.findOne({
        urlSlug: newUrlSlug,
        _id: { $ne: currentBlog._id }, // Exclude current blog from check
      });

      if (existingBlog) {
        return res
          .status(400)
          .json({ message: "A blog with this book name already exists" });
      }

      // Update the URL slug in the request body
      req.body.urlSlug = newUrlSlug;
    }

    // Merge the updated fields
    Object.assign(currentBlog, req.body);

    const updatedBlog = await currentBlog.save();

    res.status(200).json(updatedBlog);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating blog", error: error.message });
  }
});

exports.deleteBlog = catchAsyncErrors(async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Blog.findByIdAndDelete(id);

    if (!result) {
      console.log(`Blog with id ${id} not found`);
      return res.status(404).json({ message: "Blog not found" });
    }

    console.log(`Successfully deleted blog with id: ${id}`);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error in blog deletion:", error);
    res.status(500).json({
      message: "An error occurred while deleting the blog",
      error: error.message,
    });
  }
});

exports.getByCategory = catchAsyncErrors(async (req, res) => {
  try {
    const { category } = req.params;
    const { exclude } = req.query; // URL of the current book to exclude

    const relatedBooks = await Blog.find({
      categories: category,
      urlSlug: { $ne: exclude }, // Exclude the current book
    })
      .select(
        "title author bookName coverImage urlSlug introduction readingTime"
      )
      .limit(9)
      .lean();

    res.status(200).json(relatedBooks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching related books", error: error.message });
  }
});

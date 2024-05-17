const Blog = require("../models/blog");
const { calculateReadingTime } = require("../middleware/readTime");
const createBlog = async (req, res) => {
  const userId = req.user.id;
  const { title, description, tags, body } = req.body;
  try {
    const existingTitle = await Blog.findOne({ title });
    if (existingTitle) {
      return res
        .status(400)
        .json({ error: "Title is not available: Try another one!" });
    }
    const reading_time = calculateReadingTime(body);
    const newBlog = new Blog({
      author: userId,
      title,
      description,
      tags,
      body,
      reading_time,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", data: newBlog });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

const allPublishedBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({ state: "published" });
    if (blogs.length === 0) {
      return res.status(200).json({ error: "No blog" });
    }

    res.status(201).json({ message: "Blog created successfully", data: blogs });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

const aPublishedBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blogs = await Blog.findById({
      _id: blogId,
    }).populate("author", "first_name last_name");
    if (blogs.length === 0) {
      return res.status(200).json({ error: "No blog" });
    }
    blogs.read_count++;
    blogs.save();
    res.status(201).json({ message: "Blog created successfully", data: blogs });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    let { page, limit, author, title, tags, sortBy, sortDirection } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;

    let query = { state: "published" };

    if (author) {
      const authors = await User.find({
        $or: [
          { first_name: { $regex: author, $options: "i" } },
          { last_name: { $regex: author, $options: "i" } },
        ],
      });

      const authorIds = authors.map((author) => author._id);

      query.author = { $in: authorIds };
    }

    if (title) query.title = { $regex: title, $options: "i" };
    if (tags) query.tags = { $in: tags.split(",") };

    const sortOptions = {};
    if (
      sortBy &&
      ["read_count", "reading_time", "createdAt", "updatedAt"].includes(sortBy)
    ) {
      sortOptions[sortBy] = sortDirection === "desc" ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; // Default sorting by createdAt in descending order
    }

    const blogs = await Blog.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("author", "first_name last_name");

    if (blogs.length === 0) {
      return res
        .status(200)
        .json({ message: "No blog posts yet!", data: blogs });
    }

    res.status(200).json({ message: "Blogs List", data: blogs });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

const updateBlog = async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.id;
  const { title, description, tags, body } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this blog" });
    }

    if (title) {
      const existingTitle = await Blog.findOne({ title, _id: { $ne: blogId } });
      if (existingTitle) {
        return res
          .status(400)
          .json({ error: "Title is not available: Try another one!" });
      }
      blog.title = title;
    }

    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully", data: blog });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

const updateBlogState = async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.id;
  const { state } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this blog" });
    }

    if (state && ["draft", "published"].includes(state)) {
      blog.state = state;
    } else {
      return res.status(400).json({ error: "Invalid state value" });
    }

    await blog.save();
    res
      .status(200)
      .json({ message: "Blog state updated successfully", data: blog });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

const deleteBlog = async (req, res) => {
  const userId = req.user.id;
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this blog" });
    }

    await blog.remove();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
const getUserBlogs = async (req, res) => {
  const userId = req.user.id;

  const { page = 1, limit = 10, state } = req.query;
  try {
    let filter = { author: userId };
    if (state) {
      filter.state = state;
    }

    const paginationOptions = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };
    const blogs = await Blog.find(filter, null, paginationOptions);

    const totalBlogs = await Blog.find(filter).count();
    res.status(200).json({
      message: "All available blogs",
      data: blogs,
      totalPages: Math.ceil(totalBlogs / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

module.exports = {
  createBlog,
  allPublishedBlog,
  aPublishedBlog,
  getAllBlogs,
  updateBlog,
  updateBlogState,
  deleteBlog,
  getUserBlogs,
};

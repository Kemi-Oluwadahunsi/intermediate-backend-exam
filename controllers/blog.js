const Blog = require("../models/blog");
const { calculateReadingTime } = require("../middleware/readTime");
const logger = require("../middleware/logger");
const createBlog = async (req, res) => {
  const userId = req.user.id;
  const { title, description, tags, body } = req.body;
  try {
    const existingTitle = await Blog.findOne({ title });
    if (existingTitle) {
      logger.error(`Blog creation failed: Title '${title}' already exists.`);
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
    logger.info(`Blog created successfully by user ${userId}`);
    res
      .status(201)
      .json({ message: "Blog created successfully", data: newBlog });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

const allPublishedBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({ state: "published" });
    if (blogs.length === 0) {
      logger.warn("No published blogs found.");
      return res.status(200).json({ error: "No blog" });
    }

    logger.info("Fetched all published blogs.");
    res.status(201).json({ message: "Blog created successfully", data: blogs });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
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
      logger.warn("Blog not found.");
      return res.status(200).json({ error: "Not found" });
    }
    blogs.read_count++;
    blogs.save();

    logger.info("Fetched a published blog.");
    res.status(200).json({ message: "Fetched blog successfully", data: blogs });
  } catch (error) {
    logger.error(`Internal server error: ${error.message}`);
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    let { page, limit, author, title, tags, sortBy, sortDirection, state } =
      req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    const skip = (page - 1) * limit;
    let query = {};

    if (state) {
      query.state = state;
    } else {
      query.state = { $in: ["published", "draft"] };
    }

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
      sortOptions.createdAt = -1;
    }

    const blogs = await Blog.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate("author", "first_name last_name");

    if (blogs.length === 0) {
      logger.error(`No blog posts found for query: ${JSON.stringify(query)}`);
      return res
        .status(200)
        .json({ message: "No blog posts yet!", data: blogs });
    }

    logger.info(`Blog posts found for query: ${JSON.stringify(query)}`);
    res.status(200).json({ message: "Blogs List", data: blogs });
  } catch (error) {
    logger.error(`Error retrieving blog posts: ${error.message}`);
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
      logger.error(`Blog with id ${blogId} not found`);
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      logger.error(`User ${userId} is not authorized to update blog ${blogId}`);
      return res
        .status(403)
        .json({ error: "You are not authorized to update this blog" });
    }

    if (title) {
      const existingTitle = await Blog.findOne({ title, _id: { $ne: blogId } });
      if (existingTitle) {
        logger.error(`Blog title "${title}" already exist, try another one!`);
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
    logger.info(`Blog with id ${blogId} updated successfully`);
    res.status(200).json({ message: "Blog updated successfully", data: blog });
  } catch (error) {
    logger.error(`Failed to update blog with id ${blogId}`, error.message);
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
      logger.error(`Blog with id ${blogId} not found`);
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      logger.error(`User with id ${userId} is not authorized to update this blog's state`);
      return res
        .status(403)
        .json({ error: "You are not authorized to update this blog" });
    }

    if (state && ["draft", "published"].includes(state)) {
      blog.state = state;
    } else {
      logger.error(`Invalid state value: ${state}`);
      return res.status(400).json({ error: "Invalid state value" });
    }

    await blog.save();
    logger.info(`Blog with id ${blogId} state updated to "${state}"`);
    res
      .status(200)
      .json({ message: "Blog state updated successfully", data: blog });
  } catch (error) {
    logger.error(`Failed to update blog with id ${blogId}: ${error.message}`);
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
      logger.error(`Blog with id ${blogId} not found`);
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== userId) {
      logger.error(`User with id ${userId} is not authorized to delete this blog`);
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this blog" });
    }

    await blog.remove();
    logger.info(`Blog with id ${blogId} deleted successfully`);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    logger.error(`Failed to delete blog with id ${blogId}: ${error.message}`);
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
logger.info(`Retrieved ${blogs.length} blogs for user with id ${userId}`);
    res.status(200).json({
      message: "All available blogs",
      data: blogs,
      totalPages: Math.ceil(totalBlogs / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    logger.error(`Failed to retrieve blogs for user with id ${userId}: ${error.message}`);
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

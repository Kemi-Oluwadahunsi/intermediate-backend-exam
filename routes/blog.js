const { Router } = require("express");
const logger = require("../middleware/logger");
const router = Router();
const { requireSignIn } = require("../middleware/auth");
const {
  createBlog,
  allPublishedBlog,
  aPublishedBlog,
  getAllBlogs,
  updateBlog,
  updateBlogState,
  deleteBlog,
  getUserBlogs,
} = require("../controllers/blog");

router.route("/create").post(requireSignIn, (req, res, next) => {
  logger.info("Request to create a new blog received.");
  next();
}, createBlog);

router.route("/getAll").get(requireSignIn, (req, res, next) => {
  logger.info("Request to get all blogs received.");
  next();
}, getAllBlogs);

router.route("/all").get((reg, res, next) => {
  logger.info("Request to get all published blogs received.");
  next();
}, allPublishedBlog);

router.route("/:id").get((req, res, next) => {
  logger.info(`Request to get published blog with ID ${req.params.id} received.`);
  next();
}, aPublishedBlog);

router.route("/:id").put(requireSignIn, (reg, res, next) => {
  logger.info(`Request to update blog with ID ${req.params.id} received.`);
  next();
}, updateBlog);

router.route("/:id/state").patch(requireSignIn, (req, res, next) => {
  logger.info(`Request to update state of blog with ID ${req.params.id} received.`);
  next();
}, updateBlogState);

router.route("/:id").delete(requireSignIn, (req, res, next) => {
  logger.info(`Request to delete blog with ID ${req.params.id} received.`);
  next();
}, deleteBlog);

router.route("/owner").get(requireSignIn, (req, res, next) => {
  logger.info("Request to get user's blogs received.");
  next();
}, getUserBlogs);

module.exports = router;

const { Router } = require("express");

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

router.route("/create").post(requireSignIn, createBlog);
router.route("/getAll").get(requireSignIn, getAllBlogs);
router.route("/all").get(allPublishedBlog);
router.route("/:id").get(aPublishedBlog);
router.route("/:id").put(requireSignIn,  updateBlog);
router.route("/:id/state").patch(requireSignIn, updateBlogState);
router.route("/:id").delete(requireSignIn, deleteBlog);
router.route("/owner").get(requireSignIn, getUserBlogs);

module.exports = router;

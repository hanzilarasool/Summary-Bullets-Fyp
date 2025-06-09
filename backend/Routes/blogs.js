const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyUser");
const {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getByCategory
} = require("../Controllers/blogsController");

router.route("/newblog").post(verifyToken.verifyToken, createBlog);

router.route("/getblog/:urlSlug").get(getBlog);

router.route("/getallblogs").get(getAllBlogs);

router.route("/related-books/:category").get(getByCategory);

router.route("/updateblog/:urlSlug").put(verifyToken.verifyToken, updateBlog);

router.route("/deleteblog/:id").delete(verifyToken.verifyToken, deleteBlog);
module.exports = router;

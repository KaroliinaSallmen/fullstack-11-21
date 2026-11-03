const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!user) {
    return response.status(401).json({ error: "token invalid" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  if (blog.url === undefined) {
    return response.status(400).json({ error: "url is missing" });
  }

  if (blog.title === undefined) {
    return response.status(400).json({ error: "title is missing" });
  }

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await savedBlog.populate("user", {
    username: 1,
    name: 1,
  });

  response.status(201).json(populatedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(204).end();
  }

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: "user not authorized" });
  }

  user.blogs = user.blogs.filter((b) => b.id.toString() !== blog.id.toString());

  await blog.deleteOne();
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { returnDocument: "after" },
  ).populate("user", {
    username: 1,
    name: 1,
  });

  response.json(updatedBlog);
});

module.exports = blogsRouter;

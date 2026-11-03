const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash("salainen", 10);

  const user = new User({
    username: "käyttäjä",
    name: "Pääkäyttäjä",
    passwordHash,
  });

  const savedUser = await user.save();

  let blogObject = new Blog({ ...helper.initialBlogs[0], user: savedUser._id });
  await blogObject.save();
  blogObject = new Blog({ ...helper.initialBlogs[1], user: savedUser._id });
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("blogs' id field is called id instead of _id", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    assert.strictEqual(blog.id !== undefined, true);
    assert.strictEqual(blog._id, undefined);
  });
});

test("a new blog can be added ", async () => {
  const newBlog = {
    title: "Lisätty blogi",
    author: "Matti Meikäläinen",
    url: "https://www.uusi.fi",
    likes: 1,
  };

  const login = await api
    .post("/api/login")
    .send({
      username: "käyttäjä",
      password: "salainen",
    })
    .expect(200);

  const token = login.body.token;

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  const contents = blogsAtEnd.map((b) => b.title);

  assert(contents.includes("Lisätty blogi"));
});

test("if likes isn't given a value, the value is set to 0", async () => {
  const newBlog = {
    title: "Blogi ilman tykkäyksiä",
    author: "Matti Meikäläinen",
    url: "https://www.eitykkäyksiä.fi",
  };

  const login = await api
    .post("/api/login")
    .send({
      username: "käyttäjä",
      password: "salainen",
    })
    .expect(200);

  const token = login.body.token;

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  const response = await api.get("/api/blogs");
  const savedBlog = response.body.find(
    (b) => b.title === "Blogi ilman tykkäyksiä",
  );
  assert.strictEqual(savedBlog.likes, 0);
});

test("if a new blog doesn't have a url, the response will be 400 bad request", async () => {
  const newBlog = {
    title: "Blogi ilman urlia",
    author: "Matti Meikäläinen",
    likes: 3,
  };

  const login = await api
    .post("/api/login")
    .send({
      username: "käyttäjä",
      password: "salainen",
    })
    .expect(200);

  const token = login.body.token;

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("if a new blog doesn't have a title, the response will be 400 bad request", async () => {
  const newBlog = {
    author: "Matti Meikäläinen",
    url: "https://www.eiotsikkoa.fi",
    likes: 3,
  };

  const login = await api
    .post("/api/login")
    .send({
      username: "käyttäjä",
      password: "salainen",
    })
    .expect(200);

  const token = login.body.token;

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  const login = await api
    .post("/api/login")
    .send({
      username: "käyttäjä",
      password: "salainen",
    })
    .expect(200);

  const token = login.body.token;

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  const ids = blogsAtEnd.map((b) => b.id);
  assert(!ids.includes(blogToDelete.id));

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
});

test("a blog's likes can be updated", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
    .expect(200);

  const blogsAtEnd = await helper.blogsInDb();
  const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
});

test("if a new user doesn't have a username, the response will be 400 bad request", async () => {
  const newUser = {
    username: "",
    name: "Matti Meikäläinen",
    password: "salasana",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("if a new user doesn't have a password, the response will be 400 bad request", async () => {
  const newUser = {
    username: "Matti",
    name: "Matti Meikäläinen",
    password: "",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("if a new user's username is less than 3 characters, the response will be 400 bad request", async () => {
  const newUser = {
    username: "Ma",
    name: "Matti Meikäläinen",
    password: "salasana",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

//testi

test("if a new user's password is less than 3 characters, the response will be 400 bad request", async () => {
  const newUser = {
    username: "Matti",
    name: "Matti Meikäläinen",
    password: "sa",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("a new user won't be added if the username is not unique", async () => {
  const newUser = {
    username: "käyttäjä",
    name: "Pääkäyttäjä",
    password: "salainen",
  };

  await api.post("/api/users").send(newUser).expect(400);
});

test("a new blog won't be added and the response is 401 unauthorized if the request doesn't include a token", async () => {
  const newBlog = {
    title: "Lisätty blogi",
    author: "Matti Meikäläinen",
    url: "https://www.uusi.fi",
    likes: 1,
  };

  const login = await api
    .post("/api/login")
    .send({
      username: "käyttäjä",
      password: "salainen",
    })
    .expect(200);

  const token = login.body.token;

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
});

after(async () => {
  await mongoose.connection.close();
});

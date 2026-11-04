import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Blogs from "./components/Blogs";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Message from "./components/Message";
import Login from "./components/Login";
import BlogDetails from "./components/BlogDetails";
import NewBlogForm from "./components/NewBlogForm";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const theme = createTheme({
    typography: {
      fontFamily: "Arial, sans-serif",
    },
  });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event, username, password) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      navigate("/");
    } catch {
      setError("Wrong username or password");
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
    console.log("logging in with", username, password);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    navigate("/");
  };

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(returnedBlog));

    setMessage(`A new blog ${blogObject.title} by ${blogObject.author} added`);
    setTimeout(() => {
      setMessage(null);
    }, 5000);

    navigate("/");
  };

  const likeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    const returnedBlog = await blogService.update(id, updatedBlog);

    setBlogs(blogs.map((b) => (b.id === id ? returnedBlog : b)));
  };

  const removeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);

    const confirmRemoval = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    );

    if (!confirmRemoval) {
      return;
    }
    await blogService.remove(id);

    setBlogs(blogs.filter((b) => b.id !== id));

    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <NavigationBar user={user} handleLogout={handleLogout} />
        <Message message={message} />
        <Routes>
          <Route
            path="/"
            element={
              <Blogs
                blogs={blogs}
                likeBlog={likeBlog}
                removeBlog={removeBlog}
                user={user}
                addBlog={addBlog}
              />
            }
          />

          <Route
            path="/login"
            element={<Login handleLogin={handleLogin} error={error} />}
          />
          <Route
            path="/blogs/:id"
            element={
              <BlogDetails
                blogs={blogs}
                likeBlog={likeBlog}
                removeBlog={removeBlog}
                user={user}
              />
            }
          />
          <Route
            path="/create"
            element={<NewBlogForm createBlog={addBlog} />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;

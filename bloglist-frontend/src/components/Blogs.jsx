import { Link } from "react-router-dom";
import { Stack } from "@mui/material";

const Blogs = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  return (
    <Stack sx={{ p: 3 }}>
      <div>
        <h2>Blogs</h2>

        {sortedBlogs.map((blog) => (
          <ul key={blog.id}>
            <li>
              <Link to={`/blogs/${blog.id}`}>
                {" "}
                {blog.title} by {blog.author}
              </Link>
            </li>
          </ul>
        ))}
      </div>
    </Stack>
  );
};

export default Blogs;

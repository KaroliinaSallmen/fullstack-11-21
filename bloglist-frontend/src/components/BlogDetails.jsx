import { useParams } from "react-router-dom";
import { Button, Box, Stack, Typography } from "@mui/material";

const BlogDetails = ({ blogs, likeBlog, removeBlog, user }) => {
  const id = useParams().id;

  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <Stack sx={{ p: 3 }}>
      <Box
        component="section"
        sx={{
          p: 2,
          mt: 4,
          border: "1px solid lightgrey",
          boxShadow: 2,
          width: 900,
        }}
      >
        <Typography sx={{ fontWeight: "bold", fontSize: 25 }}>
          {blog.title}
        </Typography>
        <Typography sx={{ fontStyle: "italic" }}>by {blog.author}</Typography>
        <p>
          <a href={blog.url}>{blog.url}</a>
        </p>
        <p>Added by {blog.user.name}</p>
        {blog.likes} likes{" "}
        {user ? (
          <Button
            sx={{ mr: 2 }}
            variant="outlined"
            onClick={() => likeBlog(blog.id)}
          >
            like
          </Button>
        ) : null}
        {user && blog.user.id === user.id && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => removeBlog(blog.id)}
          >
            remove
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default BlogDetails;

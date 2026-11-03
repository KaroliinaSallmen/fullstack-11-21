import { useState } from "react";
import { TextField, Button, Container } from "@mui/material";

const NewBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };
  return (
    <div>
      <Container maxWidth="sm">
        <h1>Create new</h1>
        <form onSubmit={addBlog}>
          <div>
            <TextField
              label="Title"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              sx={{ mb: 2 }}
              fullWidth={true}
            />
          </div>
          <div>
            <TextField
              label="Author"
              value={newAuthor}
              onChange={(event) => setNewAuthor(event.target.value)}
              sx={{ mb: 2 }}
              fullWidth={true}
            />
          </div>
          <div>
            <TextField
              label="Url"
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
              sx={{ mb: 2 }}
              fullWidth={true}
            />
          </div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            create
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default NewBlogForm;

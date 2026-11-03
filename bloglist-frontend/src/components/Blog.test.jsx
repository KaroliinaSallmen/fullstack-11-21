import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlogForm from "./NewBlogForm";
import BlogDetails from "./BlogDetails";

// test("renders blog title", () => {
//   const blog = {
//     title: "Testi blogi",
//     author: "Testi Testaaja",
//     url: "https://www.testi.fi",
//     likes: 3,
//     user: {
//       name: "Pääkäyttäjä",
//       id: "6a9184cc50a8f1c9b016f0fd",
//     },
//   };

//   render(<Blog blog={blog} />);

//   const element = screen.findByText("Testi blogi");
// });

// test("clicking the view button shows url, likes and user", async () => {
//   const blog = {
//     title: "Testi blogi",
//     author: "Testi Testaaja",
//     url: "https://www.testi.fi",
//     likes: 3,
//     user: {
//       name: "Matti Meikäläinen",
//       id: "6a8da71a8e7415385f2706ce",
//     },
//   };

//   const user = {
//     name: "Matti Meikäläinen",
//     id: "6a8da71a8e7415385f2706ce",
//   };

//   render(<Blog blog={blog} user={user} />);

//   const eventUser = userEvent.setup();
//   const button = screen.getByText("view");
//   await eventUser.click(button);

//   expect(screen.getByText("https://www.testi.fi")).toBeInTheDocument();
//   expect(screen.getByText("likes 3")).toBeInTheDocument();
//   expect(screen.getByText("Matti Meikäläinen")).toBeInTheDocument();
// });

// test("clicking the like button twice calls the event handler function twice", async () => {
//   const blog = {
//     title: "Testi blogi",
//     author: "Testi Testaaja",
//     url: "https://www.testi.fi",
//     likes: 3,
//     user: {
//       name: "Matti Meikäläinen",
//       id: "6a8da71a8e7415385f2706ce",
//     },
//   };

//   const user = {
//     name: "Matti Meikäläinen",
//     id: "6a8da71a8e7415385f2706ce",
//   };

//   const mockHandler = vi.fn();

//   render(<Blog blog={blog} user={user} likeBlog={mockHandler} />);

//   const eventUser = userEvent.setup();

//   const viewButton = screen.getByText("view");
//   await eventUser.click(viewButton);

//   const likeButton = screen.getByText("like");
//   await eventUser.click(likeButton);
//   await eventUser.click(likeButton);

//   expect(mockHandler).toHaveBeenCalledTimes(2);
// });

test("<NewBlogForm /> calls the callback function with the right data when a blog is created", async () => {
  const eventUser = userEvent.setup();
  const createBlog = vi.fn();

  render(<NewBlogForm createBlog={createBlog} />);

  const titleInput = screen.getByLabelText("Title:");
  const authorInput = screen.getByLabelText("Author:");
  const urlInput = screen.getByLabelText("Url:");

  await eventUser.type(titleInput, "Testi blogi");
  await eventUser.type(authorInput, "Testi Testaaja");
  await eventUser.type(urlInput, "https://www.testi.fi");

  const createButton = screen.getByText("create");

  await eventUser.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog).toHaveBeenCalledWith({
    title: "Testi blogi",
    author: "Testi Testaaja",
    url: "https://www.testi.fi",
  });
});

test("blog information and the number of likes are shown to a user who is not logged in, the buttons are not", async () => {
  const blog = {
    title: "Testi blogi",
    author: "Testi Testaaja",
    url: "https://www.testi.fi",
    likes: 3,
    user: {
      id: "6a8da71a8e7415385f2706ce",
      name: "Matti Meikäläinen",
    },
  };

  render(<BlogDetails blogs={[blog]} />);

  expect(screen.getByText("Testi Testaaja: Testi blogi")).toBeInTheDocument();
  expect(screen.getByText("https://www.testi.fi")).toBeInTheDocument();
  expect(screen.getByText("likes 3")).toBeInTheDocument();

  expect(screen.queryByRole("button", { name: "like" })).toBeNull();
  expect(screen.queryByRole("button", { name: "remove" })).toBeNull();
});

test("only the like button is shown to a user who is logged in but not the creator", async () => {
  const blog = {
    title: "Testi blogi",
    author: "Testi Testaaja",
    url: "https://www.testi.fi",
    likes: 3,
    user: {
      name: "Matti Meikäläinen",
      id: "6a8da71a8e7415385f2706ce",
    },
  };

  const user = {
    name: "Maija Meikäläinen",
    id: "6a905230a15628668afa4b9e",
  };

  render(<BlogDetails blogs={[blog]} user={user} />);

  expect(screen.queryByRole("button", { name: "remove" })).toBeNull();
  expect(screen.queryByRole("button", { name: "like" })).toBeInTheDocument();
});

test("a remove button is shown to the creator of a blog", async () => {
  const blog = {
    title: "Testi blogi",
    author: "Testi Testaaja",
    url: "https://www.testi.fi",
    likes: 3,
    user: {
      name: "Matti Meikäläinen",
      id: "6a8da71a8e7415385f2706ce",
    },
  };

  const user = {
    name: "Matti Meikäläinen",
    id: "6a8da71a8e7415385f2706ce",
  };

  render(<BlogDetails blogs={[blog]} user={user} />);

  expect(screen.queryByRole("button", { name: "remove" })).toBeInTheDocument();
});

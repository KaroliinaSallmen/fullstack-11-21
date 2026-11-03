const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likes = 0;
  blogs.forEach((blog) => {
    likes += blog.likes;
  });
  return likes;
};

const favoriteBlog = (blogs) => {
  const favorite = Math.max(...blogs.map((blog) => blog.likes));

  return favorite;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

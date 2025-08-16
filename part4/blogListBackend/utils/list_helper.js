const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce(( sum, blog ) => sum+blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const fav = blogs.reduce(( fav, blog) => blog.likes > fav.likes ? blog : fav)
  return fav.likes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
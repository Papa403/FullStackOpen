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

const mostBlogs = (blogs) => {
  const blogCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  },{})

  const author = Object.keys(blogCount).reduce(( most, author) => blogCount[author] > blogCount[most] ? author : most)
  return { author, blogs: blogCount[author]}
}

const mostLikes = (blogs) => {
  const likeCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  },{})

  const author = Object.keys(likeCount).reduce((most, author)=> likeCount[author] > likeCount[most] ? author : most)
  return { author, likes: likeCount[author]}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
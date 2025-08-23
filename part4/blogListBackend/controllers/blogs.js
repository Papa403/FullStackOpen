const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, url } = request.body

  if (!title || !url) {
    return response.status(400).end()
  }
  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'no user found' })
  }

  const blog = new Blog({
    ...request.body,
    user: user._id
  })
  const result = await blog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  if(blog.user.toString() !== user._id.toString() ) {
    return response.status(401).json({ error: 'not authorized to delete' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const likes = request.body.likes

    if (typeof likes !== 'number' || likes < 0) {
      return response.status(400).json({ error: 'Likes must be a non-negative number' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }
    blog.likes = likes
    const updatedBlog = await blog.save()
    return response.json(updatedBlog)
  } catch (error) {
    return response.status(400).json({ error: 'Failed to update blog' })
  }
})

module.exports = blogsRouter
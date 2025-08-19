const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  const Blog = require('../models/blog')
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('correct amount of blog posts returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert(blog.id)
})

test('successfully created a new blog', async () => {
  const newNote = {
    title:'test note added',
    author:'me in the code',
    url:'http://localhost.com',
    likes:'42'
  }
  await api
    .post('/api/blogs')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(blogsAtEnd.some(blog =>
    blog.title === newNote.title &&
    blog.author === newNote.author &&
    blog.url === newNote.url &&
    blog.likes == newNote.likes
  ))
})

test('blog with no likes has 0 added automatically', async () => {
  const newNote = {
    title:'test note added with no likes',
    author:'me in the code',
    url:'http://localhost.com',
  }
  const response = await api
    .post('/api/blogs')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(response.body.likes, 0)
})

test('missing author or url', async () => {
  const newNote = {
    author: 'me',
    likes: '23',
  }
  await api
    .post('/api/blogs')
    .send(newNote)
    .expect(400)
})

test('deleting a resource', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  assert(!blogsAtEnd.some(blog => blog.id === blogToDelete.id))
})

test('updating likes of a resource', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const updatedLikes = 42

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: updatedLikes})
    .expect(200)

  assert.strictEqual(response.body.likes, updatedLikes)  

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, updatedLikes)
})


after(async () => {
  await mongoose.connection.close()
})
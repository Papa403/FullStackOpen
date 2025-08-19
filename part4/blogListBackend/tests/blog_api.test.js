const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

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

after(async () => {
  await mongoose.connection.close()
})
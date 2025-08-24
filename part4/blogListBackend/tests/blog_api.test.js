const bcrypt = require('bcrypt')
const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

const default_username = 'root'
const default_name = 'user1'
const default_password = 'sekret'

const createTestUser = async (username = default_username, name = default_name, password = default_password) => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ username, name, passwordHash })
  await user.save()
  return user
}

const getTokenForUser = async (username = default_username, password = default_password) => {
  const response = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  return response.body.token
}

beforeEach(async () => {
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
  await createTestUser()
  const token = await getTokenForUser()
  const newBlog = {
    title:'test note added',
    author:'me in the code',
    url:'http://localhost.com',
    likes: 42
  }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  assert(blogsAtEnd.some(blog =>
    blog.title === newBlog.title &&
    blog.author === newBlog.author &&
    blog.url === newBlog.url &&
    blog.likes == newBlog.likes
  ))
})

test('blog with no likes has 0 added automatically', async () => {
  await createTestUser()
  const token = await getTokenForUser()
  const newBlog = {
    title:'test note added with no likes',
    author:'me in the code',
    url:'http://localhost.com',
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(response.body.likes, 0)
})

test('missing author or url', async () => {
  const newBlog = {
    author: 'me',
    likes: '23',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
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

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'papa403',
      name: 'Papa 403',
      password: 'bloglistTestPW',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)  
  })
})

describe('username and password validation', () => {
  test('username must be at least 3 characters long', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpassword'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(response.body.error.includes('username'))
  })

  test('password must be at least 3 characters long', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: 'pw'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(response.body.error.includes('password'))
  })

  test('missing username returns 400', async () => {
    const newUser = {
      name: 'No Username',
      password: 'validpassword'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('missing password returns 400', async () => {
    const newUser = {
      username: 'validuser',
      name: 'No Password'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
  test('creation fails with proper status and message if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root', // already exists from beforeEach
      name: 'Duplicate User',
      password: 'anotherpassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('exists'))
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

test('no blog if token is not provided', async () => {
  const newBlog = {
    author: 'me',
    title: 'new blog without token',
    url: 'http://localhost:10000000000000',
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})
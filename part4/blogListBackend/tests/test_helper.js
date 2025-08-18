const Blog = require('../models/blog')

const initialBlogs = [
  {
    "title": "blog 1",
    "author": "me",
    "url": "http://example.com/1",
    "likes": 1,
    "id": "68a3b696cf8ea98a1e3639bb"
  },
  {
    "title": "blog 2",
    "author": "moi",
    "url": "http://example.com/2",
    "likes": 2,
    "id": "68a3b6a52cab95bca193573a"
  },
  {
    "title": "blog 3",
    "author": "moi aussi",
    "url": "http://example.com/3",
    "likes": 3,
    "id": "68a3b6b22cab95bca193573c"
  }
]

module.exports = {
  initialBlogs
}
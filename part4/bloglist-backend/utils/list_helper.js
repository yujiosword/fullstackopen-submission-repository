var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes= (blogs) => {
  const reducer = (sum, blog) => {
    return sum + Number(blog.likes)
  }
  return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
  const reducer = (favourite, blog) => {
    if (favourite === 0) return blog
    else return favourite.likes < blog.likes
      ? blog
      : favourite
  }
  return blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  const most = _
    .chain(blogs)
    .countBy('author')
    .map((value, key) => ({ 'author': key, 'blogs': value }))
    .maxBy('blogs')
    .value()
  // console.log('most', most)
  return most
}

const mostLikes = (blogs) => {
  // const most = _
  //   .chain(blogs)
  //   .transform((result, blog) => {
  //     result[blog.author] ??= 0
  //     result[blog.author] += blog.likes
  //   }, {})
  //   .map((value, key) => ({ 'author': key, 'likes': value }))
  //   .maxBy('likes')
  //   .value()
  const most = _
    .chain(blogs)
    .groupBy('author')
    .map((blogs, key) => ({
      'author': key,
      'likes': _.sumBy(blogs, 'likes')
      // 'likes': blogs.reduce((sum, blog) => sum + blog.likes, 0)
    }))
    .maxBy('likes')
    .value()
  // console.log('most', most)
  return most
}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes }
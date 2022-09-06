exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [ // Dummy
      {
        title: "First post",
        content: "Content of the first post"
      }
    ]
  })
};

exports.createPost = (req, res) => {
  const { title, content } = req.body;

  // Create post to DB
  // ..

  res.status(201).json({
    message: 'Post created successfully',
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content
    }
  });
};

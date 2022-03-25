const { Post } = require('database/models');
const mockUser = require('./user');

const { API_HOST } = process.env;

const mockPost = async () => {
  const payload = {
    title: 'title',
    thumbnail: `${API_HOST}/images/image_1.jpg`,
    text: 'text',
  };

  try {
    const { user } = await mockUser();
    const post = await Post.build({
      ...payload,
      userId: user.id,
    }).save();

    return { user, post, payload };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = mockPost;

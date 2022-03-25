const Joi = require('joi');

const { validateSchema } = require('lib/utils');
const { Post, User } = require('database/models');

exports.write = async (req, res, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().min(2).max(20).required(),
    text: Joi.string().max(2000).required(),
    thumbnail: Joi.string().required(),
  });

  if (!validateSchema(res, schema, req.body)) return;

  const { title, text, thumbnail } = req.body;

  const { id: userId } = req.user;

  try {
    await Post.create({
      title,
      text,
      thumbnail,
      userId,
    });
  } catch (err) {
    next(err);
    return;
  }

  res.sendStatus(201);
};

exports.list = async (req, res, next) => {
  const schema = Joi.object().keys({
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
  });

  if (!validateSchema(res, schema, req.query)) return;

  const { page, limit } = req.query;

  const offset = (page - 1) * limit;
  try {
    const { rows, count } = await Post.findAndCountAll({
      offset,
      limit,
      order: [['id', 'DESC']],
      attributes: { exclude: ['userId'] },
      include: [{ model: User, as: 'writer', attributes: ['id', 'username'] }],
    });

    const result = {
      posts: rows,
      count,
    };

    res.send(result);
  } catch (err) {
    next(err);
  }
};

exports.read = async (req, res, next) => {
  const { postId } = req.params;

  if (!Number(postId)) {
    res.status(400).send('Bad request');
    return;
  }

  let post = null;
  try {
    post = await Post.findOne({
      where: {
        id: postId,
      },
      attributes: { exclude: ['userId'] },
      include: [{ model: User, as: 'writer', attributes: ['id', 'username'] }],
    });
  } catch (err) {
    next(err);
  }

  if (!post) {
    res.status(404).send('Not found post');
    return;
  }

  res.send(post);
};

exports.update = async (req, res, next) => {
  const { postId } = req.params;

  if (!Number(postId)) {
    res.status(400).send('Bad request');
    return;
  }

  const schema = Joi.object().keys({
    title: Joi.string().min(2).max(20).required(),
    text: Joi.string().max(2000).required(),
    thumbnail: Joi.string().required(),
  });

  if (!validateSchema(res, schema, req.body)) return;

  const { title, text, thumbnail } = req.body;

  const { id: userId } = req.user;

  let post = null;

  try {
    post = await Post.findOne({
      where: { id: postId, userId },
    });
  } catch (err) {
    next(err);
    return;
  }

  if (!post) {
    res.status(404).send('Not found post');
    return;
  }

  try {
    post.title = title;
    post.text = text;
    post.thumbnail = thumbnail;

    await post.save();

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  const { postId } = req.params;

  if (!Number(postId)) {
    res.status(400).send('Bad request');
    return;
  }

  const { id: userId } = req.user;

  let post = null;

  try {
    post = await Post.findOne({
      where: { id: postId, userId },
    });
  } catch (err) {
    next(err);
    return;
  }

  if (!post) {
    res.status(404).send('Not found post');
    return;
  }

  try {
    await post.destroy();

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

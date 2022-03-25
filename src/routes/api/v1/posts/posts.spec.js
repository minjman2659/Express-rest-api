const httpMocks = require('node-mocks-http');

const { Post } = require('database/models');
const { mockPost } = require('test/mock');
const { write, list, read, update, remove } = require('./posts.ctrl');

let req = null;
let res = null;
let next = null;

Post.findAndCountAll = null;
Post.findOne = null;
Post.create = null;

beforeEach(() => {
  Post.findAndCountAll = jest.fn();
  Post.findOne = jest.fn();
  Post.create = jest.fn();

  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe('/api/v1/posts', () => {
  let mPayload = null;
  let mUser = null;
  let mPost = null;
  beforeEach(async () => {
    const { user, post, payload } = await mockPost();
    mPayload = payload;
    mUser = user;
    mPost = post;
  });
  describe('[POST] /', () => {
    beforeEach(async () => {
      req.body = mPayload;
    });
    describe('[Success]', () => {
      it('should hava a write function', () => {
        expect(typeof write).toBe('function');
      });
      it('should return 201 status code in response', async () => {
        req.user = mUser;
        await write(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBe(true);
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        req.body.title = null;
        await write(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBe(true);
      });
      it('should handle error: Post.create', async () => {
        req.user = mUser;
        const errorMessage = { message: 'throw Post.create error' };
        Post.create.mockRejectedValue(errorMessage);
        await write(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
      });
    });
  });
  describe('[GET] ?page=&limit=', () => {
    beforeEach(async () => {
      req.query = { page: 1, limit: 10 };
    });
    describe('[Success]', () => {
      it('should hava a list function', () => {
        expect(typeof list).toBe('function');
      });
      it('should return 200 ststus code in response', async () => {
        const postList = new Array(10).fill(mPost);
        Post.findAndCountAll.mockReturnValue({
          posts: postList,
          count: 10,
        });
        await list(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBe(true);
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        req.query = {};
        await list(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBe(true);
      });
      it('should handle error: Post.findAndCountAll', async () => {
        const errorMessage = { message: 'throw Post.findAndCountAll error' };
        Post.findAndCountAll.mockRejectedValue(errorMessage);
        await list(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
      });
    });
  });
  describe('[GET] /:postId', () => {
    beforeEach(() => {
      req.params.postId = mPost.id;
    });
    describe('[Success]', () => {
      it('should hava a read function', () => {
        expect(typeof read).toBe('function');
      });
      it('should return 200 status code in response', async () => {
        Post.findOne.mockReturnValue(mPost);
        await read(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBe(true);
      });
    });
    describe('[Failure]', () => {
      it('should return 400 status code in response', async () => {
        req.params.postId = null;
        await read(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBe(true);
      });
      it('should return 404 status code in response', async () => {
        req.params.contentId = -1;
        await read(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBe(true);
      });
      it('should handle error: read.findOne', async () => {
        const errorMessage = {
          message: 'throw read.findOne error',
        };
        Post.findOne.mockRejectedValue(errorMessage);
        await read(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
      });
    });
    describe('[PATCH] /:postId', () => {
      beforeEach(() => {
        req.params.postId = mPost.id;
        req.body = mPayload;
        req.user = mUser;
      });
      describe('[Success]', () => {
        it('should have a update function', () => {
          expect(typeof update).toBe('function');
        });
        it('should return 200 status code in response', async () => {
          Post.findOne.mockReturnValue(mPost);
          await update(req, res, next);
          expect(res.statusCode).toBe(200);
          expect(res._isEndCalled()).toBe(true);
        });
      });
      describe('[Failure]', () => {
        it('should return 400 status code in response: When has not req.body', async () => {
          req.body = {};
          await update(req, res, next);
          expect(res.statusCode).toBe(400);
          expect(res._isEndCalled()).toBe(true);
        });
        it('should return 400 status code in response: When has not req.params', async () => {
          req.params.postId = null;
          await update(req, res, next);
          expect(res.statusCode).toBe(400);
          expect(res._isEndCalled()).toBe(true);
        });
        it('should return 404 status code in response', async () => {
          req.params.contentId = -1;
          await update(req, res, next);
          expect(res.statusCode).toBe(404);
          expect(res._isEndCalled()).toBe(true);
        });
        it('should handle error: Post.findOne', async () => {
          const errorMessage = {
            message: 'throw Post.findOne error',
          };
          Post.findOne.mockRejectedValue(errorMessage);
          await update(req, res, next);
          expect(next).toHaveBeenCalledWith(errorMessage);
        });
        it('should handle error: mPost.update', async () => {
          const errorMessage = {
            message: 'throw mPost.update error',
          };
          mPost.update = jest.fn();
          Post.findOne.mockReturnValue(mPost);
          mPost.update.mockRejectedValue(errorMessage);
          await update(req, res, next);
          expect(next).toHaveBeenCalledWith(errorMessage);
        });
      });
    });
    describe('[DELETE] /:postId', () => {
      beforeEach(() => {
        req.params.postId = mPost.id;
        req.user = mUser;
      });
      describe('[Success]', () => {
        it('should have a remove function', () => {
          expect(typeof remove).toBe('function');
        });
        it('should return 200 status code in response', async () => {
          Post.findOne.mockReturnValue(mPost);
          await remove(req, res, next);
          expect(res.statusCode).toBe(200);
          expect(res._isEndCalled()).toBe(true);
        });
      });
      describe('[Failure]', () => {
        it('should return 400 status code in response', async () => {
          req.params.postId = null;
          await remove(req, res, next);
          expect(res.statusCode).toBe(400);
          expect(res._isEndCalled()).toBe(true);
        });
        it('should return 404 status code in response', async () => {
          req.params.contentId = -1;
          await remove(req, res, next);
          expect(res.statusCode).toBe(404);
          expect(res._isEndCalled()).toBe(true);
        });
        it('should handle error: Post.findOne error', async () => {
          const errorMessage = {
            message: 'throw MagazineContent.findOne error',
          };
          Post.findOne.mockRejectedValue(errorMessage);
          await remove(req, res, next);
          expect(next).toHaveBeenCalledWith(errorMessage);
        });
        it('should handle error: mPost.destroy error', async () => {
          const errorMessage = {
            message: 'throw magazineContent.update error',
          };
          mPost.destroy = jest.fn();
          Post.findOne.mockReturnValue(mPost);
          mPost.destroy.mockRejectedValue(errorMessage);
          await remove(req, res, next);
          expect(next).toHaveBeenCalledWith(errorMessage);
        });
      });
    });
  });
});

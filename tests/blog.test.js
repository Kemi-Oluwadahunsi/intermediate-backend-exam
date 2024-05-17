const request = require("supertest");
const app = require("../server"); 
const Blog = require("../models/blog");
const accessToken = process.env.JWT_TOKEN

describe("Blog Controller", () => {
  describe("POST /blog/create", () => {
    test("It should create a new blog", async () => {
      const response = await request(app)
        .post("/blog/create")
        .send({
          title: "Test Blog",
          description: "Test Description",
          tags: ["test", "example"],
          body: "Test body content",
        })
        .set("Authorization", `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Blog created successfully");
      expect(response.body.data).toBeTruthy();
    });
  });

  describe("GET /blog/all", () => {
    test("It should respond with a list of published blogs", async () => {
      const blog1 = new Blog({
        title: "Published Blog 1",
        description: "Description of Published Blog 1",
        tags: ["published", "example"],
        body: "Body content of Published Blog 1",
        state: "published",
      });
      await blog1.save();

      const blog2 = new Blog({
        title: "Published Blog 2",
        description: "Description of Published Blog 2",
        tags: ["published", "test"],
        body: "Body content of Published Blog 2",
        state: "published",
      });
      await blog2.save();

      const response = await request(app).get("/blog/all");
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Blogs List");
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe("GET /blog/:id", () => {
    test("It should respond with a single published blog", async () => {
      const blog = new Blog({
        title: "Published Blog",
        description: "Description of Published Blog",
        tags: ["published", "example"],
        body: "Body content of Published Blog",
        state: "published",
      });
      await blog.save();

      const response = await request(app).get(`/blog/${blog._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Blog created successfully");
      expect(response.body.data).toBeTruthy();
    });

  });

describe('PUT /blog/:id', () => {
    test('It should update a blog', async () => {
      const blog = new Blog({
        title: 'Test Blog',
        description: 'Test Description',
        tags: ['test', 'example'],
        body: 'Test body content',
        state: 'draft',
      });
      await blog.save();

      const response = await request(app)
        .put(`/blog/${blog._id}`)
        .send({
          title: 'Updated Blog Title',
          description: 'Updated Description',
          tags: ['updated', 'example'],
          body: 'Updated body content',
        })
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Blog updated successfully');
      expect(response.body.data.title).toBe('Updated Blog Title');
    });
  });

  describe('PATCH /blog/:id/state', () => {
    test('It should update the state of a blog', async () => {
      const blog = new Blog({
        title: 'Test Blog',
        description: 'Test Description',
        tags: ['test', 'example'],
        body: 'Test body content',
        state: 'draft',
      });
      await blog.save();

      const response = await request(app)
        .patch(`/blog/${blog._id}/state`)
        .send({ state: 'published' })
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Blog state updated successfully');
      expect(response.body.data.state).toBe('published');
    });
  });

  describe('DELETE /blog/:id', () => {
    test('It should delete a blog', async () => {
      const blog = new Blog({
        title: 'Test Blog',
        description: 'Test Description',
        tags: ['test', 'example'],
        body: 'Test body content',
        state: 'draft',
      });
      await blog.save();

      const response = await request(app)
        .delete(`/blog/${blog._id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Blog deleted successfully');
    });
  });

  describe('GET /blog/owner', () => {
    test('It should get a list of blogs owned by the user', async () => {
      const blog1 = new Blog({
        title: 'Test Blog 1',
        description: 'Test Description 1',
        tags: ['test', 'example'],
        body: 'Test body content 1',
        state: 'draft',
        author: 'USER_ID',
      });
      await blog1.save();

      const blog2 = new Blog({
        title: 'Test Blog 2',
        description: 'Test Description 2',
        tags: ['test', 'example'],
        body: 'Test body content 2',
        state: 'published',
        author: 'USER_ID',
      });
      await blog2.save();

      const response = await request(app)
        .get('/blog/owner')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('All available blogs');
      expect(response.body.data).toHaveLength(2);
    });
  });
});

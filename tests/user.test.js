const request = require("supertest"); // Import the supertest library
const app = require("../server"); // Adjust the path to your server file as needed

describe("User Controller", () => {
  describe("POST /user/register", () => {
    test("It should register a new user", async () => {
      const response = await request(app).post("/user/register").send({
        first_name: "Kemi",
        last_name: "Dahunsi",
        email: "gbengene@gmail.com",
        password: "Bethel2018",
      });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Registration completed");
    });

    test("It should return an error if required fields are missing", async () => {
      const response = await request(app).post("/user/register").send({
        first_name: "Kemi",
        last_name: "Dahunsi",
        password: "Bethel2018",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    });

    test("It should return an error if email already exists", async () => {
      await request(app).post("/user/register").send({
        first_name: "Kemi",
        last_name: "Dahunsi",
        email: "gbengene@gmail.com",
        password: "Bethel2018",
      });

      const response = await request(app).post("/user/register").send({
        first_name: "Kemi",
        last_name: "Dahunsi",
        email: "gbengene@gmail.com",
        password: "Bethel2018",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });

  describe("POST /user/login", () => {
    test("It should login a user with correct credentials", async () => {
      await request(app).post("/user/register").send({
        first_name: "Kemi",
        last_name: "Dahunsi",
        email: "gbengene@gmail.com",
        password: "Bethel2018",
      });

      const response = await request(app).post("/user/login").send({
        email: "gbengene@gmail.com",
        password: "Bethel2018",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Login successful");
    });

    test("It should return an error if email or password is missing", async () => {
      const response = await request(app).post("/user/login").send({
        email: "gbengene@gmail.com",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    });

    test("It should return an error if credentials are incorrect", async () => {
      await request(app).post("/user/register").send({
        first_name: "Kemi",
        last_name: "Dahunsi",
        email: "gbengene@gmail.com",
        password: "Bethel2018",
      });

      const response = await request(app).post("/user/login").send({
        email: "gbengene@gmail.com",
        password: "wrongpassword",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });
});

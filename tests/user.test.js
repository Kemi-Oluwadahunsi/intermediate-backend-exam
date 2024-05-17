const request = require("supertest");
const app = require("../server");

describe("User Controller", () => {
  describe("POST /user/register", () => {
    test("It should register a new user", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          first_name: "Kemi",
          last_name: "Dahunsi",
          email: "kemilat50@gmail.com",
          password: "KodeMaven",
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Registration completed");
    });

    test("It should return an error if required fields are missing", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({ first_name: "Kemi", last_name: "Dahunsi", password: "KodeMaven" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    });

    test("It should return an error if email already exists", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          first_name: "Kemi",
          last_name: "Dahunsi",
          email: "kemilat50@gmail.com",
          password: "KodeMaven",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });

  describe("POST /user/login", () => {
    test("It should login a user with correct credentials", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({ email: "kemilat50@gmail.com", password: "Kodemaven" });
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Login successful");
    });

    test("It should return an error if email or password is missing", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({ email: "kemilat50@gmail.com" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    });

    test("It should return an error if credentials are incorrect", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({ email: "kemilat50@gmail.com", password: "wrongpassword" });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });
});

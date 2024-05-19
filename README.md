# Blog API

## Overview

This project is a RESTful API for a blogging platform. It allows users to register, login, create, update, delete, and fetch blog posts. Users can also view published blogs and search for blogs by various filters. The API uses JWT for authentication and MongoDB for data storage.

## Features

- User registration and authentication (JWT-based, token expires after 1 hour)
- CRUD operations for blog posts
- Blog post state management (draft, published)
- Pagination, filtering, and sorting for blog posts
- Reading time calculation for blog posts
- Logging with Winston
- Comprehensive tests for all endpoints

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- bcrypt for password hashing
- dotenv
- nodemon
- Winston for logging
- Jest and Supertest for testing

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Kemi-Oluwadahunsi/intermediate-backend-exam.git
    cd blog-api
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:

    Create a `.env` file in the root of the project and add the following:

    ```plaintext
    PORT = 8000 (if you want to run it on your local machine)
    JWT_SECRET=your_jwt_secret_can_be_any_word_or_phrase
    MONGO_URI=your_mongo_connection_string
    ```

4. Run the application:
    ```bash
    npm run dev
    ```

## API Endpoints

### User Routes
This includes routes for user registration and login. A JWT token is generated after a user logs in successfully.

- **Register**
    ```http
    POST /user/register
    ```
    Request Body:
    ```json
    {
      "first_name": "Kemi",
      "last_name": "Dahusni",
      "email": "kemidahunsi@example.com",
      "password": "password123"
    }
    ```
   Response
    ```json
    {
    "message": "Registration completed",
    "savedUser": {
        "first_name": "Kemi",
        "last_name": "Dahunsi",
        "email": "kemidahunsi@gmail.com",
        "password": "$2b$10$bgbmDfbfNt7SyZ08J.Zg4.oyTnojCmGZ6j3p3HYzbji/VDa7qey8G",
        "_id": "6649a2b1919e552f619fa319",
        "createdAt": "2024-05-19T06:56:49.229Z",
        "updatedAt": "2024-05-19T06:56:49.229Z",
        "__v": 0
    }}
    ```

- **Login**
    ```http
    POST /user/login
    ```
    Request Body:
    ```json
    {
      "email": "kemidahunsi@example.com",
      "password": "password123"
    }
    ```
   Response
    ```json
    {
    "message": "Login successful",
    "user": {
        "_id": "664785cc73401c58054edb8f",
        "first_name": "Kemi",
        "last_name": "Dahunsi",
        "email": "kemilat50@gmail.com",
        "password": "$2b$10$.PTF6frDsaZwJtW6ZE9t8O1G.eYsEaNFNJnmCeDVenwZll2tD65I2",
        "createdAt": "2024-05-17T16:29:00.728Z",
        "updatedAt": "2024-05-17T16:29:00.728Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5c................................"}```


### Blog Routes

- **Create Blog**
    ```http
    POST /blog/create
    ```
    Headers:
    ```http
    Authorization: Bearer <token>
    ```
    
    Request Body:
     ```json
    {
    "title": "Green Tea Rinse",
    "description": "Enhance hair shine and reduce hair loss with green tea.",
    "body": "Explore the benefits of green tea for promoting healthy hair and reducing dandruff.",
    "tags": ["Natural", "Hair", "Green Tea"]
    }
     ```
   Response
   ```json
   {
    "message": "Blog created successfully",
    "data": {
        "title": "Green Tea Rinse",
        "description": "Enhance hair shine and reduce hair loss with green tea.",
        "author": "664785cc73401c58054edb8f",
        "state": "draft",
        "read_count": 0,
        "reading_time": 1,
        "tags": [
            "Natural",
            "Hair",
            "Green Tea"
        ],
        "body": "Explore the benefits of green tea for promoting healthy hair and reducing dandruff.",
        "_id": "6647a1952dd1b1e64f0b460e",
        "createdAt": "2024-05-17T18:27:33.587Z",
        "updatedAt": "2024-05-17T18:27:33.587Z",
        "__v": 0
    }}


- **Get All Blogs**
    ```http
    GET /blog/getAll
    ```
    Query Parameters:
    - `page`: Page number (default: 1)
    - `limit`: Number of blogs per page (default: 20)
    - `author`: Author's name
    - `title`: Blog title
    - `tags`: Comma-separated list of tags
    - `sortBy`: Field to sort by (e.g., read_count, reading_time)
    - `sortDirection`: Sort direction (asc or desc)

- **Get Published Blogs**
- This makes an http request with the method "GET" to get all published blogs, it doesn't matter if user is logged in or not.
    ```http
    GET /blog/all
    ```
    Response
   ```json
   {
       "message": "Blog created successfully",
       "data": [
           {
               "_id": "66479b562dd1b1e64f0b45c0",
               "title": "From Roots to Blooming",
               "description": "Natural Ingredients and recipes for healthy hair growth.",
               "author": "664785cc73401c58054edb8f",
               "state": "published",
               "read_count": 2,
               "reading_time": 1,
               "tags": [
                   "Natural",
                   "Hair"
               ],
               "body": "Explore what nature has in abundance to support hair's well being and wellness.",
               "createdAt": "2024-05-17T18:00:54.858Z",
               "updatedAt": "2024-05-17T18:14:49.578Z",
               "__v": 0
           },
           {
               ........................
           },
           {
              .........................
           }
       ]
   }
   ```

- **Get a Published Blog by ID**

- This request gets a single blog in published state by its ID.
    ```http
    GET /blog/:id
    ```

- **Update Blog**
- A user can update any of the blog query which could be title, description, e.t.c... by the id of the blog.
    ```http
    PUT /blog/:id
    ```
    Headers:
    ```http
    Authorization: Bearer <token>
    ```
    Request Body:
    ```json
    {
      "title": "Updated Title",
      "description": "Updated Description",
      "tags": ["updatedTag1", "updatedTag2"],
      "body": "Updated body of the blog post"
    }
    ```
    Response
  ```json
  {
  "message": "Blog updated successfully",
    "data": {
        "_id": "66479b562dd1b1e64f0b45c0",
        "title": "Updated Title",
        "description": "Updated Description",
        "author": "664785cc73401c58054edb8f",
        "state": "published",
        "read_count": 2,
        "reading_time": 1,
        "tags": [
            "updatedTag1",
            "updatedTag2"
        ],
        "body": "Updated body of the blog post",
        "createdAt": "2024-05-17T18:00:54.858Z",
        "updatedAt": "2024-05-19T07:12:53.335Z",
        "__v": 1
    }}



- **Update Blog State**
    ```http
    PATCH /blog/:id/state
    ```
    Headers:
    ```http
    Authorization: Bearer <token>
    ```
    Request Body:
    ```json
    {
      "state": "published" or "draft"
    }
    ```
    Former state
    ```json
    {
    "message": "Blog created successfully",
    "data": {
        "title": "Green Tea Rinse",
        "description": "Enhance hair shine and reduce hair loss with green tea.",
        "author": "664785cc73401c58054edb8f",
        "state": "draft",
        "read_count": 0,
        "reading_time": 1,
        "tags": [
            "Natural",
            "Hair",
            "Green Tea"
        ],
        "body": "Explore the benefits of green tea for promoting healthy hair and reducing dandruff.",
        "_id": "6647a1952dd1b1e64f0b460e",
        "createdAt": "2024-05-17T18:27:33.587Z",
        "updatedAt": "2024-05-17T18:27:33.587Z",
        "__v": 0
    }}
    ```

    New State
     ```json
     {
    "message": "Blog state updated successfully",
    "data": {
        "_id": "6647a1952dd1b1e64f0b460e",
        "title": "Green Tea Hair Rinse For Healthy Hair Growth",
        "description": "Enhance hair shine and reduce hair loss with green tea. Also improves hair growth.",
        "author": "664785cc73401c58054edb8f",
        "state": "published",
        "read_count": 0,
        "reading_time": 1,
        "tags": [
            "Natural",
            "Hair",
            "Green Tea"
        ],
        "body": "Explore the benefits of green tea for promoting healthy hair and reducing dandruff.",
        "createdAt": "2024-05-17T18:27:33.587Z",
        "updatedAt": "2024-05-19T07:26:31.250Z",
        "__v": 0
    }}
     

- **Delete Blog**
    ```http
    DELETE /blog/:id
    ```
    Headers:
    ```http
    Authorization: Bearer <token>
    ```
    Response
  ```json
  {
     message: "Blog deleted successfully"
  }

- **Get User's Blogs**
    ```http
    GET /blog/owner
    ```
    Headers:
    ```http
    Authorization: Bearer <token>
    ```
    Query Parameters:
    - `page`: Page number (default: 1)
    - `limit`: Number of blogs per page (default: 10)
    - `state`: Blog state (draft or published)

## Models

### Blog Model

```javascript
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  read_count: {
    type: Number,
    default: 0,
  },
  reading_time: {
    type: Number,
  },
  tags: {
    type: [String],
  },
  body: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
```
### User Model
```javascript
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password or email");
  }
  throw Error("Incorrect password or email");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
```

## API Endpoints

### Authentication
- `POST /user/register`: Sign up with first_name, last_name, email and password.
- `POST /user/login`: Login with email and password.

### Blogs
- `GET /blog/getAll`: Get all blogs (requires authentication).
- `GET /blog/all`: Get list of published blogs.
- `GET /blog/:id`: Get a published blog by ID.
- `POST /blog/create`: Create a new blog (requires authentication).
- `PUT /blog/:id`: Update a blog (requires authentication).
- `PATCH /blog/:id/state`: Update a blog state (requires authentication).
- `DELETE /blog/:id`: Delete a blog (requires authentication).
- `GET /blog/owner`: Get list of user's blogs (requires authentication).

## ERD
This shows the relationship between the user and the blog creation. A user can create as many blogs as possible, and can perform blog operations.
<img src="https://res.cloudinary.com/dee9teadk/image/upload/v1716099677/ERD_ftzn8c.png" alt="ERD_Image" />

## Testing
- Use tools like Postman or curl to test API endpoints.
- Ensure proper authentication and authorization for protected routes.

## License
This project is licensed under the [MIT License](LICENSE).

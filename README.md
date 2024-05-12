# Blogging API

This project implements a Blogging API using Node.js and Express.js, with MongoDB as the database. The API provides functionalities for user authentication, blog creation, management, and retrieval.

## Requirements

### User Authentication
- Users can sign up and sign in to the blog app.
- JWT is used as the authentication strategy, with tokens expiring after 1 hour.

### Blog Functionality
- Blogs can be in draft or published states.
- Users can view lists of published blogs and read individual blogs.
- Logged-in users can create, edit, delete, and publish their blogs.
- Blog endpoints are paginated, filterable by state, and searchable by author, title, and tags.
- Blogs have attributes such as title, description, tags, author, timestamp, read count, reading time, and body.

## Setup

### Installation
1. Clone this repository.
2. Install dependencies using `npm install`.

### Environment Variables
1. Create a `.env` file in the root directory.
2. Define the following environment variables:
   - `JWT_SECRET`: Secret key for JWT token generation.
   - `MONGODB_URI`: MongoDB connection string.
   - `PORT`: Port number for the server.
   - `NODE_ENV`: Environment (e.g., `development`, `production`).

### Running the Server
- Run `npm start` to start the server.
- The server will run on the specified port (default is 3000).

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Sign up with email and password.
- `POST /api/auth/signin`: Sign in with email and password.

### Blogs
- `GET /api/blogs`: Get list of published blogs.
- `GET /api/blogs/:id`: Get a published blog by ID.
- `POST /api/blogs`: Create a new blog (requires authentication).
- `PUT /api/blogs/:id`: Update a blog (requires authentication).
- `DELETE /api/blogs/:id`: Delete a blog (requires authentication).
- `GET /api/user/blogs`: Get list of user's blogs (requires authentication).

## Testing
- Use tools like Postman or curl to test API endpoints.
- Ensure proper authentication and authorization for protected routes.

## Dependencies
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- dotenv
- bcrypt
- nodemon

## License
This project is licensed under the [MIT License](LICENSE).

# Backend for GPA Calculator

Description
The backend of the GPA Calculator project is built with Node.js using Express, Mongoose, and MongoDB. It handles requests for user registration, authentication, GPA management, semesters, and courses.

## Installation
1. Navigate to the backend directory:
   ### `cd backend`
2. Install dependencies:
   ### `npm install`
   or
   ### `yarn install`
3. Create a .env file in the root of backend with the following content:
   ### `MONGO_URI=mongodb://127.0.0.1:27017/gpa_calculator`
    ### `JWT_SECRET=<YOUR_JWT_SECRET>`
   Ensure MongoDB is running on 127.0.0.1:27017 or update MONGO_URI for your configuration.

## Running the Application
- Start the server:
   ### `node index.js`
   The server will be available at http://localhost:3000.

## Testing
- To run tests (if tests are added):
   ### `npm test`
   or
   ### `yarn test`


## Dependencies
- Express, Mongoose, bcrypt, express-validator, cors, cookie-parser, morgan.

## API Endpoints
- /api/auth/login — User login.
- /api/auth/register — User registration.
- /api/users/profile — Get/update user profile.
- /api/gpa — Manage GPA (create, get, update, delete).
- /api/gpa/semesters — Add a new semester.
- /api/gpa/:semesterId/courses — Manage courses in a semester.

## What Needs to Be Done
- Add data validation at the Mongoose schema level (e.g., min/max values for credits).
- Implement error handling with more detailed messages.
- Optimize database queries (indexes, caching).
- Add API documentation (e.g., via Swagger).

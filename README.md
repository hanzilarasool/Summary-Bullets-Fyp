# Bullet Summary

Bullet Summary is a powerful tool for creating concise book summaries with bullet points.
www.summarybullets.com
## Project Structure

```
root/
├── frontend/
└── backend/
```

## Frontend Setup

To set up the frontend development environment, follow these steps:

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Backend Setup

To set up the backend server, follow these steps:

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following environment variables:
   ```
   PORT=4000
   DB_LOCAL_URI=[Your MongoDB URI]
   JWT_SECRET=[Your JWT Secret]
   CORS_ORIGIN=http://localhost:5173
   ```
   **Important:** Keep these values confidential and never share them publicly.

4. Start the backend server:
   ```
   npm start
   ```

## Environment Variables

- **PORT:** The port on which the backend server will run.
- **DB_LOCAL_URI:** MongoDB connection string.
- **JWT_SECRET:** Secret key for JWT token generation.
- **CORS_ORIGIN:** Allowed origin for CORS.

## Getting Started

Follow these steps to get started with Bullet Summary:

1. Set up both frontend and backend as described above.
2. Ensure MongoDB is running and accessible.
3. Start both frontend and backend servers.
4. Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to use the application.



# Book Review API

## Overview

This project is a full-stack application built with **Next.js** that allows users to search for books via the **Google Books API**, create and manage their own reviews, and interact with other users' reviews. The application implements **JWT authentication**, **bcrypt** for password hashing, and uses **MongoDB** with **Mongoose** to store user and review data.

## Features

- **User Authentication**:
  - Users can sign up, log in, and manage their profiles.
  - JWT authentication with local storage for session management.
  - Passwords are hashed using bcrypt.

- **Book Reviews**:
  - Users can search for books using the Google Books API.
  - Signed-in users can create, edit, and delete their own reviews.
  - Public reviews are visible to all users, but only authenticated users can modify or delete their reviews.

- **Frontend**:
  - Built with **Next.js** for server-side rendering and routing.
  - **Tailwind CSS** is used for styling.
  - The frontend uses components, interfaces, and models for better organization and maintainability.

## Technologies

- **Backend**:
  - **Node.js** with **Next.js** (API Routes).
  - **MongoDB** with **Mongoose** for database management.
  - **JWT** for authentication.
  - **bcrypt** for password hashing.
  
- **Frontend**:
  - **React** (via Next.js).
  - **Tailwind CSS** for styling.
  
- **APIs**:
  - **Google Books API** for fetching book data.
  - Custom API for managing user and review data.

## API Endpoints

### Users

- **GET /api/users** - Get all users (admin only).
- **GET /api/users/:userId** - Get a user by ID.
- **POST /api/users** - Create a new user.
- **PATCH /api/users/:userId** - Update user information.
- **DELETE /api/users/:userId** - Delete a user.

### Reviews

- **GET /api/reviews** - Get all reviews.
- **GET /api/reviews/book/:bookId** - Get reviews for a specific book.
- **GET /api/reviews/user/:userId** - Get reviews by a specific user.
- **POST /api/reviews** - Create a new review.
- **PATCH /api/reviews/:reviewId** - Edit a review.
- **DELETE /api/reviews/:reviewId** - Delete a review.

### Authentication

- **POST /api/auth** - Log in and get a JWT token.

## Frontend Structure

- **Components**:
  - Reusable components for UI elements like buttons, forms, and review cards.
  
- **Interfaces**:
  - TypeScript interfaces for users, reviews, and book data.

- **Models**:
  - Models for user and review data that are used both on the backend and frontend.

- **Routing**:
  - The frontend uses Next.js routing with folders for organization.

## Getting Started

### Prerequisites

- Node.js (v16 or higher).
- MongoDB database (locally or via a cloud service like MongoDB Atlas).

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/JoeSteeloak/jojapp.git
   ```

2. Install dependencies:

   ```
   cd <project-directory>
   npm install
   ```

3. Set up environment variables in a `.env.local` file:

   ```
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Run the development server:

   ```
   npm run dev
   ```

   Your app should now be running at [http://localhost:3000](http://localhost:3000).

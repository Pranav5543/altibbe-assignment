# MERN Product App

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing products with dynamic forms, authentication, and PDF report generation.

## Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Product Management**: Create, read, update, and delete products
- **Dynamic Multi-step Forms**: Conditional logic for product data collection
- **PDF Report Generation**: Generate downloadable PDF reports for products
- **Responsive UI**: Modern, mobile-friendly interface built with TailwindCSS
- **RESTful API**: Secure backend APIs with input validation

## Tech Stack

### Frontend

- React 18 with TypeScript
- TailwindCSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management

### Backend

- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- PDFKit for PDF generation
- bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn
- GitHub account for deployment

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mern-product-app
   ```

2. Backend Setup:

   ```bash
   cd backend
   npm install
   ```

3. Frontend Setup:

   ```bash
   cd ../frontend
   npm install
   ```

4. Environment Configuration:
   - Create a `.env` file in the `backend` directory
   - Add your MongoDB connection URL:
     ```
     MONGO_URI=mongodb://localhost:27017/mern-product-app
     JWT_SECRET=your-super-secret-jwt-key-here
     PORT=5000
     ```

## Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user info

### Products

- `GET /api/products` - Get all products for user
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Reports

- `POST /api/reports/generate/:productId` - Generate PDF report
- `GET /api/reports` - Get all reports for user

## Usage

1. Register a new account or login with existing credentials
2. Create products using the multi-step form
3. View, edit, or delete your products
4. Generate PDF reports for your products
5. Admins can manage questions for the forms

## License

This project is licensed under the ISC License.

Developed by N.Pranav

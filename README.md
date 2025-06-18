# Inventory App

This is a Node.js/Express application designed for managing inventory, user accounts, shopping cart, and wishlist functionalities. It uses a PostgreSQL database for data persistence.

## Project Structure

```
charmin-codal-inventory-app/
├── api/
│   └── index.js            # Main API entry point (primarily for serverless environments)
├── src/
│   ├── app.js              # Express application setup and core logic
│   ├── config/             # Database configuration (db.js), schema (schema.sql, db.sql), and migrations (migrations.js, initDb.js)
│   ├── controllers/        # Route handlers (business logic)
│   ├── middleware/         # Custom Express middleware (e.g., auth, errorHandler)
│   ├── models/             # Data models and database interaction logic
│   └── routes/             # API route definitions
├── package.json            # Project metadata, dependencies, and scripts
└── README.md               # This file
```

## Features

- **User Authentication**: Register, login, and get current user details.
- **Item Management**: Create, read, update, and delete inventory items. Supports file uploads for item images.
- **Cart Management**: Add, update, and remove items from the cart.
- **Wishlist Management**: Add and remove items from the wishlist.
- **API Documentation**: Swagger UI available at `/api-docs`.

## API Endpoints

### Authentication

- **POST /api/users/register**: Register a new user.
  - **Request Body**:
    ```json
    {
      "username": "testuser",
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response**: User object and JWT token.

- **POST /api/users/login**: Login and get a JWT token.
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response**: User object and JWT token.

- **GET /api/users/me**: Get current user details (requires authentication).
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: User object (`id`, `username`, `email`).

### Items

- **GET /api/items**: Get all items.
  - **Response**: Array of item objects.

- **POST /api/items**: Create a new item (supports file upload for images).
  - **Request Body**:
    ```json
    {
      "name": "New Item",
      "description": "Item description",
      "price": 19.99,
      "quantity": 100,
      "image": <file>
    }
    ```
  - **Response**: The newly created item object.

- **PUT /api/items/{id}**: Update an item (supports file upload for images).
  - **Request Body**:
    ```json
    {
      "name": "Updated Item",
      "description": "Updated description",
      "price": 29.99,
      "quantity": 50,
      "image": <file>
    }
    ```
  - **Response**: Confirmation message.

- **DELETE /api/items/{id}**: Delete an item.
  - **Response**: Confirmation message.

### Cart

- **GET /api/cart**: Get all items in the cart.
  - **Response**: Array of cart item objects with joined item details.

- **POST /api/cart**: Add an item to the cart.
  - **Request Body**:
    ```json
    {
      "item_id": 1,
      "quantity": 2
    }
    ```
  - **Response**: The newly created cart item object.

- **PUT /api/cart/{id}**: Update the quantity of an item in the cart.
  - **Request Body**:
    ```json
    {
      "quantity": 3
    }
    ```
  - **Response**: Confirmation message.

- **DELETE /api/cart/{id}**: Remove an item from the cart.
  - **Response**: Confirmation message.

### Wishlist

- **GET /api/wishlist**: Get all items in the wishlist.
  - **Response**: Array of wishlist items with joined item details.

- **POST /api/wishlist/add**: Add an item to the wishlist.
  - **Request Body**:
    ```json
    {
      "itemId": 1
    }
    ```
  - **Response**: The newly created wishlist entry.

- **DELETE /api/wishlist/{itemId}**: Remove an item from the wishlist.
  - **Response**: The removed wishlist entry.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd inventory-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=4000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. **Run migrations**:
   ```bash
   npm run migrate
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

6. **Access the API documentation**:
   Open your browser and go to `http://localhost:4000/api-docs`.

## Technologies Used

- **Node.js**: Runtime environment.
- **Express**: Web framework.
- **PostgreSQL**: Database.
- **Multer**: Middleware for handling file uploads.
- **Swagger**: API documentation.

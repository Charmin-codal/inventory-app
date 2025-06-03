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

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL
*   **Authentication:** JSON Web Tokens (JWT), bcryptjs (for password hashing)
*   **Libraries:** `pg` (Node.js PostgreSQL client), `cors`, `dotenv`

## Prerequisites

*   Node.js (version >=18.0.0 recommended, as per `package.json`)
*   npm (comes with Node.js)
*   PostgreSQL server running and accessible.

## Setup and Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Charmin-codal/inventory-app.git
    cd inventory-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project and add the following variables. Replace placeholder values with your actual configuration.
    ```dotenv
    NODE_ENV=development
    PORT=5000
    POSTGRES_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:YOUR_DB_PORT/YOUR_DB_NAME"
    JWT_SECRET="your_super_secret_and_long_jwt_key"
    ```
    *   `PORT`: The port on which the local development server will run (defaults to 4000 in `src/app.js` if not set and `src/app.js` is run directly).
    *   `POSTGRES_URL`: Your PostgreSQL connection string.
    *   `JWT_SECRET`: A secret key for signing JSON Web Tokens.

4.  **Database Setup:**
    Ensure your PostgreSQL server is running and you have created a database that matches the one specified in your `POSTGRES_URL`.

5.  **Run database migrations:**
    This command will create the necessary tables (`users`, `items`, `wishlist`, `cart`) in your database based on `src/config/migrations.js`.
    ```bash
    npm run migrate
    ```

6.  **Running the Application:**

    *   **For typical local development (starts a listening server):**
        The `src/app.js` file contains the logic to start an HTTP server. Run it using:
        ```bash
        nodemon src/app.js
        ```
        If you don't have `nodemon` installed globally, you can run it via npx: `npx nodemon src/app.js` or install it as a dev dependency.
        Alternatively, for a single run without auto-restarting:
        ```bash
        node src/app.js
        ```
        The server will log that it's running on the configured `PORT` (or 4000 if `PORT` is not set in `.env`).

    *   **Using `npm start` or `npm run dev`:**
        The scripts `npm start` (`node api/index.js`) and `npm run dev` (`nodemon api/index.js`) execute `api/index.js`. This file exports the Express app but does not start an HTTP server listener itself. This setup is typically used for serverless function environments (e.g., Vercel, AWS Lambda) where the platform handles the server lifecycle. Running these commands in a standard Node.js local environment will execute the script but won't result in a listening server.

## API Endpoints

The base URL for all API endpoints is the server address (e.g., `http://localhost:5000` if `PORT` is 5000).

### Authentication (`/api/users`)

*   **`POST /register`**
    *   Description: Registers a new user.
    *   Body: `{ "username": "testuser", "email": "user@example.com", "password": "password123" }`
    *   Response: User object and JWT token.

*   **`POST /login`**
    *   Description: Logs in an existing user.
    *   Body: `{ "email": "user@example.com", "password": "password123" }`
    *   Response: User object and JWT token.

*   **`GET /me`**
    *   Description: Gets the currently authenticated user's details.
    *   Authentication: Required (Bearer Token).
    *   Response: User object (`id`, `username`, `email`).

### Items (`/api/items`)

*   **`GET /`**
    *   Description: Retrieves a list of all items.
    *   Response: Array of item objects.

*   **`POST /`**
    *   Description: Creates a new item.
    *   Body: `{ "name": "New Item", "description": "Item description", "price": 19.99, "quantity": 100 }` (Note: `itemController.js` expects `name, quantity, description`, `price` handling might be missing or different from `schema.sql`'s `price` field in `items` table.)
    *   Response: The newly created item object.

*   **`PUT /:id`**
    *   Description: Updates an existing item by its ID.
    *   Params: `id` - The ID of the item to update.
    *   Body: `{ "name": "Updated Item", "description": "Updated description", "price": 29.99, "quantity": 50 }` (Fields to update)
    *   Response: Confirmation message.

*   **`DELETE /:id`**
    *   Description: Deletes an item by its ID.
    *   Params: `id` - The ID of the item to delete.
    *   Response: Confirmation message.

### Cart (`/api/cart`)
*Note: Cart operations currently do not seem to be user-specific based on authentication in the provided controllers/routes. This might imply a guest cart or a single-user context by design, or an area for future enhancement.*

*   **`POST /`**
    *   Description: Adds an item to the cart.
    *   Body: `{ "item_id": 1, "quantity": 2 }`
    *   Response: The newly created cart item object.

*   **`GET /`**
    *   Description: Retrieves all items currently in the cart.
    *   Response: Array of cart item objects with joined item details.

*   **`PUT /:id`**
    *   Description: Updates the quantity of an item in the cart.
    *   Params: `id` - The ID of the cart item (not the product item_id).
    *   Body: `{ "quantity": 3 }`
    *   Response: Confirmation message.

*   **`DELETE /:id`**
    *   Description: Removes an item from the cart.
    *   Params: `id` - The ID of the cart item (not the product item_id).
    *   Response: Confirmation message.

### Wishlist (`/api/wishlist`)
*Authentication: Required for all wishlist endpoints (Bearer Token).*

*   **`GET /`**
    *   Description: Retrieves the wishlist items for the authenticated user.
    *   Response: Array of wishlist items with joined item details.

*   **`POST /add`**
    *   Description: Adds an item to the authenticated user's wishlist.
    *   Body: `{ "itemId": 1 }`
    *   Response: The newly created wishlist entry.

*   **`DELETE /:itemId`**
    *   Description: Removes an item from the authenticated user's wishlist.
    *   Params: `itemId` - The ID of the item (product ID) to remove from the wishlist.
    *   Response: The removed wishlist entry.

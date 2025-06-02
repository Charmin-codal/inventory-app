# Inventory App

A Node.js/Express application for managing inventory and shopping cart functionality.

## Project Structure

```
inventory-app/
├── src/                      # Source code
│   ├── config/               # Configuration files
│   ├── controllers/          # Controllers
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   └── app.js               # Express app setup
├── tests/                   # Test files
└── package.json            # Project metadata and dependencies
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DATABASE_URL=your_database_url
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- Items API: `/api/items`
- Cart API: `/cart`

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- dotenv 
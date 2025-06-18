const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Management API",
      version: "1.0.0",
      description: "API documentation for Inventory Management System",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Item: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The auto-generated id of the item",
            },
            name: {
              type: "string",
              description: "The name of the item",
            },
            description: {
              type: "string",
              description: "The description of the item",
            },
            price: {
              type: "number",
              format: "float",
              description: "The price of the item",
            },
            stock_quantity: {
              type: "integer",
              description: "The available quantity of the item",
            },
            category: {
              type: "string",
              description: "The category of the item",
            },
            image_url: {
              type: "string",
              description: "The URL of the item image",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "The creation timestamp",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "The last update timestamp",
            },
          },
        },
        // ... existing schemas ...
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;

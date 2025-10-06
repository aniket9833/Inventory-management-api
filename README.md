# Warehouse Inventory Management API

A RESTful API for managing warehouse inventory, built with Node.js, Express, and MongoDB. This API provides endpoints for tracking product inventory, managing stock levels, and monitoring low stock alerts.

## Features

- CRUD operations for products
- Stock management (increase/decrease)
- Low stock monitoring
- Error handling
- Data validation
- Unit testing with Jest

## Prerequisites

- Node.js (v20.10.0 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/aniket9833/Inventory-management-api.git
cd warehouse-inventory-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/warehouse-inventory
PORT=3000
```

## Running the Application

### Development Mode
```bash
npm start
```

### Running Tests
```bash
npm test
```

## API Endpoints

### Products

#### GET `/products`
- Get all products
- Response: List of products

#### GET `/products/:id`
- Get a single product by ID
- Response: Product details

#### POST `/products`
- Create a new product
- Request body:
```json
{
  "name": "Product Name",
  "description": "Product Description",
  "stock_quantity": 10,
  "low_stock_threshold": 5
}
```

#### PUT `/products/:id`
- Update a product
- Request body: Same as POST

#### DELETE `/products/:id`
- Delete a product

### Stock Management

#### POST `/products/:id/increase`
- Increase product stock
- Request body:
```json
{
  "amount": 5
}
```

#### POST `/products/:id/decrease`
- Decrease product stock
- Request body:
```json
{
  "amount": 3
}
```

#### GET `/products/low-stock`
- Get list of products with stock below threshold


## Error Handling

The API implements comprehensive error handling for:
- Invalid requests
- Not found resources
- Validation errors
- Database errors
- Stock management errors (e.g., insufficient stock)

## Testing

The project includes unit tests for:
- Stock management operations
- Input validation
- Error handling
- CRUD operations

Run tests with:
```bash
npm test
```

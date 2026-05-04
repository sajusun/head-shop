# Herd Shop API Specification

This document outlines the API endpoints and data structures used in the Herd Shop application.

## 🔷 Base URL
`https://api.example.com/v1`

---

## 🔷 1. Auth API

### Login
- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt-token-string"
  }
  ```

### Register
- **Endpoint:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** (Same as Login)

---

## 🔷 2. Products API

### Get All Products
- **Endpoint:** `GET /products`
- **Response:**
  ```json
  [
    {
      "id": "1",
      "name": "Product Name",
      "slug": "product-slug",
      "price": 99.99,
      "image": "url",
      "category": "Electronics",
      "rating": 4.5,
      "stock": 10
    }
  ]
  ```

### Get Product by Slug
- **Endpoint:** `GET /products/slug/:slug`
- **Response:** (Single Product Object)

---

## 🔷 3. Reviews API

### Get Product Reviews
- **Endpoint:** `GET /reviews/:productId`
- **Response:**
  ```json
  [
    {
      "id": "r1",
      "productId": "1",
      "userName": "John Doe",
      "rating": 5,
      "comment": "Great product!",
      "date": "2024-03-20",
      "replies": [
        {
          "id": "rep1",
          "userName": "Admin",
          "comment": "Thank you!",
          "date": "2024-03-21"
        }
      ]
    }
  ]
  ```

### Add Review
- **Endpoint:** `POST /reviews`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "productId": "1",
    "rating": 5,
    "comment": "Awesome!"
  }
  ```

---

## 🔷 4. Cart API (Optional / Server-side persistence)

### Sync Cart
- **Endpoint:** `POST /cart/sync`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `items[]`

---

## 🔷 5. About API

### Get About Data
- **Endpoint:** `GET /about`
- **Response:**
  ```json
  {
    "title": "String",
    "subtitle": "String",
    "ourStory": "String",
    "vision": "String",
    "stats": [
      { "label": "String", "value": "String" }
    ],
    "team": [
      { "name": "String", "role": "String", "image": "url" }
    ]
  }
  ```

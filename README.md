Stuntguard | Web-Service
========================

Stuntguard is a backend API that connects a mobile client with a database and a machine learning model stored in cloud storage. This web service is designed to facilitate user authentication, manage child data, provide prediction results, and track historical data.

Table of Contents
-----------------

*   [Features](#features)
*   [Endpoints](#endpoints)
    *   [Authentication](#authentication)
        *   [POST /sign-in](#postsign-in)
        *   [POST /sign-up](#postsign-up)
    *   [Child Management](#child-management)
        *   [GET /childs](#getchilds)
        *   [POST /childs](#postchilds)
        *   [DELETE /childs/:id](#deletechilds-id_child)
    *   [Missions](#missions)
        *   [GET /missions/:id](#getmissionsid-id_child)
        *   [POST /missions/:id](#postmissionsid-id_child)
        *   [DELETE /missions/:id](#deletemissionsid-id_mission)
    *   [Predictions](#predictions)
        *   [GET /predicts/:id](#getpredictsid-id_result)
        *   [POST /predicts/:id](#postpredictsid-id_child)
    *   [History](#history)
        *   [GET /history/:id](#gethistoryid-id_child)

Features
--------

*   User Authentication using JWT tokens.
*   Child data management.
*   Machine learning predictions for child stunting.
*   Historical data tracking for monitoring child predictions.
*   Built with Express.js for fast and scalable backend development.

Endpoints
---------

### Authentication
Authentication is handled using JWT tokens. After successful login, a token is returned which must be included in the header of subsequent requests to protected endpoints.

#### POST /sign-in

Authenticate a user and return a JWT token along with user details.

**Request Body:**

    {
        "email": "string",
        "password": "string"
    }

**Response:**

    {
        "status": "string",
        "message": "string",
        "token": "jwt_token",
        "name": "string"
    }

#### POST /sign-up

Register a new user.

**Request Body:**

    {
        "email": "string",
        "password": "string",
        "name": "string"
    }

**Response:**

    {
        "status": "string",
        "message": "string"
    }

### Child Management

#### GET /childs

Retrieve all child data.

**Request Headers:**

    Authorization: Bearer jwt_token

**Response:**

    {
        "status": "string",
        "message": "string",
        "data": [
            {
                "id": "number",
                "name": "string",
                "url_photo": "string",
                "createdAt": "string",
                "updatedAt": "string",
                "assignedToUser": "number",
                "gender": "string"
            }
        ]
    }

#### POST /childs

Add a new child.

**Request Headers:**

    Authorization: Bearer jwt_token

**Request Body:**

    {
        "name": "string",
        "image": "string",
        "gender": "string"
    }

**Response:**

    {
        "status": "string",
        "message": "string"
    }

#### DELETE /childs/:id

Delete child data by ID.

**Request Headers:**

    Authorization: Bearer jwt_token

**Request Parameters:**

    id (number): The ID of the child.

**Response:**

    {
        "status": "string",
        "message": "string"
    }

### Missions

#### GET /missions/:id

Retrieve missions assigned to a child by child ID.

**Request Headers:**

    Authorization: Bearer jwt_token

**Request Parameters:**

    id (number): The ID of the child.

**Response:**

    {
        "status": "string",
        "message": "string",
        "data": [
            {
                "id": "number",
                "title": "string",
                "description": "string",
                "assignedToUser": "number",
                "createdAt": "string",
                "updatedAt": "string",
                "assignedToChild": "number"
            }
        ]
    }

#### POST /missions/:id

Add a new mission assigned to a child.

**Request Headers:**

    Authorization: Bearer jwt_token

**Request Parameters:**

    id (number): The ID of the child.

**Request Body:**

    {
        "title": "string",
        "description": "string"
    }

**Response:**

    {
        "status": "string",
        "message": "string"
    }

#### DELETE /missions/:id

Delete a mission by mission ID.

**Request Headers:**

    Authorization: Bearer jwt_token

**Request Parameters:**

    id (number): The ID of the mission.

**Response:**

    {
        "status": "string",
        "message": "string"
    }

### Predictions

#### GET /predicts/:id

Retrieve prediction results by result ID.

**Request Headers:**

    Authorization: Bearer jwt_token

**Request Parameters:**

    id (number): The ID of the prediction result.

**Response:**

    {
        "status": "string",
        "message": "string",
        "data": {
            "score": "number",
            "createdAt": "string",
            "id": "number",
            "prediction": "string",
            "message": "string",
            "subtitle": "string",
            "recommendation": [
                {
                    "id": "number",
                    "title": "string",
                    "description": "string",
                    "assignedToPredict": "number"
                }
            ]
        }
    }

#### POST /predicts/:id

Add a new prediction result for a child.

**Request Headers:**

    Authorization: Bearer jwt_token

**Request Parameters:**

    id (number): The ID of the child.

**Request Body:**

    {
        "height": "number",
        "gender": "string",
        "age": "number"
    }

**Response:**

    {
        "status": "string",
        "message": "string",
        "data": {
            "id": "number",
            "label": "string",
            "confidenceScore": "number"
        }
    }

### History

#### GET /history/:id

Retrieve historical prediction data for a child by ID.

**Request Headers:**

    Authorization: Bearer jwt_token

**Request Parameters:**

    id (number): The ID of the child.

**Response:**

    {
        "status": "string",
        "message": "string",
        "data": [
            {
                "id": "number",
                "name": "string",
                "prediction": "string",
                "subtitle": "string",
                "createdAt": "string"
            }
        ]
    }



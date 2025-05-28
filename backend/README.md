# E-Commerce API Backend

This is the backend API for the e-commerce application built with Python Pyramid and PostgreSQL.

## Features

- RESTful API with JSON responses
- Session-based authentication and authorization
- PostgreSQL database with SQLAlchemy ORM
- User management
- Product catalog with categories
- Order processing
- Admin dashboard capabilities

## Requirements

- Python 3.8+
- PostgreSQL 12+

## Installation

1. Create a virtual environment:

```bash
python -m venv venv
```

2. Activate the virtual environment:

- Windows:

```bash
venv\Scripts\activate
```

- Unix/MacOS:

```bash
source venv/bin/activate
```

3. Install dependencies:

```bash
# Update pip first to avoid dependency issues
pip install --upgrade pip
pip install -e .
```

4. Make sure PostgreSQL is running and create a database:

```bash
createdb ecommerce
```

5. Initialize the database with sample data:

```bash
initialize_db development.ini
```

## Configuration

The main configuration is in `development.ini`. You should update the following settings:

- `sqlalchemy.url`: Database connection string
- `session.secret`: Secret key for session cookie signing (use a strong, random key)
- `cors.origins`: Origins allowed for CORS (comma-separated list)

## Running the server

```bash
pserve development.ini
```

The API will be available at http://localhost:8000/api

## API Documentation

The API provides endpoints for:

- Authentication (register, login, current user)
- Users management (admin only)
- Product catalog (browsing, search, filtering)
- Orders (creation, management, history)

See the API_REQUIREMENTS.md file for detailed endpoint documentation.

## Authentication

This API uses session-based authentication:

1. Session cookies are used to maintain authentication state
2. Cookies are automatically handled by browsers and API clients with `withCredentials: true`
3. The cookie is HttpOnly to prevent JavaScript access for security
4. CORS is properly configured to allow credentials from authorized origins

See `SESSION_AUTH_EXAMPLES.md` for examples of how to use the authentication API.

## Testing

For API testing examples, see `API_TESTING.md` which includes:

- How to test with curl commands
- Script-based testing with PowerShell, Bash, and Batch
- Browser-based testing

For automated tests:

```bash
pytest
```

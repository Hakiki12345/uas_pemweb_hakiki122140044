from pyramid.view import view_config
from pyramid.response import Response
import json

@view_config(route_name='home')
def home_view(request):
    """Root view for API."""
    api_info = {
        "name": "E-Commerce API",
        "version": "1.0",
        "description": "RESTful API for e-commerce application",
        "endpoints": [
            {"path": "/api/auth/register", "method": "POST", "description": "Register a new user"},
            {"path": "/api/auth/login", "method": "POST", "description": "Login and get JWT token"},
            {"path": "/api/auth/me", "method": "GET", "description": "Get current user info"},
            {"path": "/api/products", "method": "GET", "description": "Get all products"},
            {"path": "/api/products/{id}", "method": "GET", "description": "Get product by ID"},
            {"path": "/api/orders", "method": "GET", "description": "Get orders (admin only)"},
            {"path": "/api/orders/user", "method": "GET", "description": "Get user orders"}
        ]
    }
    
    # Return JSON response with correct charset
    return Response(json_body=api_info)

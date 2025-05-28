from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPBadRequest, HTTPNotFound, HTTPConflict, 
    HTTPUnauthorized, HTTPForbidden
)
from pyramid.response import Response
import json

from ..models.user import User

@view_config(route_name='register', request_method='POST', renderer='json')
def register(request):
    """Register a new user and create a session."""
    try:
        body = request.json_body
    except:
        return HTTPBadRequest(json={'error': 'Invalid JSON body'})
    
    # Validate required fields
    for field in ['email', 'password', 'first_name', 'last_name']:
        if field not in body:
            return HTTPBadRequest(json={'error': f'Missing required field: {field}'})
    
    # Check if user with email already exists
    existing_user = request.db.query(User).filter(User.email == body['email']).first()
    if existing_user:
        return HTTPConflict(json={'error': 'User with this email already exists'})
      # Create new user
    try:
        user = User(
            email=body['email'],
            first_name=body['first_name'],
            last_name=body['last_name'],
            is_admin=body.get('is_admin', False)
        )
        user.set_password(body['password'])
        
        request.db.add(user)
        request.db.flush()  # Get the ID assigned by the database
    except Exception as e:
        if 'uq_users_email' in str(e):
            return HTTPConflict(json={'error': 'User with this email already exists'})
        else:
            print(f"Registration error: {e}")
            return HTTPBadRequest(json={'error': 'Failed to register user'})
    
    # Set user info in session
    request.session['user_id'] = user.id
    request.session['user_email'] = user.email
    request.session['user_name'] = f"{user.first_name} {user.last_name}"
    request.session['user_roles'] = ['admin'] if user.is_admin else ['user']
    
    # Prepare response with user data
    user_data = user.to_dict()
    # No token needed with session-based auth
    
    return user_data

@view_config(route_name='login', request_method='POST', renderer='json')
def login(request):
    """Authenticate a user and create a session."""
    try:
        body = request.json_body
    except:
        return HTTPBadRequest(json={'error': 'Invalid JSON body'})
    
    # Validate required fields
    for field in ['email', 'password']:
        if field not in body:
            return HTTPBadRequest(json={'error': f'Missing required field: {field}'})
    
    # Find user by email
    user = request.db.query(User).filter(User.email == body['email']).first()
    if not user or not user.check_password(body['password']):
        return HTTPUnauthorized(json={'error': 'Invalid email or password'})
    
    # Check if user is active
    if not user.is_active:
        return HTTPForbidden(json={'error': 'Account is deactivated'})
    
    # Set user info in session
    request.session['user_id'] = user.id
    request.session['user_email'] = user.email
    request.session['user_name'] = f"{user.first_name} {user.last_name}"
    request.session['user_roles'] = ['admin'] if user.is_admin else ['user']
    
    # Prepare response with user data
    user_data = user.to_dict()
    # No token needed with session-based auth
    
    return user_data

@view_config(route_name='current_user', request_method='GET', renderer='json')
def current_user(request):
    """Get current authenticated user."""
    # Check if user is authenticated
    user_id = request.session.get('user_id')
    if not user_id:
        return HTTPUnauthorized(json={'error': 'Authentication required'})
    
    user = request.db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return HTTPNotFound(json={'error': 'User not found'})
    
    return user.to_dict()

@view_config(route_name='logout', request_method='POST', renderer='json')
def logout(request):
    """Log out the current user by invalidating the session."""
    request.session.invalidate()
    return {'message': 'Logged out successfully'}

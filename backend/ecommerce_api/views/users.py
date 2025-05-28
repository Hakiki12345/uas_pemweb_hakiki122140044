from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPBadRequest, HTTPNotFound, HTTPForbidden,
    HTTPUnauthorized
)

from ..models.user import User

@view_config(route_name='users', request_method='GET', renderer='json', permission='admin')
def get_users(request):
    """Get all users. Admin only."""
    query = request.db.query(User)
    
    # Filter by active status if provided
    if 'is_active' in request.params:
        is_active = request.params['is_active'].lower() == 'true'
        query = query.filter(User.is_active == is_active)
    
    # Search by name or email
    if 'search' in request.params:
        search_term = f"%{request.params['search']}%"
        query = query.filter(
            User.email.ilike(search_term) | 
            User.first_name.ilike(search_term) | 
            User.last_name.ilike(search_term)
        )
    
    # Sorting
    sort_by = request.params.get('sort_by', 'id')
    sort_dir = request.params.get('sort_dir', 'asc')
    
    if sort_by in ['id', 'email', 'first_name', 'last_name', 'created_at']:
        column = getattr(User, sort_by)
        if sort_dir.lower() == 'desc':
            column = column.desc()
        query = query.order_by(column)
    
    # Pagination
    try:
        page = int(request.params.get('page', 1))
        per_page = int(request.params.get('per_page', 10))
    except ValueError:
        page = 1
        per_page = 10
    
    total = query.count()
    offset = (page - 1) * per_page
    users = query.offset(offset).limit(per_page).all()
    
    return {
        'items': [user.to_dict() for user in users],
        'total': total,
        'page': page,
        'per_page': per_page,
        'pages': (total + per_page - 1) // per_page
    }

@view_config(route_name='user', request_method='GET', renderer='json')
def get_user(request):
    """Get a user by ID."""
    user_id = int(request.matchdict['id'])
    
    # Check if user is requesting their own record or is an admin
    if user_id != request.authenticated_userid and not request.has_permission('admin'):
        return HTTPForbidden(json={'error': 'You do not have permission to view this user'})
    
    user = request.db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return HTTPNotFound(json={'error': 'User not found'})
    
    return user.to_dict()

@view_config(route_name='user', request_method='PUT', renderer='json')
def update_user(request):
    """Update a user's information."""
    user_id = int(request.matchdict['id'])
    
    # Check if user is updating their own record or is an admin
    if user_id != request.authenticated_userid and not request.has_permission('admin'):
        return HTTPForbidden(json={'error': 'You do not have permission to update this user'})
    
    user = request.db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return HTTPNotFound(json={'error': 'User not found'})
    
    try:
        body = request.json_body
    except:
        return HTTPBadRequest(json={'error': 'Invalid JSON body'})
    
    # Update user fields
    if 'first_name' in body:
        user.first_name = body['first_name']
    if 'last_name' in body:
        user.last_name = body['last_name']
    if 'email' in body:
        # Check if email is being changed and if it's already in use
        if body['email'] != user.email:
            existing_user = request.db.query(User).filter(User.email == body['email']).first()
            if existing_user:
                return HTTPBadRequest(json={'error': 'Email already in use'})
        user.email = body['email']
    
    # Only admins can change admin status
    if 'is_admin' in body and request.has_permission('admin'):
        user.is_admin = body['is_admin']
    
    # Only admins can change active status
    if 'is_active' in body and request.has_permission('admin'):
        user.is_active = body['is_active']
    
    # Update password if provided
    if 'password' in body:
        user.set_password(body['password'])
    
    return user.to_dict()

@view_config(route_name='user', request_method='DELETE', renderer='json', permission='admin')
def delete_user(request):
    """Delete a user. Admin only."""
    user_id = int(request.matchdict['id'])
    user = request.db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return HTTPNotFound(json={'error': 'User not found'})
    
    request.db.delete(user)
    
    return {'message': 'User deleted successfully'}

@view_config(route_name='user_profile', request_method='GET', renderer='json')
def get_user_profile(request):
    """Get current user profile."""
    if not request.authenticated_userid:
        return HTTPUnauthorized(json={'error': 'Authentication required'})
    
    user_id = request.authenticated_userid
    user = request.db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return HTTPNotFound(json={'error': 'User not found'})
    
    return user.to_dict()

@view_config(route_name='user_profile', request_method='PUT', renderer='json')
def update_user_profile(request):
    """Update current user profile."""
    if not request.authenticated_userid:
        return HTTPUnauthorized(json={'error': 'Authentication required'})
    
    user_id = request.authenticated_userid
    user = request.db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return HTTPNotFound(json={'error': 'User not found'})
    
    try:
        body = request.json_body
    except:
        return HTTPBadRequest(json={'error': 'Invalid JSON body'})
    
    # Update user fields
    if 'first_name' in body:
        user.first_name = body['first_name']
    if 'last_name' in body:
        user.last_name = body['last_name']
    if 'email' in body:
        # Check if email is being changed and if it's already in use
        if body['email'] != user.email:
            existing_user = request.db.query(User).filter(User.email == body['email']).first()
            if existing_user:
                return HTTPBadRequest(json={'error': 'Email already in use'})
        user.email = body['email']
    
    # Update password if provided
    if 'password' in body:
        user.set_password(body['password'])
    
    return user.to_dict()

from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound, HTTPForbidden
import json

from ..models.order import Order, OrderItem
from ..models.product import Product

@view_config(route_name='orders', request_method='GET', renderer='json', permission='admin')
def get_orders(request):
    """Get all orders. Admin only."""
    query = request.db.query(Order)
    
    # Sorting
    sort_by = request.params.get('sort_by', 'created_at')
    sort_dir = request.params.get('sort_dir', 'desc')
    
    if sort_by in ['id', 'created_at', 'status', 'total']:
        column = getattr(Order, sort_by)
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
    orders = query.offset(offset).limit(per_page).all()
    
    return {
        'items': [order.to_dict() for order in orders],
        'total': total,
        'page': page,
        'per_page': per_page,
        'pages': (total + per_page - 1) // per_page
    }

@view_config(route_name='order', request_method='GET', renderer='json')
def get_order(request):
    """Get an order by ID."""
    order_id = int(request.matchdict['id'])
    order = request.db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        return HTTPNotFound(json={'error': 'Order not found'})
    
    # Check if the user is the owner of the order or an admin
    if order.user_id != request.authenticated_userid and not request.has_permission('admin'):
        return HTTPForbidden(json={'error': 'You do not have permission to view this order'})
    
    return order.to_dict()

@view_config(route_name='orders', request_method='POST', renderer='json')
def create_order(request):
    """Create a new order."""
    if not request.authenticated_userid:
        return HTTPForbidden(json={'error': 'Authentication required'})
    
    try:
        body = request.json_body
    except:
        return HTTPBadRequest(json={'error': 'Invalid JSON body'})
    
    # Validate required fields
    for field in ['items', 'shipping_address', 'payment_method']:
        if field not in body:
            return HTTPBadRequest(json={'error': f'Missing required field: {field}'})
    
    # Validate items
    if not isinstance(body['items'], list) or len(body['items']) == 0:
        return HTTPBadRequest(json={'error': 'Order must contain at least one item'})
    
    # Calculate totals
    subtotal = 0
    shipping_cost = body.get('shipping_cost', 0)
    tax = body.get('tax', 0)
    
    # Create new order
    order = Order(
        user_id=request.authenticated_userid,
        status='processing',
        subtotal=0,  # Will update after calculating items
        shipping_cost=shipping_cost,
        tax=tax,
        total=0,  # Will update after calculating items
        shipping_address=body['shipping_address'],
        payment_method=body['payment_method']
    )
    
    request.db.add(order)
    request.db.flush()  # Get the order ID
    
    # Process items
    for item_data in body['items']:
        if not all(key in item_data for key in ['product_id', 'quantity']):
            return HTTPBadRequest(json={'error': 'Invalid item data'})
        
        product_id = item_data['product_id']
        quantity = item_data['quantity']
        
        if quantity <= 0:
            return HTTPBadRequest(json={'error': 'Item quantity must be positive'})
        
        # Get product from database
        product = request.db.query(Product).filter(Product.id == product_id).first()
        if not product:
            return HTTPBadRequest(json={'error': f'Product with ID {product_id} not found'})
        
        # Check stock availability
        if product.stock < quantity:
            return HTTPBadRequest(json={
                'error': f'Not enough stock for product {product.title}'
            })
        
        # Update product stock
        product.stock -= quantity
        
        # Calculate item price
        item_subtotal = product.price * quantity
        subtotal += item_subtotal
        
        # Create order item
        order_item = OrderItem(
            order_id=order.id,
            product_id=product_id,
            quantity=quantity,
            price=product.price
        )
        
        request.db.add(order_item)
    
    # Update order totals
    order.subtotal = subtotal
    order.total = subtotal + shipping_cost + tax
    
    return order.to_dict()

@view_config(route_name='order', request_method='PATCH', renderer='json', permission='admin')
def update_order_status(request):
    """Update an order's status. Admin only."""
    order_id = int(request.matchdict['id'])
    order = request.db.query(Order).filter(Order.id == order_id).first()
    
    if not order:
        return HTTPNotFound(json={'error': 'Order not found'})
    
    try:
        body = request.json_body
    except:
        return HTTPBadRequest(json={'error': 'Invalid JSON body'})
    
    if 'status' not in body:
        return HTTPBadRequest(json={'error': 'Status field is required'})
    
    if body['status'] not in ['processing', 'shipped', 'delivered', 'cancelled']:
        return HTTPBadRequest(json={'error': 'Invalid status value'})
    
    # Update status
    order.status = body['status']
    
    # Add tracking number if provided
    if 'tracking_number' in body:
        order.tracking_number = body['tracking_number']
    
    return order.to_dict()

@view_config(route_name='user_orders', request_method='GET', renderer='json')
def get_user_orders(request):
    """Get orders for the current authenticated user."""
    try:
        # Check if user is authenticated
        if not request.authenticated_userid:
            print("No authenticated user ID found in request")
            return HTTPForbidden(json={'error': 'Authentication required'})
        
        user_id = request.authenticated_userid
        print(f"Fetching orders for user_id: {user_id}")
        
        # Get orders for the user
        query = request.db.query(Order).filter(Order.user_id == user_id)
        
        # Sorting
        sort_by = request.params.get('sort_by', 'created_at')
        sort_dir = request.params.get('sort_dir', 'desc')
        
        if sort_by in ['id', 'created_at', 'status', 'total']:
            column = getattr(Order, sort_by)
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
        
        # Execute query and handle possible errors
        try:
            total = query.count()
            print(f"Total orders found for user {user_id}: {total}")
            offset = (page - 1) * per_page
            orders = query.offset(offset).limit(per_page).all()
            
            # Return empty list if no orders
            if not orders:
                print(f"No orders found for user {user_id}")
                return {
                    'items': [],
                    'total': 0,
                    'page': page,
                    'per_page': per_page,
                    'pages': 0
                }
            
            # Convert orders to dict safely
            order_dicts = []
            for order in orders:
                try:
                    order_dict = order.to_dict()
                    order_dicts.append(order_dict)
                except Exception as e:
                    print(f"Error converting order {order.id} to dict: {str(e)}")
            
            return {
                'items': order_dicts,
                'total': total,
                'page': page,
                'per_page': per_page,
                'pages': (total + per_page - 1) // per_page
            }
        except Exception as e:
            print(f"Database error when fetching orders: {str(e)}")
            return {'error': 'Database error', 'items': [], 'total': 0}
    except Exception as e:
        print(f"Unexpected error in get_user_orders: {str(e)}")
        return {'error': 'Server error', 'items': [], 'total': 0}

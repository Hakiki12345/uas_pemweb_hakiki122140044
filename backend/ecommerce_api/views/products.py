from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPBadRequest, HTTPNotFound, HTTPForbidden
)
from sqlalchemy import func

from ..models.product import Product

@view_config(route_name='products', request_method='GET', renderer='json')
def get_products(request):
    """Get all products with optional filtering."""
    query = request.db.query(Product)
    
    # Apply filters if provided in query params
    if 'category' in request.params:
        query = query.filter(Product.category == request.params['category'])
    
    if 'search' in request.params:
        search_term = f"%{request.params['search']}%"
        query = query.filter(Product.title.ilike(search_term) | Product.description.ilike(search_term))
    
    if 'min_price' in request.params:
        try:
            min_price = float(request.params['min_price'])
            query = query.filter(Product.price >= min_price)
        except ValueError:
            pass
    
    if 'max_price' in request.params:
        try:
            max_price = float(request.params['max_price'])
            query = query.filter(Product.price <= max_price)
        except ValueError:
            pass
    
    # Sorting
    sort_by = request.params.get('sort_by', 'id')
    sort_dir = request.params.get('sort_dir', 'asc')
    
    if sort_by in ['id', 'title', 'price', 'rating', 'created_at']:
        column = getattr(Product, sort_by)
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
    products = query.offset(offset).limit(per_page).all()
      # Format response to match client expectations
    # If client expects pagination metadata, return it
    if request.params.get('paginated', 'false').lower() == 'true':
        return {
            'products': [product.to_dict() for product in products],
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page  # Ceiling division
        }
    # Otherwise, just return the products array
    return [product.to_dict() for product in products]

@view_config(route_name='product', request_method='GET', renderer='json')
def get_product(request):
    """Get a product by ID."""
    product_id = int(request.matchdict['id'])
    product = request.db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        return HTTPNotFound(json={'error': 'Product not found'})
    
    return product.to_dict()

@view_config(route_name='products', request_method='POST', renderer='json', permission='admin')
def create_product(request):
    """Create a new product. Admin only."""
    try:
        body = request.json_body
    except:
        return HTTPBadRequest(json={'error': 'Invalid JSON body'})
    
    # Validate required fields
    for field in ['title', 'price', 'category']:
        if field not in body:
            return HTTPBadRequest(json={'error': f'Missing required field: {field}'})
    
    # Create new product
    product = Product(
        title=body['title'],
        description=body.get('description', ''),
        price=float(body['price']),
        category=body['category'],
        image_url=body.get('image_url'),
        stock=body.get('stock', 0),
        rating=body.get('rating', 0.0),
    )
    
    request.db.add(product)
    request.db.flush()  # Get the ID assigned by the database
    
    return product.to_dict()

@view_config(route_name='product', request_method='PUT', renderer='json', permission='admin')
def update_product(request):
    """Update a product. Admin only."""
    product_id = int(request.matchdict['id'])
    product = request.db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        return HTTPNotFound(json={'error': 'Product not found'})
    
    try:
        body = request.json_body
    except:
        return HTTPBadRequest(json={'error': 'Invalid JSON body'})
    
    # Update product fields
    if 'title' in body:
        product.title = body['title']
    if 'description' in body:
        product.description = body['description']
    if 'price' in body:
        product.price = float(body['price'])
    if 'category' in body:
        product.category = body['category']
    if 'image_url' in body:
        product.image_url = body['image_url']
    if 'stock' in body:
        product.stock = int(body['stock'])
    if 'rating' in body:
        product.rating = float(body['rating'])
    
    return product.to_dict()

@view_config(route_name='product', request_method='DELETE', renderer='json', permission='admin')
def delete_product(request):
    """Delete a product. Admin only."""
    product_id = int(request.matchdict['id'])
    product = request.db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        return HTTPNotFound(json={'error': 'Product not found'})
    
    request.db.delete(product)
    
    return {'message': 'Product deleted successfully'}

@view_config(route_name='product_categories', request_method='GET', renderer='json')
def get_categories(request):
    """Get all product categories."""
    try:
        print("Fetching product categories...")
        # Check if request.db is available
        if not hasattr(request, 'db'):
            print("ERROR: request.db is not available")
            return {'status': 'error', 'message': 'Database connection not available', 'categories': []}
        
        # Print database query information for debugging
        print(f"Database connection: {request.db.bind.url}")
        print(f"Database engine: {request.db.bind.name}")
        
        # Check if the Product model is properly defined
        print(f"Product model: {Product.__tablename__}")
        
        # Check if products table exists
        from sqlalchemy import inspect
        inspector = inspect(request.db.bind)
        tables = inspector.get_table_names()
        print(f"Available tables: {', '.join(tables)}")
        
        if 'products' not in tables:
            print("ERROR: 'products' table does not exist in the database")
            # Return hardcoded default categories as fallback
            default_categories = ["Electronics", "Clothing", "Jewelry", "Men's Clothing", "Women's Clothing"]
            print(f"Returning default categories: {default_categories}")
            return {'status': 'warning', 'message': 'Products table not found, using defaults', 'categories': default_categories}
        
        # Execute the query with detailed error logging
        try:            # First try a simple query to verify database connection
            from sqlalchemy import text
            test_query = request.db.execute(text("SELECT 1")).scalar()
            print(f"Database connection test: {test_query}")
            
            # Now query the categories
            categories = request.db.query(Product.category).distinct().all()
            result = [c[0] for c in categories if c[0]]  # Filter out None values
            print(f"Found {len(result)} product categories: {result}")
            
            # If no categories were found but the table exists, return default categories
            if not result:
                default_categories = ["Electronics", "Clothing", "Jewelry", "Men's Clothing", "Women's Clothing"]
                print(f"No categories found in database, using defaults: {default_categories}")
                return {'status': 'warning', 'message': 'No categories found in database, using defaults', 'categories': default_categories}
            
            # Return data in a consistent format
            return {'status': 'success', 'categories': result}
        except Exception as query_error:
            print(f"Database query error: {str(query_error)}")
            print(f"Query attempted: query(Product.category).distinct().all()")
            import traceback
            print(traceback.format_exc())
            
            # Return hardcoded default categories as fallback
            default_categories = ["Electronics", "Clothing", "Jewelry", "Men's Clothing", "Women's Clothing"]
            return {
                'status': 'error', 
                'message': f'Database query error: {str(query_error)}', 
                'categories': default_categories,
                'error_details': str(query_error)
            }
    except Exception as e:
        print(f"Error fetching product categories: {str(e)}")
        import traceback
        print(traceback.format_exc())
        
        # Return hardcoded default categories as fallback
        default_categories = ["Electronics", "Clothing", "Jewelry", "Men's Clothing", "Women's Clothing"]
        return {
            'status': 'error', 
            'message': f'Server error: {str(e)}', 
            'categories': default_categories,
            'error_details': str(e)
        }

@view_config(route_name='products_by_category', request_method='GET', renderer='json')
def get_products_by_category(request):
    """Get products by category."""
    category = request.matchdict['category']
    query = request.db.query(Product).filter(Product.category == category)
    
    # Sorting (optional)
    sort_by = request.params.get('sort_by', 'id')
    sort_dir = request.params.get('sort_dir', 'asc')
    
    if sort_by in ['id', 'title', 'price', 'rating', 'created_at']:
        column = getattr(Product, sort_by)
        if sort_dir.lower() == 'desc':
            column = column.desc()
        query = query.order_by(column)
        
    products = query.all()
    return [product.to_dict() for product in products]

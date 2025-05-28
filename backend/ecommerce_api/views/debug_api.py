from pyramid.view import view_config
from pyramid.httpexceptions import HTTPOk
from ..models.product import Product

@view_config(route_name='debug_products', request_method='GET', renderer='json')
def debug_products(request):
    """Debug endpoint to check the products table."""
    result = {
        'status': 'ok',
        'request_info': {
            'path': request.path,
            'params': dict(request.params),
            'headers': {k: v for k, v in request.headers.items()},
            'has_db': hasattr(request, 'db'),
        },
        'database': {}
    }
    
    try:
        result['database']['connection'] = str(request.db.bind.url)
        # Get product count
        product_count = request.db.query(Product).count()
        result['database']['product_count'] = product_count
        
        # Get sample products
        if product_count > 0:
            sample = request.db.query(Product).limit(2).all()
            result['database']['sample_products'] = [
                {
                    'id': p.id,
                    'title': p.title,
                    'category': p.category
                }
                for p in sample
            ]
        
        # Test categories query
        categories_query = request.db.query(Product.category).distinct().all()
        categories = [c[0] for c in categories_query if c[0]]
        result['database']['categories'] = categories
        result['database']['categories_count'] = len(categories)
        
    except Exception as e:
        result['error'] = str(e)
        import traceback
        result['traceback'] = traceback.format_exc()
    
    return result

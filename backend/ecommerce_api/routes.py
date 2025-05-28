def includeme(config):
    """Configure routes for the API."""

    # API version prefix
    api_prefix = '/api'
    
    # Home route for API documentation or redirect
    config.add_route('home', '/')
    
    # Add CORS preflight handler
    config.add_route('cors_preflight', '{path:.*}', request_method='OPTIONS')
    
    # Authentication routes
    config.add_route('register', f'{api_prefix}/auth/register')
    config.add_route('login', f'{api_prefix}/auth/login')
    config.add_route('current_user', f'{api_prefix}/auth/me')
    config.add_route('logout', f'{api_prefix}/auth/logout')
    
    # Users routes
    config.add_route('users', f'{api_prefix}/users')
    config.add_route('user', f'{api_prefix}/users/{{id}}')
    config.add_route('user_profile', f'{api_prefix}/users/me')
      # Products routes
    config.add_route('products', f'{api_prefix}/products')
    config.add_route('product_categories', f'{api_prefix}/products/categories')
    config.add_route('products_by_category', f'{api_prefix}/products/category/{{category}}')
    config.add_route('product', f'{api_prefix}/products/{{id}}')    # Orders routes
    config.add_route('orders', f'{api_prefix}/orders')
    config.add_route('user_orders', f'{api_prefix}/orders/user')
    config.add_route('order', f'{api_prefix}/orders/{{id}}')
    
    # Debug routes (should be disabled in production)
    config.add_route('debug_products', f'{api_prefix}/debug/products')
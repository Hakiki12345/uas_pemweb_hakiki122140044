from pyramid.view import view_config
from pyramid.response import Response

@view_config(route_name='cors_preflight', request_method='OPTIONS')
def options_view(request):
    """Handle OPTIONS preflight requests for CORS."""
    print('OPTIONS request received:', request.headers)
    origin = request.headers.get('Origin', '*')
    print(f'Responding with CORS headers for origin: {origin}')
    
    response = Response()
    response.headers.update({
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-Client-Version, X-Registration-Source',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',  # 24 hours
    })
    return response

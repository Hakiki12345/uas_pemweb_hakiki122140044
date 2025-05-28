import os
import sys
import transaction
from pyramid.paster import (
    get_appsettings,
    setup_logging,
)

from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
import zope.sqlalchemy

from ecommerce_api.models import Base
from ecommerce_api.models.product import Product

def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri>' % cmd)
    sys.exit(1)

def main(argv=sys.argv):
    if len(argv) != 2:
        usage(argv)
    config_uri = argv[1]
    
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)
    engine = engine_from_config(settings, 'sqlalchemy.')
    
    session_factory = sessionmaker(bind=engine)
    
    with transaction.manager:
        dbsession = session_factory()
        zope.sqlalchemy.register(dbsession)
        
        # Check if there are already products
        existing_count = dbsession.query(Product).count()
        if existing_count > 0:
            print(f"Database already has {existing_count} products. Skipping sample data creation.")
            return
            
        # Create sample categories and products
        sample_products = [
            {
                'title': 'Laptop Pro X1',
                'description': 'Powerful laptop for professionals with high-end specs',
                'price': 1299.99,
                'category': 'Electronics',
                'image_url': 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
                'stock': 25
            },
            {
                'title': 'Smartphone Ultra',
                'description': 'Latest smartphone with advanced camera and long battery life',
                'price': 899.99,
                'category': 'Electronics',
                'image_url': 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg',
                'stock': 50
            },
            {
                'title': 'Men\'s Casual Shirt',
                'description': 'Slim-fitting style, contrast raglan long sleeve',
                'price': 22.99,
                'category': "Men's Clothing",
                'image_url': 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
                'stock': 120
            },
            {
                'title': 'Women\'s Casual Dress',
                'description': 'Elegant casual dress suitable for multiple occasions',
                'price': 39.99,
                'category': "Women's Clothing",
                'image_url': 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg',
                'stock': 85
            },
            {
                'title': 'Gold Pendant Jewelry',
                'description': 'Satisfaction Guaranteed. Return or exchange any order within 30 days.',
                'price': 129.99,
                'category': 'Jewelry',
                'image_url': 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
                'stock': 35
            },
        ]
        
        # Add products to database
        for product_data in sample_products:
            product = Product(
                title=product_data['title'],
                description=product_data['description'],
                price=product_data['price'],
                category=product_data['category'],
                image_url=product_data['image_url'],
                stock=product_data['stock']
            )
            dbsession.add(product)
            
        print(f"Added {len(sample_products)} sample products to the database")

if __name__ == '__main__':
    main()

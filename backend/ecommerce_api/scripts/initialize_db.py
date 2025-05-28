import os
import sys
import transaction
from pyramid.paster import (
    get_appsettings,
    setup_logging,
)
from pyramid.scripts.common import parse_vars

from ..models import Base
from ..models.user import User
from ..models.product import Product
from ..models.order import Order, OrderItem
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)

def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)
    
    engine = engine_from_config(settings, prefix='sqlalchemy.')
    Base.metadata.create_all(engine)
    
    session_factory = sessionmaker(bind=engine)
    with transaction.manager:
        dbsession = session_factory()
        
        # Create admin user if it doesn't exist
        admin = dbsession.query(User).filter_by(email='admin@example.com').first()
        if not admin:
            admin = User(
                first_name='Admin',
                last_name='User',
                email='admin@example.com',
                is_admin=True,
                is_active=True
            )
            admin.set_password('admin123')  # Change in production!
            dbsession.add(admin)
            print('Created admin user: admin@example.com (password: admin123)')
        
        # Create some sample products if the table is empty
        if dbsession.query(Product).count() == 0:
            products = [
                Product(
                    title='Smartphone X',
                    description='Latest smartphone with advanced features',
                    price=599.99,
                    category='Electronics',
                    image_url='https://example.com/images/smartphone.jpg',
                    stock=50,
                    rating=4.5
                ),
                Product(
                    title='Laptop Pro',
                    description='High-performance laptop for professionals',
                    price=1299.99,
                    category='Electronics',
                    image_url='https://example.com/images/laptop.jpg',
                    stock=25,
                    rating=4.8
                ),
                Product(
                    title='Wireless Headphones',
                    description='Noise-cancelling wireless headphones',
                    price=199.99,
                    category='Electronics',
                    image_url='https://example.com/images/headphones.jpg',
                    stock=100,
                    rating=4.2
                ),
                Product(
                    title='Cotton T-Shirt',
                    description='Comfortable cotton t-shirt',
                    price=19.99,
                    category='Clothing',
                    image_url='https://example.com/images/tshirt.jpg',
                    stock=200,
                    rating=4.0
                ),
                Product(
                    title='Running Shoes',
                    description='Lightweight running shoes for athletes',
                    price=89.99,
                    category='Footwear',
                    image_url='https://example.com/images/shoes.jpg',
                    stock=75,
                    rating=4.7
                ),
            ]
            
            for product in products:
                dbsession.add(product)
            
            print(f'Added {len(products)} sample products')

if __name__ == '__main__':
    main()

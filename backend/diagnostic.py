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
    print('usage: %s <config_uri>\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)

def run_diagnostics(config_uri=None, quiet=False):
    """Run database diagnostics as a function that can be imported and used by other scripts"""
    if config_uri is None:
        config_uri = "development.ini"
        
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)
    
    if not quiet:
        print(f"Database URL: {settings['sqlalchemy.url']}")
    
    engine = engine_from_config(settings, 'sqlalchemy.')
    session_factory = sessionmaker(bind=engine)
    
    results = {
        'success': False,
        'connection': False,
        'tables': [],
        'products_count': 0,
        'categories': [],
        'errors': []
    }
    
    with transaction.manager:
        dbsession = session_factory()
        zope.sqlalchemy.register(dbsession)        # Check database connection
        if not quiet:
            print("\n--- Database Connection Test ---")
        try:
            from sqlalchemy import text
            dbsession.execute(text("SELECT 1"))
            results['connection'] = True
            if not quiet:
                print("✓ Database connection successful")
        except Exception as e:
            error_msg = f"Database connection failed: {e}"
            results['errors'].append(error_msg)
            if not quiet:
                print(f"✗ {error_msg}")
            return results
            
        # Check tables
        if not quiet:
            print("\n--- Database Tables ---")
        
        try:
            from sqlalchemy import inspect
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            results['tables'] = tables
            
            if not quiet:
                print(f"Found {len(tables)} tables: {', '.join(tables)}")
            
            if 'products' not in tables:
                error_msg = "Products table not found!"
                results['errors'].append(error_msg)
                if not quiet:
                    print(f"✗ {error_msg}")
            else:
                if not quiet:
                    print("✓ Products table exists")
        except Exception as e:
            error_msg = f"Error inspecting tables: {e}"
            results['errors'].append(error_msg)
            if not quiet:
                print(f"✗ {error_msg}")        # Check Product model
        if not quiet:
            print("\n--- Product Model ---")
            print(f"Product table name: {Product.__tablename__}")
            print(f"Product columns: {[c.name for c in Product.__table__.columns]}")
          # Check product records
        if not quiet:
            print("\n--- Product Records ---")
        try:    
            products_count = dbsession.query(Product).count()
            results['products_count'] = products_count
            if not quiet:
                print(f"Total products: {products_count}")
            
            if products_count > 0:
                if not quiet:
                    print("\nSample products:")
                sample_products = dbsession.query(Product).limit(3).all()
                for p in sample_products:
                    if not quiet:
                        print(f"  - ID: {p.id}, Title: {p.title}, Category: {p.category}")
        except Exception as e:
            error_msg = f"Error querying products: {e}"
            results['errors'].append(error_msg)
            if not quiet:
                print(f"✗ {error_msg}")
        
        # Test categories query specifically
        if not quiet:
            print("\n--- Categories Query Test ---")
        try:
            categories = dbsession.query(Product.category).distinct().all()
            result = [c[0] for c in categories if c[0]]
            results['categories'] = result
            if not quiet:
                print(f"✓ Categories query successful: Found {len(result)} categories")
                print(f"  Categories: {result}")
        except Exception as e:
            error_msg = f"Categories query failed: {e}"
            results['errors'].append(error_msg)
            if not quiet:
                print(f"✗ {error_msg}")
        
        # Mark success if we got this far without errors
        results['success'] = len(results['errors']) == 0
        
        if not quiet:
            print("\nDiagnostic completed.")
        
        return results

def main(argv=sys.argv):
    if len(argv) != 2:
        usage(argv)
    config_uri = argv[1]
    run_diagnostics(config_uri)
    
if __name__ == '__main__':
    main()

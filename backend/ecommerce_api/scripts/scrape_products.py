#!/usr/bin/env python3
"""
Script to scrape products from FakeStore API and populate the database.
This script fetches 20 products from https://fakestoreapi.com/products
and inserts them into the local database.
"""

import os
import sys
import requests
import transaction
from pyramid.paster import (
    get_appsettings,
    setup_logging,
)
from pyramid.scripts.common import parse_vars

from ..models import Base
from ..models.product import Product
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

def usage(argv):
    cmd = os.path.basename(argv[0])
    print(f'Usage: {cmd} <config_uri> [var=value]\n'
          '(example: "{cmd} development.ini")')
    sys.exit(1)

def scrape_fakestore_products():
    """Fetch products from FakeStore API"""
    try:
        print("Fetching products from FakeStore API...")
        response = requests.get('https://fakestoreapi.com/products', timeout=30)
        response.raise_for_status()
        products_data = response.json()
        
        # Limit to first 20 products
        products_data = products_data[:20]
        print(f"Successfully fetched {len(products_data)} products")
        return products_data
    except requests.RequestException as e:
        print(f"Error fetching products from FakeStore API: {e}")
        return []

def create_product_from_api_data(product_data):
    """Convert FakeStore API product data to our Product model"""
    # Map FakeStore categories to our categories
    category_mapping = {
        "men's clothing": "Men's Clothing",
        "women's clothing": "Women's Clothing", 
        "jewelery": "Jewelry",
        "electronics": "Electronics"
    }
    
    # Get rating data
    rating_data = product_data.get('rating', {})
    rating_value = rating_data.get('rate', 0.0)
    rating_count = rating_data.get('count', 0)
    
    # Create Product instance
    product = Product(
        title=product_data['title'],
        description=product_data['description'],
        price=float(product_data['price']),
        category=category_mapping.get(product_data['category'], product_data['category'].title()),
        image_url=product_data['image'],
        rating=float(rating_value),
        stock=rating_count  # Use rating count as stock for variety
    )
    
    return product

def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)
    
    engine = engine_from_config(settings, prefix='sqlalchemy.')
    
    # Ensure tables exist
    Base.metadata.create_all(engine)
    
    session_factory = sessionmaker(bind=engine)
    
    # Scrape products from FakeStore API
    products_data = scrape_fakestore_products()
    
    if not products_data:
        print("No products to add. Exiting.")
        return
    
    with transaction.manager:
        dbsession = session_factory()
        
        # Clear existing products (optional - remove this if you want to keep existing products)
        print("Clearing existing products...")
        dbsession.query(Product).delete()
        
        # Add scraped products
        added_count = 0
        for product_data in products_data:
            try:
                product = create_product_from_api_data(product_data)
                dbsession.add(product)
                added_count += 1
                print(f"Added product: {product.title}")
            except Exception as e:
                print(f"Error adding product {product_data.get('title', 'Unknown')}: {e}")
                continue
        
        print(f"Successfully added {added_count} products to the database")

if __name__ == '__main__':
    main()

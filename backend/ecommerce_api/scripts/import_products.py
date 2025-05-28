#!/usr/bin/env python3
"""
Script to scrape 20 products from FakeStore API and populate the products table.
Usage: import_products.py <config_uri> [var=value]
"""
import os
import sys

import requests
import transaction
import zope.sqlalchemy
from pyramid.paster import get_appsettings, setup_logging
from pyramid.scripts.common import parse_vars
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

from ..models import Base
from ..models.product import Product


def usage(argv):
    cmd = os.path.basename(argv[0])
    msg = (
        f"Usage: {cmd} <config_uri> [var=value]\n"
        f"Example: {cmd} development.ini"
    )
    print(msg)
    sys.exit(1)


def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])

    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)
    engine = engine_from_config(settings, prefix="sqlalchemy.")

    # Ensure tables exist
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)

    # Fetch products
    try:
        resp = requests.get("https://fakestoreapi.com/products", timeout=30)
        resp.raise_for_status()
        items = resp.json()[:20]
    except Exception as e:
        print(f"Failed to fetch products: {e}")
        sys.exit(1)

    with transaction.manager:
        db = Session()
        zope.sqlalchemy.register(db)
        # Optional: clear existing products
        db.query(Product).delete()

        count = 0
        for item in items:
            try:
                prod = Product(
                    title=item.get("title"),
                    description=item.get("description", ""),
                    price=float(item.get("price", 0)),
                    category=item.get("category", "").title(),
                    image_url=item.get("image"),
                    rating=float(item.get("rating", {}).get("rate", 0)),
                    stock=int(item.get("rating", {}).get("count", 0)),
                )
                db.add(prod)
                count += 1
            except Exception as err:
                print(f"Error adding item {item.get('title')}: {err}")
        print(f"Imported {count} products.")


if __name__ == '__main__':
    main()
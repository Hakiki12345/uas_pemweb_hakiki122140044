import os
from setuptools import setup, find_packages

requires = [
    'pyramid',
    'pyramid_jinja2',
    'pyramid_debugtoolbar',
    'pyramid_tm',
    'SQLAlchemy',
    'transaction',
    'zope.sqlalchemy',
    'waitress',
    'psycopg2-binary',  # PostgreSQL driver
    'alembic',  # Database migrations
    'marshmallow',  # Object serialization/deserialization    'PyJWT',  # JSON Web Token implementation
    'bcrypt',  # Password hashing
    'pyramid_jwt',  # JWT integration for Pyramid
    'cornice',  # REST services with built-in CORS support (replacement for pyramid_cors)
    'colander',  # Validation
    'requests',  # HTTP library for API scraping
]

tests_require = [
    'WebTest',
    'pytest',
    'pytest-cov',
]

setup(
    name='ecommerce_api',
    version='0.1',
    description='E-commerce API built with Pyramid',
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='',
    author_email='',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        'testing': tests_require,
    },
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = ecommerce_api:main',
        ],        'console_scripts': [
            'initialize_db = ecommerce_api.scripts.initialize_db:main',
            'import_products = ecommerce_api.scripts.import_products:main',
            'scrape_products = ecommerce_api.scripts.scrape_products:main',
        ],
    },
)
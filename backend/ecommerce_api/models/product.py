from sqlalchemy import Column, Integer, String, Text, Float, DateTime, func
from sqlalchemy.orm import relationship
from .base import Base

class Product(Base):
    """Product model for storing product details."""
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    image_url = Column(String(500), nullable=True)
    rating = Column(Float, default=0.0)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
      # Relationships
    order_items = relationship('OrderItem', back_populates='product')
    
    def to_dict(self):
        """Return dictionary representation of the product."""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'image': self.image_url,  # Changed from 'imageUrl' to 'image' to match frontend expectations
            'imageUrl': self.image_url,  # Keep this for backward compatibility
            'rating': {
                'rate': self.rating,  # Ensure rating matches expected structure
                'count': self.stock
            },
            'stock': self.stock,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
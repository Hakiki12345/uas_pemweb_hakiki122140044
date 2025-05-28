from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey, Enum, func, JSON
from sqlalchemy.orm import relationship
from .base import Base

class Order(Base):
    """Order model for storing order information."""
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    status = Column(Enum('processing', 'shipped', 'delivered', 'cancelled', name='order_status'), default='processing')
    subtotal = Column(Float, nullable=False)
    shipping_cost = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    shipping_address = Column(JSON, nullable=False)
    payment_method = Column(String(50), nullable=False)
    tracking_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship('User', back_populates='orders')
    items = relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Return dictionary representation of the order."""
        return {
            'id': self.id,
            'userId': self.user_id,
            'status': self.status,
            'subtotal': self.subtotal,
            'shippingCost': self.shipping_cost,
            'tax': self.tax,
            'total': self.total,
            'shippingAddress': self.shipping_address,
            'paymentMethod': self.payment_method,
            'trackingNumber': self.tracking_number,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items] if self.items else []
        }

class OrderItem(Base):
    """OrderItem model for storing items within an order."""
    __tablename__ = 'order_items'
    
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price at time of order
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    order = relationship('Order', back_populates='items')
    product = relationship('Product', back_populates='order_items')
    
    def to_dict(self):
        """Return dictionary representation of the order item."""
        return {
            'id': self.id,
            'orderId': self.order_id,
            'productId': self.product_id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'price': self.price,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }
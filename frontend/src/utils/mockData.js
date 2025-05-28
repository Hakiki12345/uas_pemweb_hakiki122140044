/**
 * Mock data generator for development and testing
 * This utility provides functions to create realistic mock data
 * for products, users, and orders
 */

/**
 * Generate a mock product
 * @param {number} id - Product ID
 * @returns {Object} Mock product data
 */
export const createMockProduct = (id) => {
  const categories = [
    "electronics",
    "clothing",
    "books",
    "home",
    "beauty",
    "sports",
  ];
  const adjectives = [
    "Premium",
    "Deluxe",
    "Essential",
    "Professional",
    "Ultimate",
    "Classic",
  ];
  const products = [
    "Headphones",
    "T-Shirt",
    "Book",
    "Lamp",
    "Cream",
    "Equipment",
  ];

  const randomPrice = Math.floor(Math.random() * 100) + 10;
  const randomRating = (Math.random() * 4 + 1).toFixed(1);
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomProduct = products[Math.floor(Math.random() * products.length)];

  return {
    id: id,
    title: `${randomAdjective} ${randomProduct}`,
    description: `This is a high-quality ${randomProduct.toLowerCase()} for everyday use. Perfect for any occasion.`,
    price: randomPrice,
    category: randomCategory,
    image: `https://picsum.photos/id/${(id % 1000) + 10}/400/400`,
    rating: {
      rate: parseFloat(randomRating),
      count: Math.floor(Math.random() * 500) + 10,
    },
  };
};

/**
 * Generate multiple mock products
 * @param {number} count - Number of products to generate
 * @returns {Array} Array of mock products
 */
export const generateMockProducts = (count = 20) => {
  return Array.from({ length: count }, (_, i) => createMockProduct(i + 1));
};

/**
 * Generate a mock user
 * @param {number} id - User ID
 * @returns {Object} Mock user data
 */
export const createMockUser = (id) => {
  const firstNames = ["John", "Jane", "David", "Sarah", "Michael", "Emily"];
  const lastNames = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Taylor"];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return {
    id: id,
    firstName: firstName,
    lastName: lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `+1-${Math.floor(Math.random() * 1000)}-${Math.floor(
      Math.random() * 1000
    )}-${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)
    ).toISOString(),
  };
};

/**
 * Generate a mock order
 * @param {number} id - Order ID
 * @param {number} userId - User ID
 * @param {Array} products - Products to include in the order
 * @returns {Object} Mock order data
 */
export const createMockOrder = (id, userId, products) => {
  const statuses = ["processing", "shipped", "delivered", "cancelled"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  // Select random products for the order
  const orderProducts = [];
  const productCount = Math.floor(Math.random() * 5) + 1;

  for (let i = 0; i < productCount; i++) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;

    orderProducts.push({
      id: randomProduct.id,
      productId: randomProduct.id,
      name: randomProduct.title,
      price: randomProduct.price,
      image: randomProduct.image,
      quantity: quantity,
    });
  }

  // Calculate order totals
  const subtotal = orderProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  return {
    id: id,
    userId: userId,
    items: orderProducts,
    status: randomStatus,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)
    ).toISOString(),
    subtotal: parseFloat(subtotal.toFixed(2)),
    shippingCost: parseFloat(shippingCost.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "USA",
    },
    paymentMethod: "Credit Card",
    trackingNumber:
      randomStatus !== "processing"
        ? `TRK${Math.floor(Math.random() * 1000000)}`
        : null,
  };
};

/**
 * Generate multiple mock orders for a user
 * @param {number} userId - User ID
 * @param {Array} products - Available products
 * @param {number} count - Number of orders to generate
 * @returns {Array} Array of mock orders
 */
export const generateMockOrders = (userId, products, count = 5) => {
  return Array.from({ length: count }, (_, i) =>
    createMockOrder(i + 1, userId, products)
  );
};

/**
 * Create a complete mock dataset
 * @returns {Object} Complete mock data set with users, products, and orders
 */
export const generateMockDataSet = () => {
  const products = generateMockProducts(30);
  const users = Array.from({ length: 5 }, (_, i) => createMockUser(i + 1));

  const orders = users.flatMap((user) =>
    generateMockOrders(user.id, products, Math.floor(Math.random() * 4) + 1)
  );

  return {
    products,
    users,
    orders,
  };
};

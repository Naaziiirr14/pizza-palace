require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Pizza = require('../models/Pizza');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

const pizzaData = [
  { name: 'Margherita Classica', description: 'San Marzano tomato, fresh mozzarella, basil, extra-virgin olive oil', price: 299, category: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80', isAvailable: true },
  { name: 'Pepperoni Royale', description: 'Double pepperoni, mozzarella, tomato sauce, oregano', price: 399, category: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80', isAvailable: true },
  { name: 'BBQ Chicken', description: 'Grilled chicken, BBQ sauce, red onion, cheddar, jalapeño', price: 449, category: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80', isAvailable: true },
  { name: 'Farmhouse Veggie', description: 'Bell peppers, mushrooms, olives, corn, onion, tomato', price: 349, category: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80', isAvailable: true },
  { name: 'Smoky Bacon Blaze', description: 'Bacon strips, caramelised onion, mozzarella, smoked cheddar', price: 479, category: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80', isAvailable: true },
  { name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, parmesan, goat cheese, honey drizzle', price: 429, category: 'Specialty', imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&q=80', isAvailable: true },
  { name: 'Spicy Paneer', description: 'Tandoori paneer, capsicum, onion, tikka sauce, coriander', price: 379, category: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80', isAvailable: true },
  { name: 'Truffle Mushroom', description: 'Wild mushrooms, truffle oil, garlic cream, parmesan, thyme', price: 519, category: 'Specialty', imageUrl: 'https://images.unsplash.com/photo-1584365685547-9a5fb6f3a70c?w=500&q=80', isAvailable: true },
  { name: 'Buffalo Wings Pizza', description: 'Spicy buffalo sauce, chicken, celery, blue cheese crumble', price: 459, category: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1548369937-47519962c11a?w=500&q=80', isAvailable: true },
  { name: 'Garden Pesto', description: 'Basil pesto, cherry tomatoes, spinach, ricotta, pine nuts', price: 399, category: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500&q=80', isAvailable: true },
  { name: 'Prawn Aglio', description: 'Garlic butter prawns, lemon zest, chilli flakes, rocket', price: 549, category: 'Specialty', imageUrl: 'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?w=500&q=80', isAvailable: true },
  { name: 'Double Cheese Burst', description: 'Cheese-filled crust, extra mozzarella, cream cheese center', price: 349, category: 'Veg', imageUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=500&q=80', isAvailable: true },
  { name: 'Diavola', description: 'Spicy salami, Calabrian chilli, black olives, fior di latte', price: 469, category: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1593246049226-ded77bf90326?w=500&q=80', isAvailable: true },
  { name: 'Capricciosa', description: 'Ham, mushrooms, artichoke hearts, olives, mozzarella', price: 449, category: 'Non-Veg', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80', isAvailable: true },
  { name: 'Burrata Bianca', description: 'White sauce, burrata, baby basil, cherry tomatoes, EVOO', price: 499, category: 'Specialty', imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80', isAvailable: false },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Pizza.deleteMany(), Order.deleteMany(), Payment.deleteMany()]);
    console.log('🗑️  Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@pizzapalace.com',
      password: 'Admin@123',
      role: 'admin',
    });

    // Create customers
    const customers = await User.create([
      { name: 'Rahul Sharma', email: 'rahul@test.com', password: 'Test@123', role: 'customer' },
      { name: 'Priya Patel', email: 'priya@test.com', password: 'Test@123', role: 'customer' },
      { name: 'Arjun Mehta', email: 'arjun@test.com', password: 'Test@123', role: 'customer' },
      { name: 'Sneha Nair', email: 'sneha@test.com', password: 'Test@123', role: 'customer' },
      { name: 'Dev Kumar', email: 'dev@test.com', password: 'Test@123', role: 'customer' },
    ]);

    // Create pizzas
    const pizzas = await Pizza.create(pizzaData);
    console.log(`🍕 Created ${pizzas.length} pizzas`);

    // Create orders & payments
    const statuses = ['Pending', 'Confirmed', 'Preparing', 'Out For Delivery', 'Delivered'];
    const orders = [];
    const payments = [];

    for (let i = 0; i < 10; i++) {
      const customer = customers[i % customers.length];
      const pizza1 = pizzas[i % pizzas.length];
      const pizza2 = pizzas[(i + 2) % pizzas.length];
      const total = pizza1.price * 2 + pizza2.price;

      const order = await Order.create({
        customerId: customer._id,
        items: [{ pizza: pizza1._id, qty: 2, price: pizza1.price }, { pizza: pizza2._id, qty: 1, price: pizza2.price }],
        totalAmount: total,
        deliveryAddress: `${10 + i} Sample Street, Bangalore 56000${i}`,
        status: statuses[i % statuses.length],
      });

      const payment = await Payment.create({
        userId: customer._id,
        orderId: order._id,
        razorpayOrderId: `order_seed_${i + 1}`,
        razorpayPaymentId: `pay_seed_${i + 1}`,
        razorpaySignature: `sig_seed_${i + 1}`,
        amount: total,
        status: 'success',
      });

      orders.push(order);
      payments.push(payment);
    }

    console.log(`📦 Created ${orders.length} orders`);
    console.log(`💳 Created ${payments.length} payments`);
    console.log('\n✅ Database seeded successfully!\n');
    console.log('Admin Login:');
    console.log('  Email:    admin@pizzapalace.com');
    console.log('  Password: Admin@123\n');
    console.log('Customer Login:');
    console.log('  Email:    rahul@test.com');
    console.log('  Password: Test@123\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDB();

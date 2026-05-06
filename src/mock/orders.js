export const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-03-20',
    total: 358.99,
    subtotal: 340.00,
    shippingFee: 15.00,
    tax: 3.99,
    status: 'Delivered',
    paymentMethod: 'Visa ending in 4242',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Tech Lane',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    trackingHistory: [
      { status: 'Order Placed', date: 'Mar 20, 2024', time: '10:30 AM', location: 'System', completed: true },
      { status: 'Processing', date: 'Mar 20, 2024', time: '02:15 PM', location: 'Warehouse', completed: true },
      { status: 'Shipped', date: 'Mar 21, 2024', time: '09:00 AM', location: 'Distribution Center', completed: true },
      { status: 'Delivered', date: 'Mar 23, 2024', time: '04:30 PM', location: 'Front Door', completed: true }
    ],
    items: [
      { id: 1, slug: 'aura-noise-canceling-headphones', name: 'Aura Noise-Canceling Headphones', quantity: 1, price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200' },
      { id: 26, slug: 'yoga-mat-pro', name: 'Yoga Mat Pro', quantity: 1, price: 59.00, image: 'https://images.unsplash.com/photo-1592432676556-2693b1299619?auto=format&fit=crop&q=80&w=200' }
    ]
  },
  {
    id: 'ORD-2024-002',
    date: '2024-04-05',
    total: 199.50,
    subtotal: 180.00,
    shippingFee: 12.00,
    tax: 7.50,
    status: 'In Transit',
    paymentMethod: 'Mastercard ending in 8888',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Tech Lane',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    trackingHistory: [
      { status: 'Order Placed', date: 'Apr 05, 2024', time: '11:00 AM', location: 'System', completed: true },
      { status: 'Processing', date: 'Apr 06, 2024', time: '08:45 AM', location: 'Warehouse', completed: true },
      { status: 'Shipped', date: 'Apr 07, 2024', time: '02:30 PM', location: 'Distribution Center', completed: true },
      { status: 'In Transit', date: 'Apr 08, 2024', time: '10:00 AM', location: 'On the way', completed: true }
    ],
    items: [
      { id: 7, slug: 'smart-watch-elite', name: 'Smart Watch Elite', quantity: 1, price: 199.50, image: 'https://images.unsplash.com/photo-1508685096489-7a689bd7f435?auto=format&fit=crop&q=80&w=200' }
    ]
  },
  {
    id: 'ORD-2024-003',
    date: '2024-04-12',
    total: 45.00,
    subtotal: 40.00,
    shippingFee: 5.00,
    tax: 0.00,
    status: 'Pending',
    paymentMethod: 'PayPal',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Tech Lane',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    trackingHistory: [
      { status: 'Order Placed', date: 'Apr 12, 2024', time: '09:00 AM', location: 'System', completed: true },
      { status: 'Pending', date: 'Apr 12, 2024', time: '09:05 AM', location: 'Payment Verification', completed: true }
    ],
    items: [
      { id: 33, slug: 'ceramic-vase-set', name: 'Ceramic Vase Set', quantity: 1, price: 45.00, image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=200' }
    ]
  }
];



export const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-03-20',
    total: 358.99,
    status: 'Delivered',
    items: [
      { id: '1', name: 'Premium Wireless Headphones', quantity: 1, price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200' },
      { id: '3', name: 'Eco-Friendly Yoga Mat', quantity: 1, price: 59.00, image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=200' }
    ]
  },
  {
    id: 'ORD-2024-002',
    date: '2024-04-05',
    total: 199.50,
    status: 'In Transit',
    items: [
      { id: '2', name: 'Minimalist Smart Watch', quantity: 1, price: 199.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200' }
    ]
  },
  {
    id: 'ORD-2024-003',
    date: '2024-04-12',
    total: 45.00,
    status: 'Pending',
    items: [
      { id: '4', name: 'Modern Ceramic Vase', quantity: 1, price: 45.00, image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=200' }
    ]
  }
];

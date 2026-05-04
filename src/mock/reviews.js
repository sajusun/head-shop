export const mockReviews = [
  {
    id: '1',
    productId: '1',
    userId: '101',
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing sound quality! The noise cancellation is top-notch.',
    date: '2024-03-15',
    replies: [
      {
        id: 'r1',
        userName: 'Admin',
        comment: 'Thank you for your feedback, John! We are glad you liked it.',
        date: '2024-03-16',
      }
    ]
  },
  {
    id: '2',
    productId: '1',
    userId: '102',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Great headphones, but the ear cups are a bit tight for long sessions.',
    date: '2024-03-10',
    replies: []
  },
  {
    id: '3',
    productId: '2',
    userId: '103',
    userName: 'Mike Johnson',
    rating: 5,
    comment: 'Very sleek design and the battery life is impressive.',
    date: '2024-03-05',
    replies: []
  }
];

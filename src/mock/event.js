const mockEvents = [
  {
    'id': '1',
    'basePrice': 2000,
    'dateFrom': new Date('February 20, 2025 03:24:00'),
    'dateTo': new Date('February 20, 2025 03:54:00'),
    'destination': 'gnv',
    'is_favourite': true,
    'offers': [
      'uber'
    ],
    'type': 'taxi'
  },
  {
    'id': '2',
    'basePrice': 1200,
    'dateFrom': new Date('February 20, 2025 10:24:00'),
    'dateTo': new Date('February 23, 2025 06:24:00'),
    'destination': 'chm',
    'is_favourite': true,
    'offers': [
      'luggage',
      'comfort'
    ],
    'type': 'ship'
  },
  {
    'id': '3',
    'basePrice': 1600,
    'dateFrom': new Date('February 22, 2025 10:24:00'),
    'dateTo': new Date('February 23, 2025 20:24:00'),
    'destination': 'amst',
    'is_favourite': false,
    'offers': [
      'rent'
    ],
    'type': 'drive'
  }
];

const mockDestinations = [
  {
    'id': 'chm',
    'description': 'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random=9',
        'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      }
    ]
  },
  {
    'id': 'amst',
    'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'name': 'Amsterdam',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random=11',
        'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.'
      }
    ]
  },
  {
    'id': 'gnv',
    'description': 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    'name': 'Geneva',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random=4',
        'description': 'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
      }
    ]
  }
];

const mockOffers = [
  {
    'type': 'taxi',
    'offers': [
      {
        'id': 'uber',
        'title': 'Order Uber',
        'price': 15
      },
      {
        'id': 'childSeat',
        'title': 'Add child seat',
        'price': 5
      }
    ]
  },
  {
    'type': 'ship',
    'offers': [
      {
        'id': 'luggage',
        'title': 'Add luggage',
        'price': 30
      },
      {
        'id': 'comfort',
        'title': 'Switch to comfort',
        'price': 60
      }
    ]
  },
  {
    'type': 'drive',
    'offers': [
      {
        'id': 'rent',
        'title': 'Rent a car',
        'price': 215
      }
    ]
  },
];

export {mockEvents, mockDestinations, mockOffers};

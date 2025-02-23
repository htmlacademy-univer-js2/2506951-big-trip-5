const mockEvents = [
  {
    'id': '1',
    'base_price': 2000,
    'date_from': new Date('February 20, 2025 03:24:00'),
    'date_to': new Date('February 20, 2025 03:54:00'),
    'destination': 'gnv',
    'is_favorite': true,
    'offers': [
      'uber'
    ],
    'type': 'taxi'
  },
  {
    'id': '2',
    'base_price': 1200,
    'date_from': new Date('February 20, 2025 10:24:00'),
    'date_to': new Date('February 23, 2025 06:24:00'),
    'destination': 'chm',
    'is_favorite': true,
    'offers': [
      'luggage',
      'comfort'
    ],
    'type': 'ship'
  },
  {
    'id': '3',
    'base_price': 1600,
    'date_from': new Date('February 22, 2025 10:24:00'),
    'date_to': new Date('February 23, 2025 20:24:00'),
    'destination': 'amst',
    'is_favorite': false,
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

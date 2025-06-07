import dayjs from 'dayjs';

function formatDate(date, format) {
  if (!date) {
    return '';
  }
  return dayjs(date).format(format);
}

function formatToDisplayString(value) {
  return`${value}`.padStart(2, '0');
}

function getDuration(dateFrom, dateTo) {
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);
  const minutes = to.diff(from, 'minute');
  const days = Math.floor(minutes / (24 * 60));
  const remainingMinutes = minutes % (24 * 60);

  const hours = Math.floor(remainingMinutes / 60);
  const finalMinutes = remainingMinutes % 60;

  const result = [];

  if (days > 0) {
    result.push(`${formatToDisplayString(days)}D`);
  }
  if (days > 0 || hours > 0) {
    result.push(`${formatToDisplayString(hours)}H`);
  }
  result.push(`${formatToDisplayString(finalMinutes)}M`);

  return result.join(' ');
}

function getEvent(type, destination) {
  return `${type } ${ destination}`;
}

function getDestination(id, destinations) {
  return destinations.find((d) => d.id === id);
}

function getEventIconUrl(type) {
  return `img/icons/${type}.png`;
}

function getTypeOffers(type, offers) {
  return offers.find((d) => d.type === type)?.offers;
}

function getOffer(id, offers) {
  return offers?.find((d) => d.id === id);
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function isEventInFuture(event) {
  return dayjs().isBefore(dayjs(event.dateFrom));
}

function isEventInPresent(event) {
  const now = dayjs();
  const from = dayjs(event.dateFrom);
  const to = dayjs(event.dateTo);
  return now.isAfter(from) && now.isBefore(to);
}

function isEventInPast(event) {
  return dayjs().isAfter(dayjs(event.dateTo));
}

function getDisabledFilters(events) {
  const hasFuture = events.some(isEventInFuture);
  const hasPresent = events.some(isEventInPresent);
  const hasPast = events.some(isEventInPast);
  const hasAny = hasFuture || hasPresent || hasPast;

  return {
    FUTURE: !hasFuture,
    PRESENT: !hasPresent,
    PAST: !hasPast,
    EVERYTHING: !hasAny
  };
}

function getTripRoute(events, destinations) {
  if (events.length === 0) {
    return '';
  }

  const sortedEvents = events.slice().sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
  const cities = sortedEvents.map((event) => {
    const destination = getDestination(event.destination, destinations);
    return destination?.name || '';
  }).filter((name) => name);

  if (cities.length <= 3) {
    return cities.join(' — ');
  }

  return `${cities[0]} — ... — ${cities[cities.length - 1]}`;
}

function getTripDates(events) {
  if (events.length === 0) {
    return '';
  }

  const sortedEvents = events.slice().sort((a, b) => dayjs(a.dateFrom).diff(dayjs(b.dateFrom)));
  const startDate = dayjs(sortedEvents[0].dateFrom);
  const endDate = dayjs(sortedEvents[sortedEvents.length - 1].dateTo);

  if (startDate.isSame(endDate, 'day')) {
    return startDate.format('DD MMM');
  }


  return `${startDate.format('DD MMM')}—${endDate.format('DD MMM')}`;
}

function getTripCost(events, offers) {
  if (events.length === 0) {
    return 0;
  }

  return events.reduce((total, event) => {
    let eventCost = event.basePrice;

    if (event.offers?.length > 0) {
      const typeOffers = getTypeOffers(event.type, offers);
      eventCost += event.offers.reduce((offerTotal, offerId) => {
        const offer = getOffer(offerId, typeOffers);
        return offerTotal + (offer?.price || 0);
      }, 0);
    }

    return total + eventCost;
  }, 0);
}

export {
  formatDate,
  getDuration,
  getEvent,
  getDestination,
  getEventIconUrl,
  getTypeOffers,
  getOffer,
  updateItem,
  isEventInFuture,
  isEventInPresent,
  isEventInPast,
  getDisabledFilters,
  getTripRoute,
  getTripDates,
  getTripCost
};

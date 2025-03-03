import dayjs from 'dayjs';

function formatDate(date, format) {
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
  if (hours > 0) {
    result.push(`${formatToDisplayString(hours)}H`);
  }
  if (finalMinutes > 0) {
    result.push(`${formatToDisplayString(finalMinutes)}M`);
  }

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

export {formatDate, getDuration, getEvent, getDestination, getEventIconUrl, getTypeOffers, getOffer};

import {mockDestinations, mockEvents, mockOffers} from '../mock/event';

export default class EventsModel {
  getEvents() {
    return [...mockEvents];
  }

  getDestinations() {
    return [...mockDestinations];
  }

  getOffers() {
    return [...mockOffers];
  }
}

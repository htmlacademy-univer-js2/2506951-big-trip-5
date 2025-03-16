import {mockDestinations, mockEvents, mockOffers} from '../mock/event';

export default class EventsModel {
  get events() {
    return [...mockEvents];
  }

  get destinations() {
    return [...mockDestinations];
  }

  get offers() {
    return [...mockOffers];
  }
}

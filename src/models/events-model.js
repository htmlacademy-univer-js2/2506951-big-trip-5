import {mockDestinations, mockEvents, mockOffers} from '../mock/event';

export default class EventsModel {
  constructor() {
    this._events = [...mockEvents];
    this._destinations = [...mockDestinations];
    this._offers = [...mockOffers];
  }

  get events() {
    return [...this._events];
  }

  get destinations() {
    return [...this._destinations];
  }

  get offers() {
    return [...this._offers];
  }

  setEvents(events) {
    this._events = [...events];
  }

  updateEvent(updatedEvent) {
    const index = this._events.findIndex((event) => event.id === updatedEvent.id);
    if (index === -1) {
      return;
    }
    this._events.splice(index, 1, updatedEvent);
  }

  deleteEvent(eventId) {
    const index = this._events.findIndex((event) => event.id === eventId);
    if (index === -1) {
      throw new Error('Cannot delete nonexistent event');
    }
    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];
  }

  addEvent(newEvent) {
    this._events = [newEvent, ...this._events];
  }
}

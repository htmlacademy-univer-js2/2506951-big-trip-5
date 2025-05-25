import Observable from '../framework/observable.js';
import {adaptEventToClient} from '../utils/adapter.js';
import {UpdateType} from '../utils/const.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];
  #destinations = [];
  #offers = [];

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  get events() {
    return this.#events;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const [events, destinations, offers] = await Promise.all([
        this.#eventsApiService.events,
        this.#eventsApiService.destinations,
        this.#eventsApiService.offers
      ]);

      this.#events = events.map(adaptEventToClient);
      this.#destinations = destinations;
      this.#offers = offers;
    } catch (err) {
      this.#events = [];
      this.#destinations = [];
      this.#offers = [];
      this._notify(UpdateType.ERROR, null);
      return;
    }

    this._notify(UpdateType.INIT, null);
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Cannot update event');
    }

    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = adaptEventToClient(response);

      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1),
      ];

      this._notify(updateType, updatedEvent);
    } catch (err) {
      throw new Error('Cannot update event');
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = adaptEventToClient(response);

      this.#events = [newEvent, ...this.#events];

      this._notify(updateType, newEvent);
    } catch (err) {
      throw new Error('Cannot add event');
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Cannot delete event');
    }

    try {
      await this.#eventsApiService.deleteEvent(update);

      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1),
      ];

      this._notify(updateType, null);
    } catch (err) {
      throw new Error('Cannot delete event');
    }
  }
}

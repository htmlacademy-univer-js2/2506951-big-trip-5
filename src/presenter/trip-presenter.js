import {render} from '../framework/render';
import EventList from '../view/event-list';
import Filters from '../view/filters';
import Sorting from '../view/sorting';
import EventPresenter from './event-presenter';
import {updateItem} from '../utils/utils';

export default class TripPresenter {
  #eventListComponent = new EventList();
  #sortingComponent = null;
  #eventsContainer = document.querySelector('.trip-events');
  #filterContainer = document.querySelector('.trip-controls__filters');
  #eventsModel = null;
  #events = null;
  #currentSortType = 'day';
  #destinations = null;
  #offers = null;
  #eventPresenters = new Map();
  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearEvents();
    const sortedEvents = this.#getSortedEvents(sortType);
    this.#renderEventsList(sortedEvents);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((event) => event.resetView());
  };

  constructor({eventsModel}) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = this.#eventsModel.events;
    this.#destinations = this.#eventsModel.destinations;
    this.#offers = this.#eventsModel.offers;

    render(new Filters(), this.#filterContainer);
    this.#sortingComponent = new Sorting({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortingComponent, this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    this.#renderEventsList(this.#events);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      destinations: this.#destinations,
      offers:this.#offers,
      eventListComponent: this.#eventListComponent,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEventsList(events) {
    events.forEach((event) => this.#renderEvent(event));
  }

  #clearEvents() {
    this.#eventPresenters.forEach((presenter) => presenter.remove());
    this.#eventPresenters.clear();
  }

  #getSortedEvents(sortType) {
    const eventsCopy = [...this.#events];
    switch (sortType) {
      case 'day':
        return eventsCopy.sort((a, b) => a.dateFrom - b.dateFrom);
      case 'time':
        return eventsCopy.sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
      case 'price':
        return eventsCopy.sort((a, b) => b.basePrice - a.basePrice);
      default:
        return eventsCopy;
    }
  }
}

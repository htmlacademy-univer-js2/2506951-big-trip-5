import {render} from '../framework/render';
import EventList from '../view/event-list';
import Filters from '../view/filters';
import Sorting from '../view/sorting';
import EventPresenter from './event-presenter';
import {updateItem} from '../utils/utils';

export default class Presenter {
  #eventListComponent = new EventList();
  #eventsContainer = document.querySelector('.trip-events');
  #filterContainer = document.querySelector('.trip-controls__filters');
  #eventsModel = null;
  #events = null;
  #destinations = null;
  #offers = null;
  #eventPresenters = new Map();
  #handleEventChange = (updatedEvent) => {
    this.#events = updateItem(this.#events, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
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
    render(new Sorting(), this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    for (let i = 0; i < this.#events.length; i++) {
      this.#renderEvent(this.#events[i]);
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      destinations:this.#eventsModel.destinations,
      offers:this.#offers,
      eventListComponent: this.#eventListComponent,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }
}

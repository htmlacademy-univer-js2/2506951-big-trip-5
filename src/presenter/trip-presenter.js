import {render, remove} from '../framework/render';
import EventList from '../view/event-list';
import Sorting from '../view/sorting';
import EventPresenter from './event-presenter';
import NoEventsView from '../view/no-events-view';
import {UpdateType} from '../models/filter-model';
import {ACTION_TYPE} from '../utils/const';
import {FilterType} from '../models/filter-model';

export default class TripPresenter {
  #eventListComponent = new EventList();
  #sortingComponent = null;
  #eventsContainer = document.querySelector('.trip-events');
  #newEventButton = document.querySelector('.trip-main__event-add-btn');
  #newEventPresenter = null;
  #eventsModel = null;
  #filterModel = null;
  #events = null;
  #currentSortType = 'day';
  #destinations = null;
  #offers = null;
  #eventPresenters = new Map();
  #noEventsComponent = null;

  constructor({eventsModel, filterModel}) {
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
  }

  #handleViewAction = (actionType, payload) => {
    switch (actionType) {
      case ACTION_TYPE.UPDATE_EVENT:
        this.#eventsModel.updateEvent(payload);
        break;
      case ACTION_TYPE.DELETE_EVENT:
        this.#eventsModel.deleteEvent(payload.id);
        break;
      case ACTION_TYPE.ADD_EVENT:
        this.#eventsModel.addEvent(payload);
        break;
      default:
        return;
    }
    this.#currentSortType = 'day';
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((event) => event.resetView());
    this.#newEventPresenter?.remove();
    this.#newEventPresenter = null;
    this.#newEventButton.disabled = false;
  };

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.FILTER) {
      this.#currentSortType = 'day';
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  init() {
    this.#events = this.#eventsModel.events;
    this.#destinations = this.#eventsModel.destinations;
    this.#offers = this.#eventsModel.offers;

    this.#sortingComponent = new Sorting({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortingComponent, this.#eventsContainer);
    this.#newEventButton.disabled = false;
    this.#renderBoard();
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      destinations: this.#destinations,
      offers:this.#offers,
      eventListComponent: this.#eventListComponent,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEventsList(events) {
    events.forEach((event) => this.#renderEvent(event));
  }

  #clearBoard() {
    this.#eventPresenters.forEach((presenter) => presenter.remove());
    this.#eventPresenters.clear();
    if (this.#noEventsComponent) {
      remove(this.#noEventsComponent);
      this.#noEventsComponent = null;
    }
  }

  #getEvents() {
    const events = this.#eventsModel.events;
    const filterType = this.#filterModel.filter;
    const now = Date.now();
    switch (filterType) {
      case 'future':
        return events.filter((event) => event.dateFrom > now);
      case 'present':
        return events.filter((event) => event.dateFrom <= now && event.dateTo >= now);
      case 'past':
        return events.filter((event) => event.dateTo < now);
      default:
        return events;
    }
  }

  #sortEvents(events, sortType) {
    switch (sortType) {
      case 'day':
        return [...events].sort((a, b) => a.dateFrom - b.dateFrom);
      case 'time':
        return [...events].sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
      case 'price':
        return [...events].sort((a, b) => b.basePrice - a.basePrice);
      default:
        return events;
    }
  }

  #renderBoard() {
    const events = this.#getEvents();
    if (events.length === 0) {
      this.#noEventsComponent = new NoEventsView(this.#filterModel.filter);
      render(this.#noEventsComponent, this.#eventsContainer);
      return;
    }
    render(this.#eventListComponent, this.#eventsContainer);
    const sortedEvents = this.#sortEvents(events, this.#currentSortType);
    this.#renderEventsList(sortedEvents);
  }

  #handleNewEventButtonClick = (evt) => {
    evt.preventDefault();
    if (this.#newEventPresenter) {
      return;
    }
    this.#currentSortType = 'day';
    this.#filterModel.setFilter(UpdateType.FILTER, FilterType.EVERYTHING);
    this.#handleModeChange();
    const blankEvent = {
      id: String(Date.now()),
      basePrice: 0,
      dateFrom: new Date(),
      dateTo: new Date(),
      destination: '',
      isFavorite: false,
      type: 'flight',
      offers: []
    };
    this.#newEventPresenter = new EventPresenter({
      destinations: this.#destinations,
      offers: this.#offers,
      eventListComponent: this.#eventListComponent,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onDestroy: () => {
        this.#newEventPresenter = null;
        this.#newEventButton.disabled = false;
      }
    });
    this.#newEventPresenter.init(blankEvent, true);
    this.#newEventButton.disabled = true;
  };
}

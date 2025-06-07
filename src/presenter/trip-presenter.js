import {render, remove} from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortingView from '../view/sorting-view.js';
import EventPresenter from './event-presenter.js';
import NoEventsView from '../view/no-events-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import {UpdateType, ActionType} from '../utils/const.js';
import {FilterType} from '../models/filter-model.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TIMEOUT_LOWER_LIMIT = 350;
const TIMEOUT_UPPER_LIMIT = 1000;

export default class TripPresenter {
  #eventListComponent = new EventListView();
  #loadingComponent = new LoadingView();
  #sortingComponent = null;
  #eventsContainer = document.querySelector('.trip-events');
  #newEventButton = document.querySelector('.trip-main__event-add-btn');
  #newEventPresenter = null;
  #eventsModel = null;
  #filterModel = null;
  #currentSortType = 'day';
  #destinations = null;
  #offers = null;
  #eventPresenters = new Map();
  #noEventsComponent = null;
  #errorComponent = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TIMEOUT_LOWER_LIMIT,
    upperLimit: TIMEOUT_UPPER_LIMIT,
  });

  constructor({eventsModel, filterModel}) {
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
  }

  async init() {
    this.#renderLoading();
    await this.#eventsModel.init();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer);
  }

  #renderError() {
    this.#errorComponent = new ErrorView();
    render(this.#errorComponent, this.#eventsContainer);
  }

  #handleViewAction = async (actionType, updateType, payload) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case ActionType.UPDATE_EVENT:
        this.#eventPresenters.get(payload.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, payload);
          this.#handleSortTypeChange('day', true);
        } catch {
          this.#eventPresenters.get(payload.id).setAborting();
        }
        break;
      case ActionType.DELETE_EVENT:
        this.#eventPresenters.get(payload.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, payload);
        } catch {
          this.#eventPresenters.get(payload.id).setAborting();
        }
        break;
      case ActionType.ADD_EVENT:
        if (this.#newEventPresenter) {
          this.#newEventPresenter.setSaving();
        }
        try {
          await this.#eventsModel.addEvent(updateType, payload);
          this.#newEventButton.disabled = false;
          this.#newEventPresenter.destroy();
          this.#handleSortTypeChange('day', true);
          this.#newEventPresenter = null;
        } catch {
          if (this.#newEventPresenter) {
            this.#newEventPresenter.setAborting();
          }
        }
        break;
      default:
        return;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#eventPresenters.has(data.id)) {
          const presenter = this.#eventPresenters.get(data.id);
          presenter.init(data);
          setTimeout(() => presenter.resetView(), 0);
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderError();
        break;
    }
  };

  #handleSortTypeChange = (sortType, force = false) => {
    if (this.#currentSortType === sortType && !force) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((event) => event.resetView());
    this.#newEventPresenter?.destroy();
    this.#newEventPresenter = null;
    this.#newEventButton.disabled = false;
  };

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      destinations: this.#destinations,
      offers: this.#offers,
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

  #clearBoard({resetSortType = false} = {}) {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    if (resetSortType) {
      this.#currentSortType = 'day';
    }
    remove(this.#sortingComponent);
    remove(this.#noEventsComponent);
    remove(this.#errorComponent);
  }

  #getEvents() {
    const events = this.#eventsModel.events;
    const filterType = this.#filterModel.filter;
    const now = new Date();

    switch (filterType) {
      case FilterType.FUTURE:
        return events.filter((event) => event.dateFrom > now);
      case FilterType.PRESENT:
        return events.filter((event) => event.dateFrom <= now && event.dateTo >= now);
      case FilterType.PAST:
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
    if (this.#isLoading) {
      return;
    }

    this.#destinations = this.#eventsModel.destinations;
    this.#offers = this.#eventsModel.offers;

    const events = this.#getEvents();
    const hasData = this.#destinations.length > 0 && this.#offers.length > 0;

    this.#newEventButton.disabled = !hasData;

    if (events.length === 0 && !this.#newEventPresenter) {
      this.#noEventsComponent = new NoEventsView(this.#filterModel.filter);
      render(this.#noEventsComponent, this.#eventsContainer);
      return;
    }

    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortingComponent, this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    const sortedEvents = this.#sortEvents(events, this.#currentSortType);
    this.#renderEventsList(sortedEvents);
  }

  #handleNewEventButtonClick = (evt) => {
    evt.preventDefault();

    if (!this.#destinations.length || !this.#offers.length) {
      return;
    }

    const wasEmpty = this.#getEvents().length === 0;

    this.#currentSortType = 'day';
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#handleModeChange();

    if (wasEmpty) {
      remove(this.#noEventsComponent);
      remove(this.#errorComponent);
      this.#sortingComponent = new SortingView({
        onSortTypeChange: this.#handleSortTypeChange,
        currentSortType: this.#currentSortType
      });
      render(this.#sortingComponent, this.#eventsContainer);
      render(this.#eventListComponent, this.#eventsContainer);
    }

    const blankEvent = {
      basePrice: 0,
      dateFrom: null,
      dateTo: null,
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
        if (wasEmpty && this.#getEvents().length === 0) {
          this.#clearBoard();
          this.#renderBoard();
        }
      }
    });
    this.#newEventPresenter.init(blankEvent, true);
    this.#newEventButton.disabled = true;
  };
}

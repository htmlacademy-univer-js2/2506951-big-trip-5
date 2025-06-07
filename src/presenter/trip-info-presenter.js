import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import {getTripRoute, getTripDates, getTripCost} from '../utils/utils.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #eventsModel = null;
  #tripInfoComponent = null;

  constructor({tripInfoContainer, eventsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const prevComponent = this.#tripInfoComponent;
    const events = this.#eventsModel.events;
    const destinations = this.#eventsModel.destinations;
    const offers = this.#eventsModel.offers;

    if (events.length === 0) {
      if (prevComponent !== null) {
        remove(prevComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const route = getTripRoute(events, destinations);
    const dates = getTripDates(events);
    const cost = getTripCost(events, offers);

    this.#tripInfoComponent = new TripInfoView(route, dates, cost);

    if (prevComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevComponent);
    remove(prevComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}

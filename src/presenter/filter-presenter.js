import {render, replace, remove} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import {UpdateType} from '../utils/const.js';
import {getDisabledFilters} from '../utils/utils.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #eventsModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, eventsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const prevComponent = this.#filterComponent;
    const currentFilter = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const disabledFilters = getDisabledFilters(events);

    this.#filterComponent = new FiltersView({
      currentFilter: currentFilter,
      disabledFilters: disabledFilters,
      onFilterChange: this.#handleFilterChange
    });

    if (prevComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }
    replace(this.#filterComponent, prevComponent);
    remove(prevComponent);
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}

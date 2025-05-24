import {render, replace, remove} from '../framework/render';
import FiltersView from '../view/filters';
import {UpdateType} from '../models/filter-model';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const prevComponent = this.#filterComponent;
    const currentFilter = this.#filterModel.filter;
    this.#filterComponent = new FiltersView({
      currentFilter: currentFilter,
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
    this.#filterModel.setFilter(UpdateType.FILTER, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}

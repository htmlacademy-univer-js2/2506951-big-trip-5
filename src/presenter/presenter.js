import {render} from '../render';
import EventItem from '../view/event-item';
import EventList from '../view/event-list';
import Filters from '../view/filters';
import Sorting from '../view/sorting';
import EditForm from '../view/form-edit';

export default class Presenter {
  eventListComponent = new EventList();
  eventsContainer = document.querySelector('.trip-events');
  filterContainer = document.querySelector('.trip-controls__filters');

  constructor({eventsModel}) {
    this.eventsModel = eventsModel;
  }

  init() {
    this.events = this.eventsModel.getEvents();
    this.destinations = this.eventsModel.getDestinations();
    this.offers = this.eventsModel.getOffers();

    render(new Filters(), this.filterContainer);
    render(new Sorting(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);
    render(new EditForm({event:this.events[0], destinations: this.destinations, offers: this.offers}), this.eventListComponent.getElement());

    for (let i = 1; i < this.events.length; i++) {
      render(new EventItem({event:this.events[i], destinations: this.destinations, offers: this.offers}), this.eventListComponent.getElement());
    }
  }
}

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

  init() {
    render(new Filters(), this.filterContainer);
    render(new Sorting(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);
    render(new EditForm(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventItem(), this.eventListComponent.getElement());
    }
  }
}

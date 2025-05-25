import ApiService from '../framework/api-service.js';
import {adaptEventToServer} from '../utils/adapter.js';

const METHOD = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class EventsApiService extends ApiService {
  get events() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(adaptEventToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async addEvent(event) {
    const response = await this._load({
      url: 'points',
      method: METHOD.POST,
      body: JSON.stringify(adaptEventToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async deleteEvent(event) {
    return await this._load({
      url: `points/${event.id}`,
      method: METHOD.DELETE,
    });
  }
}

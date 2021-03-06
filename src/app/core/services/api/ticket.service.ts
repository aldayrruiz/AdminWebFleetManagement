import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateTicket, Ticket, TicketStatus } from '../../models';
import { API } from '../../utils/api-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private ticketURL = `${environment.fleetBaseUrl}${API.tickets}`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a GET HTTP request to the server to get a list of tickets.
   */
  getAll(): Observable<Ticket[]> {
    const options = { params: new HttpParams().set('takeAll', true) };
    const path = `${this.ticketURL}/`;
    return this.http.get<Ticket[]>(path, options);
  }

  /**
   * Sends a GET HTTP request to the server to get a ticket given an identifier.
   *
   * @param id identifier of the ticket to get.
   */
  get(id: string): Observable<Ticket> {
    const path = `${this.ticketURL}/${id}/`;
    return this.http.get<Ticket>(path);
  }

  /**
   * Send a POST HTTP request to the server to store the given ticket data.
   *
   * @param ticket data of the ticket to store.
   */
  create(ticket: CreateTicket): Observable<CreateTicket> {
    const path = `${this.ticketURL}/`;
    return this.http.post<CreateTicket>(path, ticket);
  }

  /**
   * Send an PUT HTTP request to the server to solve (update) the ticket.
   *
   * @param id of the ticket to solve
   * @param newStatus of the ticket
   * @returns Just an observable
   */
  solve(id: string, newStatus: TicketStatus): Observable<void> {
    const path = `${this.ticketURL}/${id}/`;

    const data = {
      new_status: newStatus,
    };

    return this.http.put<void>(path, data);
  }
}

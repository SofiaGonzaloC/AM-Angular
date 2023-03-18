import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
// import { User } from '../interfaces/User';

interface User {
  name: string,
  birthdate: string,
  email: string,
  phone: string,
  signature: string
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _endpoints = {
    user: '/user',
  };

  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService
  ) { }

  /**
   * Method to create a new user in MongoDB
   * 
   * @param name 
   * @param birthdate 
   * @param email 
   * @param phone 
   * @param signature 
   */
  public postUser(user: User): Observable<User | null> {
    if (user) {
      const url = `${this.configurationService.apiBaseUrl}${this._endpoints.user}/new`;
      const data = user;

      return this.http.post<User | null>(url, data)
    } else {
      return of(null)
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    url = 'https://api.openweathermap.org/data/2.5/onecall';
    API_KEY = 'a177871e290d801946dd011d1edb62a8';

    constructor(private http: HttpClient) {}

    fetchWeatherData(lat: number, lon: number): Observable<any> {
        return this.http.get(
            `${this.url}?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${this.API_KEY}`
        );
    }

}

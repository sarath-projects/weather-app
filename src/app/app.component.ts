import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import cities from 'src/assets/data/cities/cities.json';
import { WeatherService } from './services/weather.service';

type PageLoadStatus = 'LOADING' | 'COMPLETED';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    cityList: string[];
    selectedCity = 'Bangalore';
    cityDetails: any;
    currentWeatherData: any;
    dailyWeatherData: any[] = [];
    currentTime;
    today = moment().format('MMMM Do YYYY');
    pageLoadStatus: PageLoadStatus = 'LOADING';

    // Chart Data
    lineChartOptions: ChartOptions = {
        responsive: true,
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: 'white',
                },
                gridLines: {
                    color: 'rgba(0, 0, 0, 0)'
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: 'white'
                },
                gridLines: {
                    color: 'rgba(0, 0, 0, 0)'
                }
            }]
        }
    };
    lineChartColors: Color[] = [
        {
            borderColor: '#ffffff'
        }
    ];
    lineChartData: ChartDataSets[] = [
        { data: [] },
    ];
    lineChartLabels: Label[] = [];

    constructor(private weatherService: WeatherService) {
        setInterval(() => {
            this.currentTime = moment().format('hh:mm:ss A');
        }, 1000);
    }

    ngOnInit() {
        this.cityList = cities.map((city => city.name));
        this.fetchWetherData();
    }

    fetchWetherData() {
        this.pageLoadStatus = 'LOADING';
        this.dailyWeatherData = [];
        this.lineChartLabels = [];
        this.lineChartData[0].data = [];
        cities.forEach((city) => {
            if (city.name === this.selectedCity) {
                this.cityDetails = city;
            }
        });
        this.weatherService.fetchWeatherData(this.cityDetails.lat, this.cityDetails.lon).subscribe((data) => {
            const { current, daily, hourly } = data;
            this.currentWeatherData = {
                temp: current.temp,
                pressure: current.pressure,
                windSpeed: current.wind_speed,
                humidity: current.humidity,
                sunrise: this.formatToHour(current.sunrise),
                sunset: this.formatToHour(current.sunset),
                day: this.formatToDay(current.dt),
                date: moment(current.dt * 1000).format('MMMM Do YYYY, HH:mm:ss A'),
                desc: current.weather[0].main,
                icon: `http://openweathermap.org/img/wn/${current.weather[0].icon}.png`
            };
            daily.forEach((day) => {
                this.dailyWeatherData.push({
                    temp_day: day.temp.day,
                    temp_night: day.temp.night,
                    temp_min: day.temp.min,
                    temp_max: day.temp.max,
                    pressure: day.pressure,
                    windSpeed: day.wind_speed,
                    humidity: day.humidity,
                    sunrise: this.formatToHour(day.sunrise),
                    sunset: this.formatToHour(day.sunset),
                    day: this.formatToDay(day.dt),
                    date: moment(day.dt * 1000).format('MMMM Do YYYY, HH:mm:ss'),
                    desc: day.weather[0].main,
                    icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`
                });
            });
            hourly.slice(24).forEach((hour) => {
                this.lineChartLabels.push((this.formatToHour(hour.dt)));
                this.lineChartData[0].data.push(hour.temp);
            });
            this.pageLoadStatus = 'COMPLETED';
        });
    }

    formatToHour(date) {
        return moment(date * 1000).format('HH:mm');
    }

    formatToDay(date) {
        return moment(date * 1000).format('dddd');
    }

}

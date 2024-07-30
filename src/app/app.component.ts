import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Ion, Viewer, Cartesian3, Color } from 'cesium';
import { map, Observable, startWith } from 'rxjs';

declare const window;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'angular-cesium';

  @ViewChild('cesium') cesium: ElementRef;

  autocompleteControl = new FormControl();


  height = 5000;

  cities = [
    { name: 'Магнитогорск', coords: Cartesian3.fromDegrees(59.04722, 53.41861, this.height) },
    { name: 'Москва', coords: Cartesian3.fromDegrees(37.6172, 55.7558, this.height) },
    { name: 'Новосибирск', coords: Cartesian3.fromDegrees(82.9500, 55.0500, this.height) },
    { name: 'Нижний Новгород', coords: Cartesian3.fromDegrees(44.0075, 56.3269, this.height) },
    { name: 'Красноярск', coords: Cartesian3.fromDegrees(92.8719, 56.0089, this.height) }
  ]

  filteredCities: Observable<any>;

  viewer;

  // *********
  ngOnInit(): void {
    this.filteredCities = this.autocompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterInput(value)),
    )
  }

  filterInput(value) {
    const filtervalue = value.toLocaleLowerCase();

    return this.cities.filter(c => c.name.toLocaleLowerCase().includes(filtervalue));
  }


  ngAfterViewInit(): void {
    this.runCesium();
  }
  runCesium() {
    window.CESIUM_BASE_URL = 'assets/Cesium/';
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwN2JlNzYxOC0yMmVhLTQ5OGYtODIyMi1jN2NlZWNlZjNlMjEiLCJpZCI6MjMxMDAxLCJpYXQiOjE3MjIwMTEzOTZ9.W34SFx84Y2LiWSAWa59RLprvRTBQdBq0iGuLA7tkIpc';

    this.viewer = new Viewer(this.cesium.nativeElement);

    this.cities.forEach(c => {
      this.viewer.entities.add({
        name: c.name,
        position: c.coords,
        point: {
          pixelSize: 10,
          color: Color.RED
        }
      })
    })
  }

  flyTo(coords) {
    this.viewer.camera.flyTo({
      destination: coords,

    });
  }

  // ******
  handleKeydown(event) {
    if (event.key === 'Enter') {
      let v = this.autocompleteControl.value;
      let city = this.cities.find(c=>c.name.toLocaleLowerCase() === v.toLocaleLowerCase());
      let coords = city.coords;
      this.flyTo(coords);
    }
  }
}



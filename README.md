#Leaflet Routing Machine / Google Directions API

Extends [Leaflet Routing Machine](https://github.com/perliedman/leaflet-routing-machine) with support for [Google Directions API](https://developers.google.com/maps/documentation/directions/intro).

For more information on the use of this router, the [Leaflet Routing Machine tutorial on alternative routers](http://www.liedman.net/leaflet-routing-machine/tutorials/alternative-routers/) is recommended.

## Installing

Use npm to install the lrm-google-router package.

```sh
npm install --save lrm-google-router
```

## Using lrm-google-router

You will need a valid Google Directions API in order to use this router.

Basic Usage:

```javascript
L.Routing.control({
  waypoints: [
    L.latLng(1.350794, 103.835950),
    L.latLng(1.392755, 103.913670)
  ],
  router: new L.Routing.Google(),
  lineOptions: {
        styles: [
            {color: 'black', opacity: 0.3, weight: 11},
            {color: 'white', opacity: 0.9, weight: 9},
            {color: 'blue', opacity: 1, weight: 3}
        ]
    }
}).addTo(map);
```

Specifying custom routing options (See the [Directions Service API](https://developers.google.com/maps/documentation/javascript/directions) for more details):

```javascript
L.Routing.control({
  waypoints: [
    L.latLng(1.350794, 103.835950),
    L.latLng(1.392755, 103.913670)
  ],
  router: new L.Routing.Google({
    travelMode: google.maps.TravelMode.TRANSIT,
    unitSystem: google.maps.UnitSystem.METRIC,
    provideRouteAlternatives: true
  }),
  lineOptions: {
        styles: [
            {color: 'black', opacity: 0.3, weight: 11},
            {color: 'white', opacity: 0.9, weight: 9},
            {color: 'blue', opacity: 1, weight: 3}
        ]
    }
}).addTo(map);
```

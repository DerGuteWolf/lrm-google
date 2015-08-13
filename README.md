#Leaflet Routing Machine / Google Directions API

Extends [Leaflet Routing Machine](https://github.com/perliedman/leaflet-routing-machine) with support for [Google Directions API](https://developers.google.com/maps/documentation/directions/intro).

For more information on the use of this router, the [Leaflet Routing Machine tutorial on alternative routers](http://www.liedman.net/leaflet-routing-machine/tutorials/alternative-routers/) is recommended.

## Installing lrm-graphhopper

Use Bower to install the lrm-google package.

```sh
bower install --save lrm-google
```

Include the appropriate javascript dependencies in your html file.

```html
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<YOUR GOOGLE DIRECTIONS API KEY HERE>"></script>
<script src="bower_components/lrm-google/lrm-google.js"></script>
```

## Using lrm-google

You will need a valid Google Directions API in order to use this router.

Basic Usage:

```javascript
L.Routing.control({
  waypoints: [
    L.latLng(1.350794, 103.835950),
    L.latLng(1.392755, 103.913670)
  ],
  router: L.Routing.google(),
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
  router: L.Routing.google({
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

##Demo

See the [Demo](http://kahkhang.github.io/lrm-google/) for an example of usage.

##Known issues

The displayed icons of instruction steps do not correspond to the direction of the instruction (Working on that).
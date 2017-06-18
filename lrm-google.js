L.Routing = L.Routing || {};
L.Routing.Google = L.Class.extend({
    options: {},
    initialize: function(options) {
        this.options =  L.extend(this.options, {
           travelMode: google.maps.TravelMode.DRIVING,
           unitSystem: google.maps.UnitSystem.METRIC,
           provideRouteAlternatives: true
        });
        this.directionsService = new google.maps.DirectionsService();
        L.Util.setOptions(this, options);
    },
    _flatten: function(arrs) {
        var arr = [],
            i;
        for (i = 0; i < arrs.length; i++) arr = arr.concat(arrs[i]);
        return arr;
    },
    _decodePolyline: function(geometry) {
            var coords = polyline.decode(geometry, 5),
                latlngs = new Array(coords.length),
                i;
            for (i = 0; i < coords.length; i++) {
                latlngs[i] = new L.LatLng(coords[i][0], coords[i][1]);
            }

            return latlngs;
        },
    _maneuverToInstructionType: function(maneuver) {
        switch (maneuver) {
            case 'turn-right':
                return 'Right';
            case 'turn-slight-right':
            case 'ramp-right':
            case 'fork-right':
                return 'SlightRight';
            case 'turn-sharp-right':
                return 'SharpRight';
            case 'turn-left':
                return 'Left';
            case 'turn-slight-left':
            case 'ramp-left':
            case 'fork-left':
                return 'SlightLeft';
            case 'turn-sharp-left':
                return 'SharpLeft';
            case 'uturn-right':
            case 'uturn-left':
                return 'TurnAround';
            case 'roundabout-left':
            case 'roundabout-right':
                return 'Roundabout';
            default:
                return 'Straight';
        }
    },
    route: function(waypoints, callback, context, options) {
        var that = this;
        var directions =  L.extend({}, this.options);
        if (options.geometryOnly) {
            directions.provideRouteAlternatives = false;
        }
        directions.origin = waypoints[0].latLng.lat + ',' + waypoints[0].latLng.lng;
        directions.destination = waypoints[waypoints.length - 1].latLng.lat + ',' + waypoints[waypoints.length - 1].latLng.lng;
        directions.waypoints =
            waypoints.slice(1, waypoints.length - 1).map(function(waypoint) {
                return {
                    location: waypoint.latLng.lat + ',' + waypoint.latLng.lng,
                    stopover: false
                };
            });

        this.directionsService.route(directions, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                r = result.routes.map(function(route) {
                    var iroute = {}, i, j, step;
                    iroute.name = route.summary;
                    iroute.summary = {
                        totalDistance: that._flatten(route.legs.map(function(leg) {
                            return leg.steps.map(function(step) {
                                return step.distance.value;
                            });
                        })).reduce(function(previousValue, currentValue) {
                            return previousValue + currentValue;
                        }),
                        totalTime: that._flatten(route.legs.map(function(leg) {
                            return leg.steps.map(function(step) {
                                return step.duration.value;
                            });
                        })).reduce(function(previousValue, currentValue) {
                            return previousValue + currentValue;
                        })
                    };

                    iroute.coordinates = [];
                    var indices = [], indicesSecondary = [];

                    var waypointIndices = [0];
                    var nWaypoint = 1;

                    for(i = 0; i < route.legs.length; i++){
                        indicesSecondary = [];
                        var stepsPoints = [];

                        for(j = 0; j < route.legs[i].steps.length; j++){
                            step = route.legs[i].steps[j];
                            points = that._decodePolyline(step.polyline.points);
                            stepsPoints[j] = points.length;
                            indicesSecondary.push(iroute.coordinates.length);
                            iroute.coordinates = iroute.coordinates.concat(points);
                        }
                        indices.push(indicesSecondary);

                        for (var j = 0; j < route.legs[i].via_waypoints.length; j++) {
                            si = route.legs[i].via_waypoint[j].step_index;
                            sp = route.legs[i].via_waypoint[j].step_interpolation;

                            waypointIndices[nWaypoint] = indicesSecondary[si] + Math.floor(stepsPoints[si]*sp);
                            nWaypoint++;
                        }
                    }

                    iroute.inputWaypoints = waypoints || [];
                    iroute.waypoints = iroute.actualWaypoints = waypoints;

                    waypointIndices[nWaypoint] = iroute.coordinates.length - 1;
                    iroute.waypointIndices = waypointIndices;

                    if (!options.geometryOnly) {
                        iroute.instructions = [];
                        for(i = 0; i < route.legs.length; i++)
                            for(j = 0; j < route.legs[i].steps.length; j++){
                                step = route.legs[i].steps[j];
                                iroute.instructions.push({
                                    type: that._maneuverToInstructionType(step.maneuver),
                                    text: step.instructions.replace(/<(?:.|\n)*?>/gm, ''),
                                    distance: step.distance.value,
                                    time:  step.duration.value,
                                    index: indices[i][j],
                                    exit: null//instr.exit_number
                                });
                            }
                    }
                    return iroute;
                });
                callback.call(context || callback, null, r);
            }
            else callback.call(context, {
                status: status,
                message: result
            });
        });
        return this;
    }
});

L.Routing.google = function(options) {
    return new L.Routing.Google(options);
};
# Mapbox-gl-js React Components
This library hopes to make [Mapbox-gl-js](https://www.mapbox.com/mapbox-gl-js/) easy to use while maintaining its
API with the the power of React's declarative composability and higher order components.

Data displayed on you maps requires a data source and a styled layer just like
Mapbox-gl-js.

```JSX
<MapComponent
  accessToken="YOUR_MAPBOX_TOKEN"
  style=""
  center=[-122, 42]
  zoom={12}
  events={{
    move: (map, event) => {
      console.log(`Map is centered at ${map.getCenter()}`);
    }
  }}
>
  <SourceComponent
    name="markers"
    data={geoJSON}
  >
    <Layer
      type="circle"
    />
  </SourceComponent>
</MapComponent>
```

R# Installation

`npm install --save mapbox-gl-react`

## Examples

Examples of component usage can be found in the `/examples`.
You can run them live with `npm start` after cloning this repo.

## Base Components
### Map
The main container component that will display the map.
#### accessToken: _string_
Grab token from Mapbox and keep it somewhere private.
- required

#### bearing: _number_
The initial rotational bearing of the map in degrees.
- default: 0

#### center: _[longitude: number, latitude: number]_
The coordinates for initial center of map.
- required

#### containerStyle: _object_
[React styles](https://facebook.github.io/react/tips/inline-styles.html) passed into map container.
- default: {
  height: '100%',
  width: '100%'
}

#### eventHandlers: _object_
Refer to Mapbox documentation for list of [Possible Events](https://www.mapbox.com/mapbox-gl-js/api/#Map.event:webglcontextlost).
Object keys must be named after events (case insensitive) with a callback function as the value which accepts the Map instance and [event object](https://www.mapbox.com/mapbox-gl-js/api/#Events) as parameters.

#### pitch: _number_
Inital pitch of the map.
- default: 0

#### style: _string_
Grab your favorite map style from Mapbox.
- required

#### zoom: _number_
The initial zoom for map.
- required

#### options: _object_
List of more map options.
- **minZoom**: number
- **maxZoom**: number
- **maxBounds**: [number]
- **hash**: boolean
- **interactive**: boolean
- **moveToMethod**: 'flyTo' | 'jumpTo' | 'easeTo'

### Source
Attaches a geoJSON data source to map.
#### name: _string_
The name of the source.
- required
#### data: _geoJSON_ | _url_
The actual data.
- required
#### options: _object_
- **maxZoom**: number
- **cluster**: boolean
- **clusterRadius**: number
- **clusterMaxZoom**: number

### Layer
A layer styles in map that reads data from parent source component.
#### type: 'symbol' | 'circle'
The layer type, [Mapbox docs](https://www.mapbox.com/mapbox-gl-style-spec/#layers)
- required
#### paint: object
#### layout: object
#### filter: array

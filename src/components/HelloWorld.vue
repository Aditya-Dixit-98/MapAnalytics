<template>
  <div id="map"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import store from '../store/index'
export default {
  name: 'HelloWorld',
  data: () => ({
    accessToken:"pk.eyJ1IjoiYWRpdHlhZGl4aXQ5OCIsImEiOiJja3hxMDNhcGwycDl5MnF1YmVhZWJueDQ3In0.PRMDCZ0oOznSX1brCpta4w",
    coordinates:null,
    features:null,
  }),
  beforeMount(){
    store.dispatch("getCoordinates")
    store.dispatch("getUsers")
  },
  mounted(){ 
  },

watch:{
  '$store.state.coordinateDensity': function () {
      this.coordinates = store.state.coordinateDensity
      console.log(this.coordinates)
  },
  coordinates: function(){
    console.log(this.coordinates)
    let features = this.coordinates.features
    console.log(features)
    mapboxgl.accessToken = this.accessToken
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/light-v10', // style URL
      center: [77.55945907921542, 12.892376523386842], // starting position
      zoom: 10// starting zoom
      })
      map.on('load', () => {
// Add a data source containing GeoJSON data.
map.addSource('maine', {
'type': 'geojson',
'data': {
'type': 'FeatureCollection',
'features': this.coordinates.features,
}
});
 
// Add a new layer to visualize the polygon.
map.addLayer({
'id': 'maine',
'type': 'fill',
'source': 'maine', // reference the data source
'layout': {},
'paint': {
'fill-color': {
              property: 'density', // this will be your density property form you geojson
              stops: [
                [10, '#ffffcc'],
                [50, '#a1dab4'],
                [100, '#41b6c4'],
                [150, '#225ea8'],
              ]
            }, // blue color fill
'fill-opacity': 0.9
}
});
// Add a black outline around the polygon.
map.addLayer({
'id': 'outline',
'type': 'line',
'source': 'maine',
'layout': {},
'paint': {
'line-color': '#000',
'line-width': 3
}
});
});

  }
}

}
</script>
<style>
#map {
  height: 700px;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
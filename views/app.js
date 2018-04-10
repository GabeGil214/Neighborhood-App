var model = {
  locations: [
  {
    name: 'Cal State Long Beach',
    position: {lat: 33.7751381, lng: -118.1149283}
  },
  {
    name: 'La Taqueria Mexicana',
    position: {lat: 33.7715737, lng: -118.1559124}
  },
  {
    name: 'The Blind Donkey',
    position: {lat: 33.7689995, lng: -118.1887075}
  },
  {
    name: "Rosie's Dog Beach",
    position: {lat: 33.7551556, lng: -118.142583}
  },
  {
    name: 'The Pike Restaurant and Bar',
    position: {lat: 33.7715738, lng: -118.1713228}
  }

]};

var apiKey = 'oR5y8Acjr1VUeppANFBlkgEfn22N6xMfDS6NxdlEEbf7zcQjmkf1w6LAQaWrzP_k7lpGUjQcOSdwsaK4F0mJkzF8WvcX_IioVwMx9JOjP6QPHCK3hIJw1sQrCLaoWXYx';


var ViewModel = function(){
    var self = this;
    var marker;

    var map = ko.observable(new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.770208, lng: -118.1561095},
      zoom: 13
    }));

    this.markerList = ko.observableArray([]);

    model.locations.forEach(function(location){
      self.markerList.push(new google.maps.Marker({
        position: location.position,
        map: map(),
        title: location.name,
        animation: google.maps.Animation.DROP
      }));
    });

    var infoWindow = new google.maps.InfoWindow();

    self.markerList().forEach(function(marker, idx){
      marker.addListener('click', function(){
        openWindow(marker, infoWindow);
        getInfo(idx)
      });
    });

    function openWindow(marker, infoWindow){
      infoWindow.setContent(marker.title);
      infoWindow.open(map(), marker)
    }

};

function getInfo(idx){
  var url = "https://api.yelp.com/v3/businesses/search?latitude=" + model.locations[idx].position.lat + '&longitude=' + model.locations[idx].position.lng;
  var settings = {
  "async": true,
  "dataType": "jsonp",
  "crossDomain": true,
  "url": "https://api.yelp.com/v3/businesses/search?=&latitude=33.7715737&longitude=-118.1559124",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer oR5y8Acjr1VUeppANFBlkgEfn22N6xMfDS6NxdlEEbf7zcQjmkf1w6LAQaWrzP_k7lpGUjQcOSdwsaK4F0mJkzF8WvcX_IioVwMx9JOjP6QPHCK3hIJw1sQrCLaoWXYx",
    "Cache-Control": "no-cache",
    "Postman-Token": "e02303f2-1432-4751-af81-809911c109bf"
  }
}
  $.ajax(settings).done(data => {
    console.log(data);
  });
};

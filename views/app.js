var model = {
  locations: [
  {
    name: 'Cal State Long Beach',
    position: {lat: 33.7751381, lng: -118.1149283},
    visible: true,
    id: 0
  },
  {
    name: 'La Taqueria Mexicana',
    position: {lat: 33.7715737, lng: -118.1559124},
    visible: true,
    id: 1
  },
  {
    name: 'The Blind Donkey',
    position: {lat: 33.7689995, lng: -118.1887075},
    visible: true,
    id: 2
  },
  {
    name: "Rosie's Dog Beach",
    position: {lat: 33.7551556, lng: -118.142583},
    visible: true,
    id: 3
  },
  {
    name: 'The Pike Restaurant and Bar',
    position: {lat: 33.7715738, lng: -118.1713228},
    visible: true,
    id: 4
  }
]};

var googleAPI = "AIzaSyDs3DBFiI0TdYHS4A4kWuyni-iEcZ9cVco"
var CLIENT_ID = "BIMM0WEA0MMGP4L413Z4UXGMUYPC24HVJG43X3CBUFHPKPT5"
var CLIENT_SECRET = "D0XZYUATE3SR0DTXFJM5JMNOCJ5SIDEM0V01NRQW5HZ4QCXW"

function initMap() {
  var self = this;
  var marker;
  self.markerList = [];

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.770208, lng: -118.1561095},
    zoom: 13,
    MapTypeControlOptions: {
      position: 'TOP-RIGHT'
    }
  });

  model.locations.forEach(function(location){
    self.markerList.push(new google.maps.Marker({
      position: location.position,
      map: map,
      title: location.name,
      animation: google.maps.Animation.DROP
    }));
  });

  var infoWindow = new google.maps.InfoWindow();

  self.markerList.forEach(function(marker, idx){
    marker.addListener('click', function(){
      var url = "https://api.foursquare.com/v2/venues/search?ll=" + model.locations[idx].position.lat + "," + model.locations[idx].position.lng + "&query=" + model.locations[idx].name + "&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20180411";
      var settings = {
      "async": true,
      "dataType": "json",
      "crossDomain": true,
      "url": url,
      "method": "GET"
    }
      $.ajax(settings).done(data => {
        var info = data.response.venues[0];
        openWindow(idx, infoWindow, info);
      }).fail(response => {
        console.log(response)
      })
    });
  });
}

function ViewModel(){
  var self = this;

  self.searchInput = ko.observable("");
  self.locationList = [];

  model.locations.forEach(function(location){
    self.locationList.push(new Location(location));
  });

  self.searchLocations = function(searchInput, data){
    self.locationList.forEach(function(location){
      var name = location.name;
      if(name.toLowerCase().search(searchInput().toLowerCase()) < 0){
        location.visible(false);
        markerList[location.id].setVisible(false);
      } else {
        location.visible(true);
        markerList[location.id].setVisible(true);
      }
    })
  };

  var infoWindow = new google.maps.InfoWindow();

  self.onListClick = function(idx){
    var location = self.locationList[idx];
    var url = "https://api.foursquare.com/v2/venues/search?ll=" + location.position.lat + "," + location.position.lng + "&query=" + location.name + "&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20180411";
    var settings = {
    "async": true,
    "dataType": "json",
    "crossDomain": true,
    "url": url,
    "method": "GET"
  }
    $.ajax(settings).done(data => {
      var info = data.response.venues[0];
      openWindow(idx, infoWindow, info);
    }).fail(response => {
      console.log(response)
    })
  };
};

$(document).ready(function() {
  ko.applyBindings(new ViewModel());
});

function Location(data){
  var self = this;
  self.name = data.name;
  self.position = data.position;
  self.visible = ko.observable(data.visible);
  self.id = data.id;
}

function openWindow(idx, infoWindow, info){
  var marker = markerList[idx]
  if(infoWindow.getContent()){
    //Check if an infoWindow has already been opened
    //Store infoWindow div element in container div
    var content = infoWindow.getContent()
    var container = $(".container").html(content)
    infoWindow.close()
  }
  //Set content of info window to div element infoWindow
  $("#info-name").text(info.name);
  $("#info-address").text(info.location.formattedAddress[0]);
  $("#info-city").text(info.location.formattedAddress[1]);
  $("#street-image").attr("src", "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + info.location.formattedAddress[0] + info.location.formattedAddress[1] + "&key=" + googleAPI);
  var infoDiv = $("#infoWindow")
  infoWindow.setContent(infoDiv[0]);
  infoWindow.open(map, marker);
}

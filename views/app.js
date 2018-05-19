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
  },
  {
    name: 'Long Beach Airport',
    position: {lat: 33.8167909, lng: -118.1535476},
    visible: true,
    id: 5
  },
  {
    name: 'Bixby Park',
    position: {lat: 33.7647885, lng: -118.1705796},
    visible: true,
    id: 6
  },
  {
    name: 'Hole Mole',
    position: {lat: 33.7733092, lng: -118.1630268},
    visible: true,
    id: 7
  },
  {
    name: 'In\'n\'out',
    position: {lat: 33.7583755, lng: -118.1216589},
    visible: true,
    id: 8
  },
  {
    name: 'The Library Coffehouse',
    position: {lat: 33.764282, lng: -118.154205},
    visible: true,
    id: 9
  },
  {
    name: 'The Pike Outlets',
    position: {lat: 33.764611, lng: -118.1962537},
    visible: true,
    id: 10
  }
]};

var googleAPI = "AIzaSyDs3DBFiI0TdYHS4A4kWuyni-iEcZ9cVco"
var CLIENT_ID = "BIMM0WEA0MMGP4L413Z4UXGMUYPC24HVJG43X3CBUFHPKPT5"
var CLIENT_SECRET = "D0XZYUATE3SR0DTXFJM5JMNOCJ5SIDEM0V01NRQW5HZ4QCXW"

$.ajax("https://maps.googleapis.com/maps/api/js?key=AIzaSyDs3DBFiI0TdYHS4A4kWuyni-iEcZ9cVco&v=3",
  {
  "async": true,
  "dataType": "jsonp",
  "crossDomain": true,
  "method": "GET"
}).done(data => {
  initMap();
}).fail(response => {
  $("#map").text("The Google Maps API could not be reached. Check connection or try again");
})
function initMap() {
  var self = this;
  var marker;
  self.markerList = [];

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.784208, lng: -118.1561095},
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

  self.infoWindow = new google.maps.InfoWindow();

  self.closeWindow = function(){
    self.infoWindow.close();
  }

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
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
      marker.setAnimation(null);
    }, 2000);

      $.ajax(settings).done(data => {
        var info = data.response.venues[0];
        openWindow(idx, infoWindow, info);
      }).fail(response => {
        openWindow(idx, infoWindow, response);
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
        closeWindow();
        markerList[location.id].setVisible(false);
      } else {
        location.visible(true);
        markerList[location.id].setVisible(true);
        markerList[location.id].setAnimation(google.maps.Animation.DROP);
      }
    })
  };

  self.onListClick = function(idx){
    markerList[idx].setAnimation(google.maps.Animation.BOUNCE);
    google.maps.event.trigger(markerList[idx], 'click');
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

function openWindow(idx, infoWindow, res){
  var marker = markerList[idx]
  if(infoWindow.getContent()){
    //Check if an infoWindow has already been opened
    //Store infoWindow div element in container div
    var content = infoWindow.getContent()
    var container = $(".container").html(content)
    infoWindow.close()
  }
  //Check if foursquare API response is successful, and populate infowindow
  if(res.name){
    //Set content of info window to div element infoWindow
    $("#info-name").text(res.name);
    $("#info-address").text(res.location.formattedAddress[0]);
    $("#info-city").text(res.location.formattedAddress[1]);
    $("#street-image").attr("src", "https://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + res.location.formattedAddress[0] + res.location.formattedAddress[1] + "&key=" + googleAPI);
  } else {
    //Handle error if foursquare API response is unsuccessful
    $("#info-name").text("Whoops! The Foursquare API could not be reached, check your firewall settings or try again");
    $("#street-image").attr({
        src: "./img/Thinking_Face_Emoji.png",
        height: 100,
        width: 100
    });
  }
  var infoDiv = $("#infoWindow")
  infoDiv.css({
    display: "block"
  });
  infoWindow.setContent(infoDiv[0]);
  infoWindow.open(map, marker);
}

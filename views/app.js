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

var CLIENT_ID = "BIMM0WEA0MMGP4L413Z4UXGMUYPC24HVJG43X3CBUFHPKPT5"
var CLIENT_SECRET = "D0XZYUATE3SR0DTXFJM5JMNOCJ5SIDEM0V01NRQW5HZ4QCXW"

var ViewModel = function(){
    var self = this;
    var marker;

    var map = ko.observable(new google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.770208, lng: -118.1561095},
      zoom: 13,
      MapTypeControlOptions: {
        postion: 'TOP-RIGHT'
      }
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
          openWindow(marker, infoWindow, info);
        }).fail(response => {
          console.log(response)
        })
      });
    });

    function openWindow(marker, infoWindow, info){
      if(infoWindow.getContent()){
        //Check if an infoWindow has already been opened
        //Store infoWindow div element in container div
        var content = infoWindow.getContent()
        var container = $(".container").html(content)
        infoWindow.close()
      } else {
        //Populate infoWindow div if no other infoWindow has been opened
        var window = $("#infoWindow").text(info.name);
      }
      //Set content of info window to div element infoWindow
      window = $("#infoWindow").text(info.name);
      infoWindow.setContent(window[0]);
      infoWindow.open(map(), marker);
    }
};

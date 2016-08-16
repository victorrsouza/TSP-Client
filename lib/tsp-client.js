var TSPClient = function () {

    //database to simulate the behavior
    /*
    var macae = { lat: -22.2818204, lng: -42.1180508 };
    var campos_dos_goytacazes = { lat: -21.7769086, lng: -41.4546498 };
    var rio_de_janeiro = { lat: -22.9103552, lng: -43.7285318 };
    var vitoria = { lat:-20.2821076, lng:-40.3212667 };
    var natal = { lat:-5.8019527, lng:-35.222321 };
    var gramado = { lat:-29.3795583, lng:-50.9365088 };
    var campos_do_jordao = { lat:-22.6923048, lng:-45.678238 };
    var brasilia = { lat:-15.7213869, lng:-48.078324 };        
    var buenos_aires = { lat:-34.6154611, lng:-58.5734061 };        
    var cartagena = { lat:10.4001806, lng:-75.5084251 };
    var cusco = { lat:-13.5300192, lng:-71.9392491 };
    var bariloche = { lat:-41.1349212, lng:-71.3399145 };
    var manaus = { lat:-2.573259, lng:-59.9813835 };
    var bonito = { lat:-20.9593147, lng:-57.0392959 };
    var foz_iguacu = { lat:-25.4643779, lng:-54.7371469 };
	*/

    var mapOptions;
    var map;
    var directionsDisplay;
    var directionsService;

    var getRequest = function (url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				callback(xhr.responseText, xhr.status);
			}
		}
		xhr.send();
    };

    var customSort = function (a, b) {
      if (a.origem.nome < b.origem.nome) return -1;
      if (a.origem.nome > b.origem.nome) return 1;
      if (a.destino.nome < b.destino.nome) return -1;      
      if (a.destino.nome > b.destino.nome) return 1;
      return 0;
    };

    this.initialize = function () {
      mapOptions = {
        center: { lat:-20.9593147, lng:-57.0392959 },
        scrollwheel: false,
        zoom: 4,
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

      directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
      });

      directionsService = new google.maps.DirectionsService();
    };

	this.distance = function () {
      getRequest('http://localhost:3000/distances', function(data, status) {
        
        var json = JSON.parse(data).sort(customSort);
      
        json.forEach(function(k, v){
            //console.log('valor: ' + v + ' / divisao: ' + Math.trunc(v/15) + ' / resto: ' + v%15);
            var rowIndex = Math.trunc(v/15) + 1;
            var columnIndex = (v%15) + 1;
            $('#matrizDistancia tr').eq(rowIndex).find('td').eq(columnIndex).html(k.distancia);
        });

        $('#modalDistancia').modal('show');
      });
    };

    this.run = function () {

      $('#modalLoading').modal('show');
      getRequest('http://localhost:3000/runSolution', function(data, status) {

        var json = JSON.parse(data);
        /*
        var json = [];        
        json.push(vitoria);
        json.push(campos_dos_goytacazes);
        json.push(macae);
        json.push(rio_de_janeiro);
        json.push(campos_do_jordao);
        json.push(brasilia);
        json.push(bonito);
        json.push(foz_iguacu);
        json.push(gramado);
        json.push(buenos_aires);
        json.push(bariloche);
        json.push(cusco);
        json.push(cartagena);
        json.push(manaus);
        json.push(natal);
        json.push(vitoria);
        */
        var stops = [];
        var lat;
        var lng;

        for (i = 0; i <= json.length; i++) {
          
          if (i == json.length) {
            lat = json[0].lat; 
            lng = json[0].lng; 
          }
          else {
            lat = json[i].lat; 
            lng = json[i].lng;
          }

          var waypoint = {
            "Geometry": 
              {
                "Latitude": lat,
                "Longitude": lng
              }            
          };
          stops.push(waypoint);
        }

        Tour_startUp(stops);
        window.tour.loadMap(map, directionsDisplay);
        window.tour.fitBounds(map);
        
        if (stops.length > 1)
            window.tour.calcRoute(directionsService, directionsDisplay);

        $('#modalLoading').modal('toggle');
      });
    };    

};
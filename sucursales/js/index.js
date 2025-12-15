var map;
var markers = [];
var infoWindow;
var selectedMarker;
let _FWP_dataBranchUrl = 'modules/branch/bra_gjson.jsp?c=1';
let stores = []
var map;
var markers = [];
var infoWindow;
var selectedMarker;

fetch(_FWP_dataBranchUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(datos => {
        stores = Array.isArray(datos) ? datos : [datos];
    })
    .catch(error => {
        console.log('Se produjo un error: ', error);
    });
	

function initMap() {
    var defaultLocation = {lat: 19.4326005, lng: -99.1330719}
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 20,
        mapTypeId: "roadmap",
        styles:
            [
                {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "weight": "2.00"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#9c9c9c"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#f2f2f2"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -80
                        },
                        {
                            "lightness": 45
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#eeeeee"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#7b7b7b"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#46bcec"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#c8d7d4"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#070707"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                }
            ],
        mapTypeControl: false,
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
	
	
	  const locationButton = document.createElement("button");
	  locationButton.textContent = ".";
	  locationButton.title = "Encuentra tu ubicación";
	  locationButton.classList.add("custom-map-control-button");
	  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(locationButton);
	  locationButton.addEventListener("click", () => {
		if (navigator.geolocation) {
			document.getElementById('search-input').value="";
			document.getElementById("myBtn").click();
			navigator.geolocation.getCurrentPosition(
			(position) => {
			  const pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			  };
			  infoWindow.setPosition(pos);
			  infoWindow.setContent("Te encuentras aquí");
			  
			  var markerYouIcon = {
				url: 'https://maps.google.com/mapfiles/kml/paddle/red-blank.png',
				scaledSize: new google.maps.Size(250, 250)
				};
			
			  var youMarker = new google.maps.Marker({
					map: map,
					position: pos,
					icon: markerYouIcon,
					animation: google.maps.Animation.DROP,
				});
				
				infoWindow.open(map, youMarker);
				map.setCenter(youMarker.position);
				youMarker.setAnimation(google.maps.Animation.BOUNCE);
			  
				map.setZoom(11);
				map.setCenter(pos);
				markers.push(youMarker);
				
			},
			() => {
			  handleLocationError(true, infoWindow, map.getCenter());
			}
		  );
		} else {
		  handleLocationError(false, infoWindow, map.getCenter());
		}
	  });
	  
  
}

function searchStores() {
    var foundStores = [];
    var searchData = document.getElementById('search-input').value;
    var foundSto = false
	if (searchData) {
        stores.forEach(function (store) {
            var postal = store.properties.postalCode.substring(0, 5);
			var nameUp = store.properties.name.toUpperCase()
			var addressUp = store.properties.address.toUpperCase()
            if (postal == searchData || nameUp.search(searchData.toUpperCase())>=0 || addressUp.search(searchData.toUpperCase())>=0) {
                foundStores.push(store);
				foundSto = true
            };
			
        });
		if (!foundSto) {alert('Sin resultados');document.getElementById('search-input').value="";foundStores = stores;}
		
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}


function setOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function (elem, index) {
        elem.addEventListener('click', function () {
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}

function displayStores(stores) {
    var storesHtml = "";
    stores.forEach(function (store, index) {
        var name 			= store.properties.name;
		var category 		= store.properties.category ;
        var address 		= store.properties.address;
		var city 			= store.properties.city;
		var state 			= store.properties.state;
		var zipCode 		= store.properties.postalCode;
		var country 		= store.properties.country;
		var phone 			= store.properties.phone;
		var email 			= store.properties.email;
		var web 			= store.properties.web;
		var hours1 			= store.properties.hours1;
		var hours2 			= store.properties.hours2;
		var hours3 			= store.properties.hours3;
		var featured 		= store.properties.featured;
		var features 		= store.properties.features;
        
        storesHtml += `
					<div class="store-container">
					  <div class="store-container-background">
						  <div class="store-info-container p-1">
							<div class="fs-6 ff-dsbo lh-sm">
							${name}
							</div>
							<div class="fs-7 ff-dsli lh-sm mb-2 text-dark fst-italic">
							  ${featured}
							</div>
							<div class="fs-7 ff-dsre lh-sm mb-2">
							  <span>${address}</span>
							</div>
							<div class="fs-7 ff-dsli lh-sm text-info">
							${phone} ${city}
							</div>
						  </div>
						  <div class="store-number-container">
							<!--<div class="store-number">
							  ${index + 1}
							</div>-->
						  </div>
						</div>
					</div>
					`
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function (store, index) {
        var latlng = new google.maps.LatLng(
            store.geometry.coordinates[0],
            store.geometry.coordinates[1]);
        
		var name 			= store.properties.name;
		var category 		= store.properties.category ;
        var address 		= store.properties.address;
		var city 			= store.properties.city;
		var state 			= store.properties.state;
		var postalCode 		= store.properties.postalCode;
		var country 		= store.properties.country;
		var phone 			= store.properties.phone;
		var email 			= store.properties.email;
		var web 			= store.properties.web;
		var hours1 			= store.properties.hours1;
		var hours2 			= store.properties.hours2;
		var hours3 			= store.properties.hours3;
		var featured 		= store.properties.featured;
		var features 		= store.properties.features;
				
        bounds.extend(latlng);
		
		setTimeout(function () {
            createMarker(latlng, name, category, address, city, state, postalCode, country, phone, email, web, hours1, hours2, hours3, featured, features, index);
        }, index * 50);
        
    })
    map.fitBounds(bounds);
}


function createMarker(latlng, name, category, address, city, state, postalCode, country, phone, email, web, hours1, hours2, hours3, featured, features, index) {
    
	var html = `
    <div class="store-info-window text-center">
		<div class="fs-5 ff-dsre lh-sm text-info">
		  ${name} - ${category}
		</div>
		<div class="fs-7 ff-dsli lh-sm text-black mb-2">
		  ${featured}
		</div>
		<!--<div class="fs-6 ff-dsli lh-sm text-primary mb-2">
		  ${address}
		</div>-->
		
		<div class="fs-5 fw-bold lh-sm text-info">
		  <a href="https://www.google.com/maps/dir/?api=1&destination=${latlng}" class="fs-6 ff-dsli lnk-info link-info" target="_blank"> ¿Cómo llegar?</a>
		</div>
	</div>
    `

    var markerIcon = {
        url: 'WEB%20CLICOM/WEB%20CLICOM/sucursales/media/marker-icon.png',
        scaledSize: new google.maps.Size(150, 150),
        anchor: new google.maps.Point(75,150)
    };

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: {
        url: 'WEB%20CLICOM/WEB%20CLICOM/sucursales/media/marker-icon.png',
        scaledSize: new google.maps.Size(150, 150),
        anchor: new google.maps.Point(75, 150)
    },
    animation: google.maps.Animation.DROP
});
	
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
		map.setCenter(marker.position);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 700);
		map.setZoom(7);		
    });
   
   markers.push(marker)
		
}

var input = document.getElementById("search-input");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("myBtn").click();
    }
});

function addMarkerWithTimeout(position, timeout) {
  window.setTimeout(() => {
    markers.push(marker)
  }, index * 200);
}
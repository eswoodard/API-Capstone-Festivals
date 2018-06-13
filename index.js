//main page loads
//user enters zipcode and clicks submit
//event listener listens for submit 
//query sent to API
//API responds with data object
//festival events displayed in list
//festival markers displayed on map
//user clicks on event
//light box opens and displays event details and new map
//user clicks on map marker
//light box opens and displays event details and new map
//user clicks on "x" or outside of lightbox
//lightbox closes


const EVENTBRITE_SEARCH_URL = "https://www.eventbriteapi.com/v3/events/search/";
let map;

function getDataFromEventbrite(zipcode, radius){
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": `https://www.eventbriteapi.com/v3/events/search/?q=festival&location.address=${zipcode}&location.within=${radius}&expand=organizer,%20venue`,
		"method": "GET",
		"headers": {
			"Authorization": "Bearer 2543EBUADTSZK2TAFZS3",
		}

	}
	console.log("getDataFromEventbrite ran");

	$.ajax(settings).done(handleEventbriteResponse);

}

function handleEventbriteResponse(response){
	console.log('handleEventbriteResponse ran');
	console.log(response);
	const eventListHTML = response.events.map((item, index) => {
		if (index < 10) {
			return generateEventListHTML(item);
		}
		
	});

	$('#js-event-list-container').html(eventListHTML);		
}

function getVenueAddress(venue) {
	console.log("getVenueAddress ran");
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": ` https://www.eventbriteapi.com/v3/venues/${venue}/?token=2543EBUADTSZK2TAFZS3`,
		"method": "GET",		
	}

 

	$.ajax(settings).done(handleVenueAddress);
	
}

function handleVenueAddress(data){
	console.log("handleVenueAddress ran");
	console.log(data);
		//need to figure out how to pass venueLatLng to initMap
	let venueLatLng = {lat: parseFloat(data.address.latitude), lng: parseFloat(data.address.longitude)};

	console.log(venueLatLng);	

	createMarker(venueLatLng);
		
	}

function generateEventListHTML(result) {
	console.log("generateEventListHTML ran");
	const venueID = result.venue_id;

	console.log(venueID);
	getVenueAddress(venueID);
	

	return `
		<div class = "items" onclick ="activateModalBox()">
			<ul>
				<li class="title">${result.name.text}</li>
			</ul>
		</div>
	`;
}

      
function initMap(query, miles) {
    map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: -34.397, lng: 150.644},
         zoom: 11,
    });

    let geocoder = new google.maps.Geocoder();
    centerMapOnZipcode(geocoder, map, query);
      

	console.log("initMap ran");

}


function createMarker(latLng){
	let marker = new google.maps.Marker({
    	position: latLng,
    });

    marker.setMap(map);

}


function centerMapOnZipcode(geocoder, resultsMap, zipcode) {
	console.log('centerMapOnZipcode ran')
	let address = zipcode;
	console.log(address);
	geocoder.geocode({'address':address}, function(results, status) {
		if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);}
		else {
			alert('Geocode was not successful for the following reason: ' + status);
			
		}
		
	});
}

function activateModalBox(){
	console.log("activateModalBox ran");
	
	$(".modal, .modal-content").addClass("active");
	$(".close, .modal").on("click", function(){
		$(".modal, .modal-content").removeClass("active");
	});
	window.onclick = function(event){
		if (event.target == $(".modal")){
			$(".modal, .modal-content").removeClass("active");
		}
	}
}




function watchSubmit() {
	$('#js-search-form').submit(event => {
		event.preventDefault();
		const queryTarget = $(event.currentTarget).find('#js-query');
		const query = queryTarget.val();
		queryTarget.val("");
		const queryRadius = $(event.currentTarget).find('#js-search-radius');
		const miles = queryRadius.val();
		getDataFromEventbrite(query, miles);
		initMap(query, miles);
		

		 
	});
	
	console.log('watchSubmit ran');
}

$(watchSubmit);
      

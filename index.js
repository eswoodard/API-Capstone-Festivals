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

	function handleResponse(response){
		console.log('handleResponse ran');
		console.log(response);
		const eventListHTML = response.events.map((item, index) => renderEventListHTML(item));
		$('#js-event-list-container').html(eventListHTML);
		

		

	}

	$.ajax(settings).done(handleResponse);

}
//need to pass venue-id as arugment to get API to return venue object.  Can get address from venue object
function getVenueAddress(venue) {
	console.log("getVenueAddress ran");
	const settings = {
  "async": true,
  "crossDomain": true,
  "url": ` https://www.eventbriteapi.com/v3/venues/${venue}/?token=2543EBUADTSZK2TAFZS3`,
  "method": "GET",		
	}

	function handleAddress(response){
		console.log("handleAddress ran");
		console.log(response);
		//does this need to be lat,lng?
		//const eventAddress = response.address.map((item, index) => createMarker(item));
		
		
	}

	$.ajax(settings).done(handleAddress);
	
}




function renderEventListHTML(result) {
	console.log("renderEventListHTML ran");
	const venueID = result.venue_id;

	console.log(venueID);
	getVenueAddress(venueID);

	return `
		<div class = "items">
			<ul>
				<li class="title">${result.name.text}</li>
			</ul>
		</div>
	`;
}

      
function initMap(query) {
    var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 10,
        });
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, query);
      

  console.log("initMap ran");

}



function geocodeAddress(geocoder, resultsMap, zipcode) {
	console.log('geocodeAddress ran')
	var address = zipcode;
	console.log(address);
	geocoder.geocode({'address':address}, function(results, status) {
		if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);}
		else {
			alert('Geocode was not successful for the following reason: ' + status);
			
		}
		
	});
}



// function createMarker(event) {
// 	const {venue, url, name} = event;
// 	const {latitude, longitude} = venue;
// 	const position = {lat: +latitude, lng: +longitude}
// 	const template = createEventTemplate(event);
// 	let marker = new google.maps.Marker({
// 		position,
// 		url,
// 		map,
// 	});
// }



function watchSubmit() {
	$('#js-search-form').submit(event => {
		event.preventDefault();
		const queryTarget = $(event.currentTarget).find('#js-query');
		const query = queryTarget.val();
		queryTarget.val("");
		const queryRadius = $(event.currentTarget).find('#js-search-radius');
		const miles = queryRadius.val();
		getDataFromEventbrite(query, miles);
		initMap(query);
		 
	});
	
	console.log('watchSubmit ran');
}

$(watchSubmit);
      

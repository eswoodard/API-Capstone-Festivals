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
	//console.log('handleEventbriteResponse ran');
		//console.log(response);
	STORE.events = response.events;
	const eventListHTML = response.events.map((item, index) => {
	

		// if (index < 50) {
			return generateEventListHTML(item);	
		// }
	});																																						
	
	noResultsMessage();	
	$('#js-event-list-container').html(eventListHTML);	

}

function getVenueAddress(venue) {
	//console.log("getVenueAddress ran");
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": ` https://www.eventbriteapi.com/v3/venues/${venue}/?token=2543EBUADTSZK2TAFZS3`,
		"method": "GET",		
	}

	$.ajax(settings).done(handleVenueAddress);
}

function handleVenueAddress(data){
	//console.log("handleVenueAddress ran");
	//console.log(data);
	let venueLatLng = {lat: parseFloat(data.address.latitude), lng: parseFloat(data.address.longitude)};
	let eventVenueId = data.id;
	//console.log(eventVenueId);
	//console.log(venueLatLng);	
	createMarker(venueLatLng, eventVenueId);	
}

const STORE = {
	events: [],

}

function noResultsMessage(){
	console.log("noResultsMessage ran")
	if (STORE.events.length === 0){
		$('.content-container').html(`
				<div class = "error-message">
					<p>No results found.  Please enter another zipcode.</p>
				</div>
			`)
	}
}

function getEventById(eventId){
	for(let i = 0; i < STORE.events.length; i++){
		if(eventId === STORE.events[i].id){
			return STORE.events[i];
		}
	}
}

function getEventbyVenueId(eventVenueId){
	for(let i = 0; i < STORE.events.length; i++){
		if(eventVenueId === STORE.events[i].venue_id){
			return STORE.events[i];
		}
	}
}


function generateEventListHTML(result) {
	
	//console.log("generateEventListHTML ran");
	//console.log(result);
	const venueID = result.venue_id;
	//console.log(venueID);
	const eventName = result.name.text;
	// const eventLogo = result.logo.url;
	const eventDateAndTime = result.start.local;
	const eventMonth = eventDateAndTime.slice(5,8);
	//console.log(eventMonth);
	const eventDay = eventDateAndTime.slice(8,10);
	
	
	//console.log(eventDay);
	getVenueAddress(venueID);
	
	
	return `
		<div id = "items" onclick = "activateModalBox('${result.id}', '${result.venue_id}')">
			<div class = "title-info">
			<ul class = "month-day">
					<li class = "month">${eventMonth}</li>
					<li class = "day">${eventDay}</li>
				</ul>
				<p class="title">${result.name.text}</p>
				
			</div>
			
		</div>
	`;
	}
// <img class = "title-list-logo" src= "images/placeholder-image.png" alt = "event logo">

// }

function generateModalBoxContent(result){
	//console.log("generateModalBoxContent ran");
	//console.log(result);

	// if(result.logo === null){
	// 	$("#event-logo").html('images/placeholder-image.jpg');
	// }

	const eventName = result.name.text;
	const eventURL = result.url;
	const eventLogo = result.logo.url;
	const eventDescription = result.description.text;
	const eventDateAndTime = result.start.local;
	const eventDayMonth = eventDateAndTime.slice(5,10);
	const eventYear = eventDateAndTime.slice(0,4);
	const eventDate = eventDayMonth + '-' + eventYear;
	const eventTime = eventDateAndTime.slice(11, 16);
	
	


	
		$('.event-information').html(`
		<div class = "eventName">
			<h2 class = "event-title"><a href = "${eventURL}" target = "_blank">${eventName}</a>
			</h2>
		</div>
		<div class = "event-logo"><img id="event-logo" src = "${eventLogo}" alt = "logo"></div>
		<div class = "event-date-time">
			<ul>
				<li class = "date">Date: ${eventDate}</li>
				<li class = "time">Time: ${eventTime}</li>
			</ul>
		</div>
		<div class = "event-description"><p> <span class = "description-text">${eventDescription}</span><a href = "${eventURL}" target = "_blank">...more</a></p></div>
		<div class = "event-link"><a href = "${eventURL}" target = "_blank">Click here for additional event information and ticketing</a></div>
		`);	

		limitDescriptionText(eventDescription);	
}

function limitDescriptionText(text){
	$('.description-text').text(function(index,currentText){
		return currentText.substr(0,550);
	});
}

function activateModalBox(eventId, eventVenueId){
	//console.log("activateModalBox ran");
	const event = getEventById(eventId);
	//console.log(event);
	generateModalBoxContent(event);
	$(".modal, .modal-content").addClass("active");

}

function bindEventListeners(){
	$(".close").on("click", function(){
		//console.log("modal close");
		$(".modal, .modal-content").removeClass("active");
	});
	window.onclick = function(event){
		if (event.target == $(".content-container")){
			$(".modal, .modal-content").removeClass("active");
		}

	}
	watchSubmit();		
}
      
function initMap(query, miles) {
    map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: -34.397, lng: 150.644},
         zoom: 11,
    });

    let geocoder = new google.maps.Geocoder();
    centerMapOnZipcode(geocoder, map, query); 

	//console.log("initMap ran");
}

function createMarker(latLng, eventVenueId){
	//console.log("createMarker ran");
	let marker = new google.maps.Marker({
    	position: latLng,
    });

    marker.setMap(map);
    
   const eventVenue = getEventbyVenueId(eventVenueId)
   let infowindow = new google.maps.InfoWindow({
   	content: eventVenue.name.text
   });
   //console.log(eventVenue);
    marker.addListener('mouseover', function(){
    	infowindow.open(map, marker);
	});
	marker.addListener('mouseout', function(){
		infowindow.close();
	});
	marker.addListener('click', function(){
		activateModalBox(eventVenue);	
	});
}

function centerMapOnZipcode(geocoder, resultsMap, zipcode) {
	//console.log('centerMapOnZipcode ran')
	let address = zipcode;
	//console.log(address);
	geocoder.geocode({'address':address}, function(results, status) {
		//console.log(results);
		if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);
		}
		else {
			console.log("error");
			// alert('Geocode was not successful for the following reason: ' + status);	
			$('.content-container').html(`
				<div class = "error-message">
					<p>No results found.  Please enter another zipcode.</p>
				</div>
			`)
		}
	});
}

function hideHeader() {
	$("h1").addClass("hidden");
	$("header").addClass("main-content");

}


function watchSubmit() {
	$('#js-search-form').submit(event => {
		event.preventDefault();
		hideHeader();
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

$(bindEventListeners);
      

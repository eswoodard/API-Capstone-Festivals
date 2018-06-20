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
		"url": `https://www.eventbriteapi.com/v3/events/search/?q=festival&location.address=${zipcode}&location.within=${radius}&expand=organizer,%20venue&sort_by=date`,
		"method": "GET",
		"headers": {
			"Authorization": "Bearer 2543EBUADTSZK2TAFZS3",
		}
	}
	//console.log("getDataFromEventbrite ran");
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
	console.log(eventVenueId);
	//console.log(venueLatLng);	
	createMarker(venueLatLng, eventVenueId);	
}

const STORE = {
	events: [],

}


function noResultsMessage(){
	//console.log("noResultsMessage ran")
	if (STORE.events.length === 0){
		$('main').html(`
				<div class = "error-message">
					<p>No results found.  Please enter another zipcode.</p>
				</div>
				<div class = "error-button">	
					<button class = "err-button button" type = "submit" >Try Again!</button>
				</div>
			`)
		$("#search-box").addClass("hidden");
		$(".error-button").on("click", event => {
			event.preventDefault();
	 		pageReload();
	 });
	}

}

function pageReload(){
	//console.log("pageReload ran");
	location.reload();
}

function getEventById(eventId){
	for(let i = 0; i < STORE.events.length; i++){
		if(eventId === STORE.events[i].id){
			return STORE.events[i];
		}
	}
}

function getEventByVenueId(eventByVenueId){
	for(let i = 0; i < STORE.events.length; i++){
		if(eventByVenueId === STORE.events[i].venue_id){
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
	let eventDate = moment(eventDateAndTime).format("MMM Do");
	//console.log(eventDate);
	//console.log(eventDateAndTime);
	const eventMonth = eventDate.slice(0,4);
	//console.log(eventMonth);
	const eventDay = eventDate.slice(4,-2);
	//console.log(eventDay);
	getVenueAddress(venueID);
	
	
	return `
	<div id = "items" onclick = "activateModalBox('${result.id}', '${result.venue_id}')">
			<div class = "event-list grow">	
				<ul class = "month-day">
					<li class = "month h-line">${eventMonth}</li>
	 				<li class = "day">${eventDay}</li>
				</ul>
				<div class="line"></div>
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
	let eventDateWithTime = moment(eventDateAndTime).format("MMM Do YYYY, h:mm a");
	//console.log(eventDateWithTime);
	const eventDate = eventDateWithTime.slice(0,13);
	//console.log(eventDate);
	const eventTime = eventDateWithTime.slice(15, 23);
	//console.log(eventTime);
	
		$('.event-information').html(`
		<div class = "eventName">
			<h2 class = "event-title"><a href = "${eventURL}" target = "_blank">${eventName}</a>
			</h2>
		</div>
		<div class = "event-logo"><img id="event-logo" src = "${eventLogo}" alt = "logo"></div>
		<div class = "event-date-time">
			<ul class= "date-time">
				<li class = "date">Date: ${eventDate}</li>
				<li class = "time">Time: ${eventTime}</li>
			</ul>
		</div>
		<div class = "event-description"><p class = "description-and-more"><span class = "description-text">${eventDescription}</span><a class = "more" href = "${eventURL}" target = "_blank">...more</a></p></div>
		<div class = "event-link"><a href = "${eventURL}" target = "_blank">Click here for additional event information and ticketing</a></div>
		`);	

		limitDescriptionText(eventDescription);	
}

function limitDescriptionText(text){
	$('.description-text').text(function(index,currentText){
		return currentText.substr(0,650);
	});
}

function activateModalBox(eventId){
	//console.log("activateModalBox ran");
	const event = getEventById(eventId);
	//const event1 = getEventbyVenueId(eventByVenueId);
	console.log(eventId);
	console.log(event);
	//console.log(eventByVenueId);
	generateModalBoxContent(event);
	$(".modal, .modal-content").addClass("active");

}

function activateModalBoxWithMarker(eventByVenueID){
	generateModalBoxContent(eventByVenueID);
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

function createMarker(latLng, eventByVenueId){
	//console.log("createMarker ran");
	console.log(eventByVenueId);
	let marker = new google.maps.Marker({
    	position: latLng,
    });

    marker.setMap(map);
    
   const eventVenue = getEventByVenueId(eventByVenueId)
   console.log(eventVenue);
   let infowindow = new google.maps.InfoWindow({
   	content: eventVenue.name.text,
   	maxWidth: 150,
   });
   
   //console.log(eventVenue);
    marker.addListener('mouseover', function(){
    	infowindow.open(map, marker);
	});
	marker.addListener('mouseout', function(){
		infowindow.close();
	});
	marker.addListener('click', function(){
		activateModalBoxWithMarker(eventVenue);	
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
	$(".search-input").addClass("main-content");
	$(".button").addClass("main-content");


}


function watchSubmit() {
	$('#js-search-form').submit(event => {
		event.preventDefault();
		hideHeader();
		const queryTarget = $(event.currentTarget).find('#js-query');
		const query = queryTarget.val();
		//queryTarget.val("");
		const queryRadius = $(event.currentTarget).find('#js-search-radius');
		const miles = queryRadius.val();
		getDataFromEventbrite(query, miles);
		initMap(query, miles); 


	});
	
	//console.log('watchSubmit ran');
}

$(bindEventListeners);
      

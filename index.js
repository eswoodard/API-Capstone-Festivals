

const EVENTBRITE_SEARCH_URL = "https://www.eventbriteapi.com/v3/events/search/";

function getDataFromEventbrite(zipcode){
	var settings = {
  "async": true,
  "crossDomain": true,
  "url": `https://www.eventbriteapi.com/v3/events/search/?q=festival&location.address=${zipcode}&location.within=30mi&expand=organizer,%20venue`,
  "method": "GET",
  "headers": {
    "Authorization": "Bearer 2543EBUADTSZK2TAFZS3",
  }
}

function handleResponse(response){
	console.log(response);
	const eventListHTML = getEventListHTML(response);
	renderEventList(eventListHTML);
}


$.ajax(settings).done(handleResponse);


function getEventListHTML() {
	return `
		<div class = "items">
			<ul>
				<li>Item</li>
			</ul>
		</div>
	`;
}

function renderEventList(html) {
	$('#js-event-list-container').html(html);

}
  


// $.ajax(settings).done(response => {
//   console.log(response);
// });

}

getDataFromEventbrite(30188);

var map;
function initMap() {
  // map = new google.maps.Map(document.getElementById('map'), {
  //   center: {lat: -34.397, lng: 150.644},
  //   zoom: 8
  // });
}



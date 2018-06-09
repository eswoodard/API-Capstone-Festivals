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
	const eventListHTML = renderEventListHTML(response);
	renderEventList(eventListHTML);
}


$.ajax(settings).done(handleResponse);


function renderEventListHTML() {
	return `
		<div class = "items">
			<ul>
				<li class="title">${response.name.text}</li>
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


function watchSubmit() {
	$('#js-search-form').submit(event => {
		event.preventDefault();
		const queryTarget = $(event.currentTarget).find('#js-query');
		const query = queryTarget.val();
		console.log(query);
		queryTarget.val("");
		getDataFromEventbrite(query);

	});
	
	console.log('watchSubmit ran');
}

  var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
      

  console.log("initMap ran");
}

$(watchSubmit);
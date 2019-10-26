// put your own value below!
const apiKey = 'O5ycvytgpH9whJaqZ4cYR5WCr79Q7RXHPIJqXehF'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';
let searchWord;

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#searched-string').append(`${searchWord}`);
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
  $('#results-list').append(
    `<li><h3>${i + 1}. ${responseJson.data[i].fullName} - ${responseJson.data[i].states}</h3>
    <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
    <p><b>Description:</b><br /> ${responseJson.data[i].description}</a></p>
    <p><b>Directions:</b><br /> ${responseJson.data[i].directionsInfo}</a></p>
    </li>`
  )};

  $('#results').removeClass('hidden');
}

function getParkInfo(query, maxResults=10) {
  const params = {
    stateCode: query,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function resetSearch() {
  document.getElementById('js-form').reset();
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const selOne = $('#selectedState option:selected').val();
    const selTwo = $('#selectedState2 option:selected').val();
    const selThree = $('#selectedState3 option:selected').val();
    const searchTerm = selOne + selTwo + selThree;
    const maxResults = $('#js-max-results').val();
    $('#searched-string').empty();
    searchWord = searchTerm;
    getParkInfo(searchTerm, maxResults);
  });
}

$(function(){
  console.log('App loaded! Waiting for submit!');
  watchForm();
});

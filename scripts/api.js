// This file contains the functions to call the AllDebrid API
// Author : Valentin GUICHETEAU
// Last update : 2024/03/08
// Repository : https://github.com/ValentinGuicheteau/AlldebridPortable

// This function is used to call the API and return the response as a JSON object
export async function callApi(endpoint, method) {

  // Proùise to fetch the API endpoint
  return fetch(endpoint, {
    method: method,
    headers: {}
  })
  .then(response => {
    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Else return the response as a JSON object
    return response.json();
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);

    // Re-throw the error so it can be caught by the caller
    throw error;
  });
}

// This function is used to unlock a link from the AllDebrid API
export async function unlockLink(link, apiKey) {
  let url = 'https://api.alldebrid.com/v4/link/unlock?agent=allDebirdAPI&apikey='+ apiKey +'&link=' + link
  return await callApi(url, 'GET', {});
}

// This function is used to check if the API key is valid
export async function checkApiKey(apiKey) {
  let url = 'https://api.alldebrid.com/v4/user?agent=allDebirdAPI&apikey='+ apiKey
  
  let response = await callApi(url, 'GET', {});

  if (response['status'] == 'success') {
    return true;
  }
  else {
    return false;
  }
}

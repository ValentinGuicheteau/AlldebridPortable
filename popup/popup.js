// This file contains the functions to interact with the popup
// Author : Valentin GUICHETEAU
// Last update : 2024/03/08
// Repository : https://github.com/ValentinGuicheteau/AlldebridPortable

import { checkApiKey } from "../scripts/api.js";


// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

  // Get the textarea element, where the unlocked link gonna be displayed
  let textarea = document.getElementById('content')

  // Get the unlocked link to show from the local storage
  chrome.storage.local.get(["dataToShow"], function(result) {
    if (result.dataToShow) {
      document.getElementById('content').value = result.dataToShow;
      chrome.storage.local.remove(["dataToShow"]);
    }
  });

  // Add a click event listener to the textarea to copy the content to the clipboard
  textarea.addEventListener('click', function(e) {
    textarea.select(); 
  
    // Use try & catch for unsupported browser
    try {
      var ok = document.execCommand('copy');
    } catch (err) {
      console.log(err);
    }
  });
  
  // Manage the settings form
  var openSettingsButton = document.getElementById('openSettings');
  var saveApiKeyButton = document.getElementById('saveApiKey');
  var apiKeyForm = document.getElementById('apiKeyForm');
  var apiKeyInput = document.getElementById('apiKeyInput');
  
  // Load the saved API key when the popup is opened
  chrome.storage.local.get('apiKey', function(data) {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
  });
  

  // Add a click event listener to the settings button to open the settings form
  openSettingsButton.onclick = function() {
      apiKeyForm.style.display = 'block';
  };
  
  // Add a click event listener to the save API key button to save the API key in the local storage
  saveApiKeyButton.onclick = function() {
    var apiKey = apiKeyInput.value;

    // Save the API key in the local storage
    chrome.storage.local.set({'apiKey': apiKey}, function() {
      
      // Check if the API key is valid as a promise
      checkApiKey(apiKey).then((response) => {

        // If the API key is valid, hide the form and display a success message in the button
        if (response) {
          apiKeyForm.style.display = 'none';
          openSettingsButton.innerHTML = "API Key Saved!";
          openSettingsButton.disabled = true;
          openSettingsButton.style.backgroundColor = "green";
        }
        // Else, display an error message with a notification
        else {
          apiKeyForm.style.display = 'none';

          openSettingsButton.innerHTML = "API Key Invalid !";
          openSettingsButton.disabled = true;
          openSettingsButton.style.backgroundColor = "red";

          chrome.notifications.create({
              type: 'basic',
              iconUrl: '../images/icon_err.png',
              title: 'Invalid API key',
              message: 'The API key you entered is invalid',
              priority: 2
          });
        }
      });
      
      // Reset the button to its original state after 3 seconds
      setTimeout(function() {
        openSettingsButton.innerHTML = "Settings";
        openSettingsButton.disabled = false;
        openSettingsButton.style.backgroundColor = "#007bff";
      }, 3000);
    });
  };


});





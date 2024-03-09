// This file contains the background worker for the extension
// Author : Valentin GUICHETEAU
// Last update : 2024/03/08
// Repository : https://github.com/ValentinGuicheteau/AlldebridPortable

import { unlockLink } from './scripts/api.js';

chrome.runtime.onInstalled.addListener(function() {

    // Create a context menu item to debrid a link
    chrome.contextMenus.create({
      id: "allDebCtxMenuDebrid",
      title: "Debrid link",
      contexts: ["link"]
    });
  });
  
  // Handle the click event for the context menu item 
  chrome.contextMenus.onClicked.addListener(async function(info, tab) {
    if (info.menuItemId === "allDebCtxMenuDebrid") {
      console.log("Debrid link: " + info.linkUrl);

      try {
        // Get the API key from the local storage as a promise
        const getApiKey = () => {
          return new Promise((resolve, reject) => {
              chrome.storage.local.get('apiKey', function(data) {

                  // If the API key is found, resolve with the API key else reject with a notification
                  if (data.apiKey) {
                      resolve(data.apiKey);
                  } else {
                      console.error('No API key found');

                      chrome.notifications.create({
                          type: 'basic',
                          iconUrl: './images/icon_err.png',
                          title: 'No API key found',
                          message: 'Please enter your API key in the extension settings',
                          priority: 2
                      });
                      reject('No API key found');
                  }
              });
          });
      };
        
        // Get the API key from the local storage
        const apiKey = await getApiKey();

        // Try to unlock the link
        const debridedLink = await unlockLink(info.linkUrl, apiKey);

        // Set the data to show in the popup if the link was unsucessfully debrided
        let toDisplay = 'Link could not be debrided';
        let logo = './images/icon_err.png';
        let message = 'Link could not be debrided';
        let message_bis = '';


        // If the link was successfully debrided, update the data to show in the popup
        if (debridedLink['status'] == 'success') {
          toDisplay = debridedLink.data.link;
          logo = './images/icon_ok.png';
          message = 'Link debrided';
          message_bis = 'Click the extension icon and copy the link to the clipboard.'
        }

        // Finally, store the unlocked link for the popup and create a notification
        chrome.storage.local.set({dataToShow: toDisplay}, () => {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: logo,
            title: message,
            message: message_bis,
            priority: 2
          });
        });
      } catch (error) {
        console.error('Error unlocking link:', error);
      }
    } 
  });
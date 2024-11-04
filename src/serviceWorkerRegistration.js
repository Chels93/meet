/* eslint-disable no-restricted-globals */

// Define the service worker URL
const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

// Function to register the service worker
export const register = (config) => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          if (config && config.onSuccess) {
            config.onSuccess(registration);
          }

          // Handle updates to the service worker
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available; please refresh.
                    console.log('New content is available; please refresh.');
                  } else {
                    // Content is cached for offline use.
                    console.log('Content is cached for offline use.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
          if (config && config.onError) {
            config.onError(error);
          }
        });
    });
  }
};

// Function to unregister the service worker
export const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Error during service worker unregistration:', error);
      });
  }
};

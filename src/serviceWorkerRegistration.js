/* eslint-disable no-restricted-globals */

const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

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

          // Optionally handle updates to the service worker
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

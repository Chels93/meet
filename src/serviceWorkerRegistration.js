// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production and provides
// offline capabilities. However, developers and users will only see deployed updates 
// on subsequent visits to a page after all existing tabs are closed, as previously cached 
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to opt-in,
// read https://cra.link/PWA

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  
      if (publicUrl.origin !== window.location.origin) {
        // Service worker won't work if PUBLIC_URL is on a different origin from the page.
        // This may occur if assets are served via a CDN.
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // Running on localhost. Check if a service worker still exists.
          checkValidServiceWorker(swUrl, config);
  
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'This web app is being served cache-first by a service worker. ' +
                'To learn more, visit https://cra.link/PWA'
            );
          });
        } else {
          // Not localhost. Just register the service worker.
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
  
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Updated content is available; it will be used after all tabs are closed.
                  console.log(
                    'New content is available and will be used when all tabs are closed. ' +
                      'See https://cra.link/PWA.'
                  );
  
                  if (config?.onUpdate) {
                    config.onUpdate(registration);
                  }
                } else {
                  // Content is cached for offline use.
                  console.log('Content is cached for offline use.');
  
                  if (config?.onSuccess) {
                    config.onSuccess(registration);
                  }
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error('Error during service worker registration:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Verify the service worker can be found. If not, reload the page.
    fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
      .then((response) => {
        const contentType = response.headers.get('content-type');
  
        if (
          response.status === 404 ||
          (contentType && !contentType.includes('javascript'))
        ) {
          // No service worker found. Reload the page.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Service worker found. Proceed with registration.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error('Error during service worker unregistration:', error);
        });
    }
  }
  
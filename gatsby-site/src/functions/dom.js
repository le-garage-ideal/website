// Trigger callback when DOM element is ready, after some delay
// because strangely window.addEventListener('ready', ...) does not work
const maxTries = 20;
const delayBetweenTries = 100;
export function onElementReady(selector, callback, tries) {
  const currentTriesNumber = !tries ? 1 : tries + 1;

  if (document) { // not available on server-side rendering
    const element = document.querySelector(selector);
    if (!element) {
      if (currentTriesNumber <= maxTries) {
        setTimeout(() => onElementReady(selector, callback, currentTriesNumber), delayBetweenTries);
      }
    } else {
      callback();
    }
  }
}

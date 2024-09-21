import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';

// Configure Testing Library with a custom timeout
configure({ asyncUtilTimeout: 1000 });

// List of warning messages you want to intentionally ignore
const MESSAGES_TO_IGNORE = [
  "When testing, code that causes React state updates should be wrapped into act(...):",
  "Error:",
  "The above error occurred",
  "Warning: `ReactDOMTestUtils.act` is deprecated in favor of `React.act`"
];

// Save the original console.error
const originalConsoleError = console.error;

// Override console.error to filter out specific messages
console.error = (...args) => {
  // Convert args to a string and check if it contains any of the messages to ignore
  const message = args.join(' ');
  const shouldIgnore = MESSAGES_TO_IGNORE.some(ignored => message.includes(ignored));

  // Only call the original console.error if the message is not in the ignore list
  if (!shouldIgnore) {
    originalConsoleError(...args);
  }
};

// For handling globalThis if needed
window.globalThis = window;

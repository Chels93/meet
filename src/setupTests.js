import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';

// Configure Testing Library with a custom timeout
configure({ asyncUtilTimeout: 1000 });

// List of warning messages you want to intentionally ignore
const MESSAGES_TO_IGNORE = [
  "When testing, code that causes React state updates should be wrapped into act(...):",
  "Error:",
  "The above error occurred"
];

const originalError = console.error.bind(console.error);

console.error = (...args) => {
  const ignoreMessage = MESSAGES_TO_IGNORE.find(message => args.toString().includes(message));
  if (!ignoreMessage) originalError(...args);
};
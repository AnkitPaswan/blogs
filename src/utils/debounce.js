// Debounce utility function
// Delays execution until after wait milliseconds have passed since the last call
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Create a debounced version of a setter function
// Useful for updating state from input with delay
export function createDebouncedSetter(setter, wait = 300) {
  return debounce((value) => {
    setter(value);
  }, wait);
}


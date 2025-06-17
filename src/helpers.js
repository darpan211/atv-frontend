// Utility function to capitalize the first letter of each word
export function toCapitalize(str) {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
} 
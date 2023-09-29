// utils/cookie.js

export function getUsernameFromCookie() {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'myUsername') { // Nama cookie tetap 'myUsername'
          return value;
        }
      }
    }
    return null;
  }
  
  export default function getUsernameFromCookiePage() {
    return <></>;
  }
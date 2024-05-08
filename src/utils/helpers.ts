import type { CookieOptions } from "@/types";

export const maskEmail = (email: string): string => {
  // Split the email at the "@" symbol
  const [username, domain] = email.split("@");

  if (username) {
    // Mask the username, keeping the first and last character
    const maskedUsername =
      username.length > 2
        ? username[0] +
          "*".repeat(username.length - 2) +
          username[username.length - 1]
        : username;

    // Combine the masked username and domain
    return maskedUsername + "@" + domain;
  }
  return "";
};

// Function to set a cookie
export const setCookie = (
  name: string,
  value: string,
  options?: CookieOptions,
) => {
  let cookieStr = `${name}=${encodeURIComponent(value)}`;

  // Set default options
  const defaultOptions: CookieOptions = {
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week in milliseconds
    sameSite: "Strict",
  };

  // Merge provided options with defaults
  const mergedOptions = { ...defaultOptions, ...options };
  const { expires, path, domain, secure, sameSite } = mergedOptions;

  if (expires) {
    cookieStr += `; expires=${expires.toUTCString()}`;
  }
  if (path) {
    cookieStr += `; path=${path}`;
  }
  if (domain) {
    cookieStr += `; domain=${domain}`;
  }
  if (secure) {
    cookieStr += `; secure`;
  }
  if (sameSite) {
    cookieStr += `; SameSite=${sameSite}`;
  }

  if (typeof document !== "undefined") {
    // code that relies on the document object
    document.cookie = cookieStr;
  }
};

// Function to get a cookie value by name
export const getCookie = (name: string): string | null | undefined => {
  if (typeof document !== "undefined") {
    // code that relies on the document object
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const foundCookie = cookies.find((cookie) => {
      const [cookieName, cookieValue] = cookie
        .split("=")
        .map((part) => part.trim());
      return cookieName === name ? cookieValue : null;
    });

    return foundCookie ? foundCookie.split("=")[1] : null;
  }
  return null;
};

// Function to remove a cookie by name
export const removeCookie = (name: string) => {
  setCookie(name, "", { expires: new Date(0) });
};

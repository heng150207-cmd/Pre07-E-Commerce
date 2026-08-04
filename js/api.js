"use strict";

// ================================================================
// api.js
// Shared API helper for Cartora
// ================================================================

const API_BASE_URL =
  "https://martify-api.srengchipor.dev/api/v1";

const STORAGE_KEY_TOKEN = "cartoraAccessToken";
const STORAGE_KEY_USER = "cartoraUser";

/* ================================================================
   AUTH STORAGE
================================================================ */

function getAccessToken() {
  return localStorage.getItem(STORAGE_KEY_TOKEN);
}

function saveAccessToken(token) {
  if (!token || typeof token !== "string") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY_TOKEN,
    token
  );
}

function removeAccessToken() {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
}

function getStoredUser() {
  try {
    const rawUser =
      localStorage.getItem(STORAGE_KEY_USER);

    return rawUser
      ? JSON.parse(rawUser)
      : null;
  } catch (error) {
    console.error(
      "Unable to read stored user:",
      error
    );

    return null;
  }
}

function saveUser(user) {
  if (
    !user ||
    typeof user !== "object"
  ) {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY_USER,
      JSON.stringify(user)
    );
  } catch (error) {
    console.error(
      "Unable to save user:",
      error
    );
  }
}

function clearAuthStorage() {
  removeAccessToken();
  localStorage.removeItem(STORAGE_KEY_USER);
}

/* ================================================================
   ERROR HANDLING
================================================================ */

function getApiErrorMessage(
  responseData,
  status
) {
  const fallbackMessage =
    `Request failed with status ${status}.`;

  if (
    typeof responseData === "string"
  ) {
    return (
      responseData.trim() ||
      fallbackMessage
    );
  }

  if (
    !responseData ||
    typeof responseData !== "object"
  ) {
    return fallbackMessage;
  }

  const errorValue =
    responseData.error;

  if (
    typeof errorValue === "string"
  ) {
    return errorValue;
  }

  if (
    errorValue &&
    typeof errorValue === "object"
  ) {
    return (
      errorValue.description ||
      errorValue.message ||
      errorValue.detail ||
      errorValue.title ||
      stringifyErrorObject(errorValue) ||
      fallbackMessage
    );
  }

  const errorsValue =
    responseData.errors;

  if (Array.isArray(errorsValue)) {
    const arrayMessage = errorsValue
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return (
          item?.description ||
          item?.message ||
          item?.detail ||
          ""
        );
      })
      .filter(Boolean)
      .join(", ");

    if (arrayMessage) {
      return arrayMessage;
    }
  }

  if (
    errorsValue &&
    typeof errorsValue === "object"
  ) {
    const validationMessages =
      Object.values(errorsValue)
        .flat()
        .filter(
          (value) =>
            typeof value === "string"
        )
        .join(", ");

    if (validationMessages) {
      return validationMessages;
    }
  }

  return (
    responseData.message ||
    responseData.description ||
    responseData.detail ||
    responseData.title ||
    fallbackMessage
  );
}

function stringifyErrorObject(value) {
  try {
    const text = JSON.stringify(value);

    return text === "{}"
      ? ""
      : text;
  } catch (error) {
    return "";
  }
}

/* ================================================================
   RESPONSE PARSING
================================================================ */

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") || "";

  try {
    if (
      contentType.includes("application/json")
    ) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error(
      "Unable to parse API response:",
      error
    );

    return null;
  }
}

/* ================================================================
   API REQUEST
================================================================ */

async function apiRequest(
  endpoint,
  options = {}
) {
  if (
    !endpoint ||
    typeof endpoint !== "string"
  ) {
    throw new Error(
      "A valid API endpoint is required."
    );
  }

  const token = getAccessToken();

  const headers =
    new Headers(options.headers || {});

  const hasBody =
    options.body !== undefined &&
    options.body !== null;

  const isFormData =
    hasBody &&
    options.body instanceof FormData;

  if (
    hasBody &&
    !isFormData &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  if (
    token &&
    !headers.has("Authorization")
  ) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    console.error(
      "Network request failed:",
      error
    );

    throw new Error(
      "Unable to connect to the server. Please check your internet connection."
    );
  }

  const responseData =
    await parseResponse(response);

  console.log("API response:", {
    endpoint,
    status: response.status,
    data: responseData,
  });

  if (!response.ok) {
    const errorMessage =
      getApiErrorMessage(
        responseData,
        response.status
      );

    console.error("API error response:", {
      endpoint,
      status: response.status,
      data: responseData,
      message: errorMessage,
    });

    if (
      response.status === 401
    ) {
      clearAuthStorage();
    }

    throw new Error(errorMessage);
  }

  return responseData;
}

async function clearCart(userUuid) {
  return await apiRequest(
    `/carts/${encodeURIComponent(userUuid)}/clear-cart`,
    {
      method: "DELETE",
    }
  );
}
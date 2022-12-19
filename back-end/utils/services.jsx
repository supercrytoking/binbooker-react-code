// Use these functions like this:

// try {
//   const bins = await post(...);
//   setBins(bins);
//   setError(null);
// } catch (errorMessage) {
//   setError(errorMessage);
// }

// A valid success response is like this:
// Common::sendResponse(200);           or
// Common::sendResponse(200, [...]);

// A valid failure response is like this:
// Common::sendResponse(400, 'Description of error');

export const get = async function(url) {
  const response = await fetch(url, {
    credentials: "include" // need for safari 10
  });

  return await returnSomething(response);
};

export const post = async function(url = "", data = {}) {
  //PHP has to do this:
  //$_POST = json_decode(file_get_contents('php://input'), true);

  const response = await fetch(url, {
    method: "POST",
    // mode: "cors", // no-cors, cors, *same-origin
    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    // redirect: "follow", // manual, *follow, error
    // referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  return await returnSomething(response);
};

export const postFile = async function(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      // enctype: "multipart/form-data"
    },
    body: data
  });

  return await returnSomething(response);
};

export const remove = async function(url = "", data = {}) {
  //PHP has to do this:
  // $_DELETE = json_decode(file_get_contents('php://input'), true);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await returnSomething(response);
};

export const put = async function(url = "", data = {}) {
  //PHP has to do this:
  //$_PUT = json_decode(file_get_contents('php://input'), true);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await returnSomething(response);
};

async function returnSomething(response) {
  if (response.ok) {
    return await response.json();
  } else {
    const errorMessage = await response.text();
    throw errorMessage;
  }
}

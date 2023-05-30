const BASE_URL = "http://localhost:3000/";

export const makePostRequest = async (url, payload) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status >= 200 && response.status < 300) {
    return await response.json();
  } else throw Error((await response.json()).message);
};

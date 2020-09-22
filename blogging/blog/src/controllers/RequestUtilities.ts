const API_ROOT = "http://localhost:5000";
const FRONTEND_ROOT = "http://localhost:3000";

const GET = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const POST = async (url: string, body: Object) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
  const data = await response.json();
  return data;
};

const makeQuery = (endpoint: string, params = {}) => {
  const noParamURL = API_ROOT + endpoint;
  const paramURL = appendParams(noParamURL, params);
  return paramURL;
};

const makeURL = (params = {}, page = "") => {
  const noParamURL = `${FRONTEND_ROOT}/${page}`;
  const paramURL = appendParams(noParamURL, params);
  return paramURL;
};

const appendParams = (url: string, params: Record<string, string>) => {
  const fullURL = new URL(url);
  fullURL.search = new URLSearchParams(params).toString();
  return fullURL.href;
};

const getSearchParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};

export { makeQuery, makeURL, GET, POST, getSearchParams };

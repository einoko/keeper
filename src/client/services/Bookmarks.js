import axios from "axios";

const bookmarkUrl = "/bookmarks/";
const tagUrl = "/tags/";

const getAll = () => {
  const request = axios.get(bookmarkUrl);
  return request.then(response => response.data);
};

const createBookmark = bookmarkObject => {
  const request = axios.post(bookmarkUrl, bookmarkObject);
  return request.then(response => response.data);
};

const editBookmark = (bookmarkObject, id) => {
  const request = axios.patch(bookmarkUrl + id, bookmarkObject);
  return request.then(response => response.data);
};

const setToRead = (bookmarkObject, id) => {
  const request = axios.patch(bookmarkUrl + "read/" + id, bookmarkObject);
  return request.then(response => response.data);
};

const deleteBookmark = id => {
  const request = axios.delete(bookmarkUrl + id);
  return request.then(response => response.data);
};

const getByTag = tag => {
  const request = axios.get(tagUrl + tag);
  return request.then(response => response.data);
};

const getURL = urlObject => {
  const request = axios.post("/helper/title", urlObject);
  return request.then(response => response.data);
};

/*const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then(response => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(response => response.data);
};*/

export default {
  getAll,
  createBookmark,
  editBookmark,
  deleteBookmark,
  getByTag,
  getURL,
  setToRead
};

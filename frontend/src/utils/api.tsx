import axios from "axios";
import { BASE_URL } from "./constants";

export const simplifyText = (text, audience) => axios.post(`${BASE_URL}/simplify`, { text, audience });
export const uploadFile = (file, audience) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("audience", audience);
  return axios.post(`${BASE_URL}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } });
};
export const submitRating = (rating) => axios.post(`${BASE_URL}/rating`, null, { params: { rating } });




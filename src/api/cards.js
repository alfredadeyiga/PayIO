import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_CARD_GENR_URL });

export async function generateCard(type) {
  const res = await api.get(`/generate?type=${type}`);

  return res.data;
}

export async function getCardTypes() {
  const res = await api.get("/types");

  return res.data;
}

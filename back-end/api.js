import { get } from "Utils/services.jsx";

export async function getUser() {
  return await get("/api/v2/user");
}

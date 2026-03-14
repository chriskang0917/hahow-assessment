import { HttpResponse, http } from "msw";
import { createProxyHandler } from "@/mocks/proxy-handler";

const generateMockJWT = (expireInHours: number) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expireInHours * 60 * 60;

  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    name: "Root",
    iat: now,
    exp: exp,
  };

  const base64Header = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const base64Payload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${base64Header}.${base64Payload}.fake-signature`;
};

const MOCK_TOKEN = {
  access: generateMockJWT(0.5), // Expire in 30 minutes
  refresh: generateMockJWT(24 * 7), // Expire in 1 days
};

export const handlers = [
  createProxyHandler(http.post, "/api/auth/token/obtain", () => {
    return HttpResponse.json({
      access: MOCK_TOKEN.access,
      refresh: MOCK_TOKEN.refresh,
    });
  }),
  createProxyHandler(http.post, "/api/auth/token/verify", () => {
    return new HttpResponse({ status: 204 });
  }),
  createProxyHandler(http.post, "/api/auth/token/refresh", () => {
    return HttpResponse.json({
      access: MOCK_TOKEN.access,
      refresh: MOCK_TOKEN.refresh,
    });
  }),
  createProxyHandler(http.get, "/api/user/me", () => {
    return HttpResponse.json({
      id: 1,
      name: "test",
      email: "test@test.com",
      role: "root",
    });
  }),
];

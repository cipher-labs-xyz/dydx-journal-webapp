import { Sessions } from "./dataProcessing";

export const getLimits = (t: Date, p: number) => {
  const time = new Date(t);
  let start = time.toISOString();
  time.setDate(time.getDate() - p);
  const end = time.toISOString();
  return { start, end };
};

type SessionName = "european" | "asian" | "american" | "N/A"
export const getMaxSession = (sessions: Sessions): SessionName => {
  if (sessions.asian == 0 && sessions.american == 0 && sessions.european == 0) return "N/A"
  let largest: SessionName = "N/A"
  let largestValue = -Infinity
  for (const [key, value] of Object.entries(sessions)) {
    if (value > largestValue) {
      largest = key as SessionName
      largestValue = value
    }
  }
  return largest
}

export const setApiKeyCredentials = (key: string, passphrase: string, secret: string, remember: boolean) => {
  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem("dYdX_api_key", key);
  storage.setItem("dYdX_api_passphrase", passphrase);
  storage.setItem("dYdX_api_secret", secret);
};

export const getApiKeyCredentials = () => {
  if (typeof window === "undefined") return undefined
  const key = window.localStorage.getItem("dYdX_api_key") || window.sessionStorage.getItem("dYdX_api_key");
  const passphrase =
    window.localStorage.getItem("dYdX_api_passphrase") || window.sessionStorage.getItem("dYdX_api_passphrase");
  const secret = window.localStorage.getItem("dYdX_api_secret") || window.sessionStorage.getItem("dYdX_api_secret");
  if (!key || !secret || !passphrase) return undefined;
  return { key, secret, passphrase };
};

export const clearApiKeyCredentials = () => {
  window.localStorage.removeItem("dYdX_api_key");
  window.localStorage.removeItem("dYdX_api_passphrase");
  window.localStorage.removeItem("dYdX_api_secret");
  window.sessionStorage.removeItem("dYdX_api_key");
  window.sessionStorage.removeItem("dYdX_api_passphrase");
  window.sessionStorage.removeItem("dYdX_api_secret");
};

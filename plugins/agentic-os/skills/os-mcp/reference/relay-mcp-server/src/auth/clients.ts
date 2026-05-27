import path from "node:path";
import crypto from "node:crypto";
import { DATA_DIR } from "../config.js";
import { loadJson, saveJson } from "./jsonfile.js";
import type { OAuthClientInformationFull } from "@modelcontextprotocol/sdk/shared/auth.js";
import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";

const CLIENTS_FILE = path.join(DATA_DIR, "clients.json");

type Store = Record<string, OAuthClientInformationFull>;

let cache: Store | null = null;

function load(): Store {
  if (cache) return cache;
  cache = loadJson<Store>(CLIENTS_FILE, {});
  return cache;
}

function persist(): void {
  if (!cache) return;
  saveJson(CLIENTS_FILE, cache);
}

export const clientsStore: OAuthRegisteredClientsStore = {
  getClient(clientId) {
    return load()[clientId];
  },
  registerClient(client) {
    const store = load();
    const client_id = crypto.randomBytes(16).toString("hex");
    const client_secret = client.token_endpoint_auth_method === "none"
      ? undefined
      : crypto.randomBytes(32).toString("hex");
    const full: OAuthClientInformationFull = {
      ...client,
      client_id,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      ...(client_secret ? { client_secret } : {}),
    };
    store[client_id] = full;
    persist();
    return full;
  },
};

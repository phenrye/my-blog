import { createClient } from "@supabase/supabase-js";
import { HttpsProxyAgent } from "https-proxy-agent";

const isDev = process.env.NODE_ENV === "development";

const customFetch: typeof fetch = isDev
  ? ((input, init) => {
      const agent = new HttpsProxyAgent("http://127.0.0.1:7897");
      return fetch(input, { ...init, agent } as RequestInit);
    })
  : (...args) => fetch(...args);

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { fetch: customFetch } }
);

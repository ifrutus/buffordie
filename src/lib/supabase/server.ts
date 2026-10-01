import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/** Cliente com a sessão do usuário (Server Actions, Route Handlers). */
export async function supabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) cookieStore.set(name, value, options);
        } catch {
          // Chamado de um Server Component: o proxy.ts cuida de renovar a sessão.
        }
      },
    },
  });
}

/** Cliente anônimo para leituras públicas — não toca em cookies, então as páginas podem ser cacheadas. */
export function supabasePublic() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60, tags: ["posts"] } }) },
  });
}

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the home page after sign in
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}

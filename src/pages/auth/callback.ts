export const prerender = false;

import type { APIRoute } from 'astro'
import { createServerSupabase } from '@/lib/supabaseClient'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (!code) {
    return redirect('/signin?error=missing-code')
  }

  try {
    const supabase = createServerSupabase()

    // Échanger le code contre une session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !session) {
      console.error('Erreur lors de l\'échange du code:', error)
      return redirect('/signin?error=auth-error')
    }

    // Définir les cookies de session
    const { access_token, refresh_token } = session

    cookies.set('sb-access-token', access_token, {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 heure
    })

    cookies.set('sb-refresh-token', refresh_token, {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })

    // Rediriger vers la page demandée ou la page d'accueil
    return redirect(next)
  } catch (error) {
    console.error('Erreur lors du traitement du callback OAuth:', error)
    return redirect('/signin?error=server-error')
  }
} 
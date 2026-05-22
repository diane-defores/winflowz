import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { SITE, getLocalizedSiteUrl } from '@/constants';

type SignupSource = 'footer' | 'lead-magnet' | 'windows-mastery' | 'unknown';
type SignupLang = 'fr' | 'en';

type ResendError = {
  name?: string;
  statusCode?: number | null;
  message?: string;
};

function normalizeLang(value: unknown): SignupLang {
  return value === 'fr' ? 'fr' : 'en';
}

function normalizeSource(value: unknown): SignupSource {
  if (value === 'footer' || value === 'lead-magnet' || value === 'windows-mastery') {
    return value;
  }

  return 'unknown';
}

function getNewsletterSegmentId(): string | null {
  const segmentId = import.meta.env.RESEND_SEGMENT_ID?.trim();
  return segmentId || null;
}

function isResendNotFound(error: ResendError | null | undefined) {
  return error?.name === 'not_found' || error?.statusCode === 404;
}

function assertResendSuccess(
  operation: string,
  result: { error: ResendError | null }
) {
  if (!result.error) {
    return;
  }

  throw new Error(`resend_${operation}_failed:${result.error.name ?? 'unknown'}`);
}

function buildWelcomeEmail(lang: SignupLang, source: SignupSource, email: string) {
  const salesPageUrl = getLocalizedSiteUrl(
    lang,
    lang === 'fr' ? '/maitrise-windows' : '/windows-mastery'
  );
  const unsubscribeUrl = getLocalizedSiteUrl(
    lang,
    `/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
  );

  const content =
    lang === 'fr'
      ? {
          subject:
            source === 'lead-magnet'
              ? 'Bienvenue chez WinFlowz — votre prochaine etape'
              : 'Bienvenue chez WinFlowz',
          heading: 'Bienvenue chez WinFlowz',
          intro:
            "Vous etes bien inscrit(e). Le point de depart le plus utile pour comprendre l'approche WinFlowz est maintenant la page dediee a la formation Windows.",
          body:
            "L'idee centrale est simple : vous n'avez pas forcement besoin de plus de motivation. Vous avez souvent surtout besoin de moins de friction, moins de bruit et d'un environnement plus coherent.",
          cta: 'Voir la page de vente',
          footer:
            "Vous recevrez ensuite des emails plus utiles et plus structures que le message de bienvenue generique qu'il y avait avant.",
          unsubscribe: 'Se desabonner',
        }
      : {
          subject:
            source === 'lead-magnet'
              ? 'Welcome to WinFlowz — your next step'
              : 'Welcome to WinFlowz',
          heading: 'Welcome to WinFlowz',
          intro:
            'You are subscribed. The most useful starting point for understanding the WinFlowz approach is now the dedicated Windows course sales page.',
          body:
            'The core idea is simple: you probably do not need more motivation first. You mostly need less friction, less noise, and a more coherent work environment.',
          cta: 'See the sales page',
          footer:
            'You will now receive a more coherent path than the older generic welcome email.',
          unsubscribe: 'Unsubscribe',
        };

  return {
    subject: content.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171717;">
        <h1 style="color: #171717; font-size: 28px; line-height: 1.2; margin-bottom: 16px;">${content.heading}</h1>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">${content.intro}</p>
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px;">${content.body}</p>
        <p style="margin: 0 0 24px;">
          <a
            href="${salesPageUrl}"
            style="display: inline-block; background: #171717; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600;"
          >${content.cta}</a>
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #525252; margin: 0 0 24px;">${content.footer}</p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #737373;">
          <a href="${unsubscribeUrl}" style="color: #737373;">${content.unsubscribe}</a>
        </p>
      </div>
    `,
  };
}

export const POST: APIRoute = async ({ request }) => {
  const resendKey = import.meta.env.RESEND_API_KEY;
  if (!resendKey || resendKey === 're_PLACEHOLDER') {
    return new Response(
      JSON.stringify({ error: 'Newsletter service not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const segmentId = getNewsletterSegmentId();
  if (!segmentId) {
    return new Response(
      JSON.stringify({ error: 'Newsletter segment not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const resend = new Resend(resendKey);

  try {
    const body = await request.json();
    const { email, lang: rawLang, source: rawSource } = body;
    const lang = normalizeLang(rawLang);
    const source = normalizeSource(rawSource);

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const properties = {
      signup_lang: lang,
      signup_source: source,
    };

    const updateResult = await resend.contacts.update({
      email,
      unsubscribed: false,
      properties,
    });

    if (updateResult.error) {
      if (!isResendNotFound(updateResult.error)) {
        assertResendSuccess('contact_update', updateResult);
      }

      const createResult = await resend.contacts.create({
        email,
        unsubscribed: false,
        segments: [{ id: segmentId }],
        properties,
      });
      assertResendSuccess('contact_create', createResult);
    } else {
      const segmentListResult = await resend.contacts.segments.list({
        email,
        limit: 100,
      });
      assertResendSuccess('contact_segments_list', segmentListResult);

      const isAlreadyInNewsletterSegment = (segmentListResult.data?.data ?? []).some(
        (segment) => segment.id === segmentId
      );

      if (!isAlreadyInNewsletterSegment) {
        const segmentAddResult = await resend.contacts.segments.add({
          email,
          segmentId,
        });
        assertResendSuccess('contact_segment_add', segmentAddResult);
      }
    }

    const welcomeEmail = buildWelcomeEmail(lang, source, email);

    const emailResult = await resend.emails.send({
      from: `${SITE.name} <${SITE.emails.newsletter}>`,
      to: email,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
    });
    assertResendSuccess('welcome_email_send', emailResult);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(
      'Newsletter subscribe error:',
      err instanceof Error ? err.message : 'unknown'
    );
    return new Response(
      JSON.stringify({ error: 'Failed to subscribe' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

import { createClient } from '@supabase/supabase-js';
import { randomBytes, createHash } from 'crypto';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

function generateApiKey(prefix: string = 'wf'): string {
  const bytes = randomBytes(32);
  const base64 = bytes.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return `${prefix}_${base64}`;
}

function hashApiKey(apiKey: string): string {
  return createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

export async function createApiKeyForPurchase(userId: string, productId: string) {
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      product_id: productId,
      key_hash: keyHash,
      status: 'active'
    })
    .select(`
      *,
      products (
        name,
        description
      )
    `)
    .single();

  if (error) throw error;

  // On retourne la clé en clair uniquement à ce moment
  return {
    apiKey,
    keyData: data
  };
}

export async function getUserApiKeys(userId: string) {
  const { data, error } = await supabase
    .from('api_keys')
    .select(`
      *,
      products (
        name,
        description
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function validateApiKey(apiKey: string) {
  const keyHash = hashApiKey(apiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .select(`
      *,
      products (
        name,
        description,
        limits
      )
    `)
    .eq('key_hash', keyHash)
    .eq('status', 'active')
    .single();

  if (error || !data) return null;

  // Mettre à jour last_used_at
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  return data;
}

export async function logApiUsage(apiKeyId: string, endpoint: string, tokensUsed: number = 0) {
  const { error } = await supabase
    .from('api_usage_logs')
    .insert({
      api_key_id: apiKeyId,
      endpoint,
      tokens_used: tokensUsed
    });

  if (error) throw error;
} 
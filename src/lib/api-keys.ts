/**
 * API Key Management Module
 * 
 * This module provides secure API key generation, hashing, and lifecycle
 * management for product access control. API keys are used to authenticate
 * user access to purchased products and services.
 * 
 * Security considerations:
 * - Keys are generated using cryptographically secure random bytes
 * - Only the SHA-256 hash is stored; the original key cannot be recovered
 * - Keys can have expiration dates and permission scopes
 * - Usage is tracked for analytics and rate limiting
 * 
 * @module api-keys
 */

import { supabase } from './supabaseClient';
import { randomBytes, createHash } from 'crypto';

interface CreateApiKeyOptions {
  userId: string;
  name: string;
  expiration?: string;
  permissions?: string[];
}

/**
 * Generates a cryptographically secure API key with a prefix.
 * 
 * Key format: {prefix}_{base64-url-safe-string}
 * Example: wf_X7kM9pL2qR5sT8vW3yZ6...
 * 
 * The prefix helps identify the key type and makes keys visually
 * distinguishable from other tokens. Base64 URL-safe encoding ensures
 * the key can be safely used in URLs and headers.
 * 
 * @param prefix - Key prefix for identification (default: 'wf' for WinFlowz)
 * @returns 32-byte random key in prefixed base64 URL-safe format
 */
export function generateApiKey(prefix: string = 'wf'): string {
  const bytes = randomBytes(32);
  // Convert to URL-safe base64: replace + with -, / with _, remove padding =
  const base64 = bytes.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return `${prefix}_${base64}`;
}

/**
 * Creates a one-way SHA-256 hash of an API key for secure storage.
 * 
 * We only store the hash, never the original key. This means:
 * - If the database is compromised, keys cannot be recovered
 * - The original key must be shown to the user exactly once at creation
 * - Validation works by hashing the provided key and comparing hashes
 * 
 * @param apiKey - The plain text API key to hash
 * @returns Hexadecimal SHA-256 hash (64 characters)
 */
export function hashApiKey(apiKey: string): string {
  return createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

/**
 * Creates a custom API key with user-defined name, expiration, and permissions.
 * 
 * This is used for user-generated keys (e.g., from a dashboard) where users
 * need more control over key properties. The plain text key is returned only
 * once - it cannot be retrieved later.
 * 
 * @param options.userId - The user who owns this key
 * @param options.name - Human-readable identifier for the key
 * @param options.expiration - Days until expiration, or 'never' for no expiry
 * @param options.permissions - Array of permission scopes for this key
 * @returns Promise with the plain text key (show to user) and stored key data
 * @throws If database insert fails
 */
export async function createCustomApiKey({ userId, name, expiration, permissions = [] }: CreateApiKeyOptions) {
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  // Calculate expiration date if not set to 'never'
  let expiresAt: Date | null = null;
  if (expiration && expiration !== 'never') {
    const days = parseInt(expiration);
    expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);
  }

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      name,
      key_hash: keyHash,
      permissions,
      expires_at: expiresAt,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;

  // Return both the plain key (for the user) and the stored data
  return {
    apiKey,    // Show this to user ONCE - cannot be retrieved later
    keyData: data
  };
}

/**
 * Creates an API key associated with a product purchase.
 * 
 * Unlike custom keys, purchase keys are automatically linked to a product
 * and may inherit product-specific limits and permissions. These keys
 * enable access to the purchased product's features.
 * 
 * @param userId - The user who made the purchase
 * @param productId - The product that was purchased
 * @returns Promise with the plain text key and stored key data with product info
 * @throws If database insert fails
 */
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
    // Join with products to return product details with the key
    .select(`
      *,
      products (
        name,
        description
      )
    `)
    .single();

  if (error) throw error;

  return {
    apiKey,    // Show this to user ONCE - cannot be retrieved later
    keyData: data
  };
}

/**
 * Retrieves all API keys belonging to a user.
 * 
 * Returns key metadata only - the original key values cannot be retrieved.
 * Includes associated product information for purchase-linked keys.
 * 
 * @param userId - The user whose keys to retrieve
 * @returns Promise with array of key records and associated product data
 * @throws If database query fails
 */
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

/**
 * Validates an API key and returns associated data if valid.
 * 
 * Validation process:
 * 1. Hash the provided key
 * 2. Look up the hash in the database
 * 3. Verify the key status is 'active'
 * 4. Update last_used_at timestamp for usage tracking
 * 5. Return key data with product limits for authorization checks
 * 
 * @param apiKey - The plain text API key to validate
 * @returns Promise with key data (including product limits) or null if invalid
 */
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

  // Track last usage time for analytics and security monitoring
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id);

  return data;
}

/**
 * Records an API usage event for analytics and rate limiting.
 * 
 * Logs each API call with endpoint and token consumption. This data
 * enables usage-based billing, quota enforcement, and usage analytics.
 * 
 * @param apiKeyId - The ID of the key used for the request
 * @param endpoint - The API endpoint that was called
 * @param tokensUsed - Number of tokens/credits consumed (default: 0)
 * @throws If database insert fails
 */
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
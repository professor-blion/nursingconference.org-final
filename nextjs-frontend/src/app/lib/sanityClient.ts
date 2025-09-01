import { createClient } from '@sanity/client'

// Central safe factory used across the app.
// Provide safe defaults so build never crashes due to empty envs.
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  'fl5uetho'
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  'production'
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_API_VERSION ||
  '2023-10-10'

// Read-only client for build/module scope
export const sanityReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: undefined,
})

// Lazily create authenticated client only when a token is actually present
export function getSanityClient() {
  const token = process.env.SANITY_READ_TOKEN || process.env.SANITY_API_TOKEN
  if (token && projectId) {
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
    })
  }
  return sanityReadClient
}

export async function fetchFirst<T = any>(
  query: string,
  params: Record<string, any> = {}
): Promise<T> {
  const client = getSanityClient()
  return client.fetch(query, params)
}

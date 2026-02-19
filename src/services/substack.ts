/**
 * Substack Notes publisher (unofficial API).
 *
 * Substack has no official API. This uses the same REST endpoints
 * their frontend calls, authenticated via session cookie.
 *
 * This is inherently fragile — if it breaks, assets fall back to
 * manual posting from the Notion dashboard.
 */

/** Post a note to Substack */
export async function postNote(content: string): Promise<string> {
  // TODO: POST to substack.com/api/v1/note with session cookie auth
  // Return URL of the published note
  throw new Error("Not implemented");
}

// Project-wide config. The Agentic OS Starter skill writes this file during setup.
// Edit by hand to add/remove profiles, change the org name, or point at different
// tenants. After changes, restart the dev server (or redeploy).

export const ORG_NAME = "{{ORG_NAME}}";

// Team members surfaced in the dashboard. The first entry is the "primary" profile.
// Each profile gets its own /profile/<Name> page. Avatar files live in public/avatars/.
export const PROFILES: readonly string[] = {{PROFILES_JSON}};

// Convenience: the primary profile is used for default mentions/search queries
// in snapshot prompts. Override per-environment with PRIMARY_PROFILE env var.
export const PRIMARY_PROFILE =
  process.env.PRIMARY_PROFILE || PROFILES[0] || "Owner";

// Per-tenant identifiers for snapshot refreshes. Set these in your hosting env
// (Railway dashboard, .env.local for local dev). If unset, the relevant snapshot
// will skip that source.
export const TENANT = {
  unipileBaseUrl:        process.env.UNIPILE_BASE_URL || "",          // e.g. https://apiXX.unipile.com:NNNNN
  unipileLinkedInAccountId: process.env.UNIPILE_LINKEDIN_ACCOUNT_ID || "",
  circleOwnerEmail:      process.env.CIRCLE_OWNER_EMAIL || "",         // email used to log into Circle
  youtubeChannelId:      process.env.YOUTUBE_CHANNEL_ID || "",
  youtubeChannelHandle:  process.env.YOUTUBE_CHANNEL_HANDLE || "",
} as const;

export type ProfileName = string;

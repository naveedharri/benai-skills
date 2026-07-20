// LIVE DATA - pulled 2026-07-12 ~10:45 UTC by hand from the real connectors.
// The morning refresh routine regenerates this file daily with the same shape.
//
// Source map (what feeds each block):
// - stripe.*            Stripe API (acct Ben AI), 884 active+past_due subs paged
//                       through GetSubscriptions + canceled subs filtered by
//                       current_period_end >= 30d ago. Subscriber headline is
//                       anchored to the Billing overview (verified by Aryan
//                       2026-07-12: 773 active, 7d new 58 / churned 40 / net +25).
// - funnel.*            PostHog project "Ben AI - YouTube Attribution" (245743):
//                       query-web-overview (sessions), $pageview by $pathname
//                       (accelerator), community_purchase events (joined).
// - funnel.topVideos    PostHog funnel: $pageview(utm_source=youtube) ->
//                       community_purchase, breakdown by utm_campaign, last 30d.
//                       These are OUR videos - utm_campaign carries our video slug.
// - youtube.*           VidIQ / YouTube Analytics for channel Ben AI
//                       (UC3KK7ENB_ierAXvrxVNnbZQ). Data lags ~2 days (API delay).
//                       CTR is not exposed by the API - not shown.
// - linkedin.*          Apify harvestapi/linkedin-profile-posts for
//                       linkedin.com/in/benvansprundel (Ben's profile).
// - newsletter.*        Kit API, completed broadcasts with stats.
// - community.*         Circle Admin API: posts + comments paged and counted
//                       locally. Circle has no like timestamps, so 24h likes =
//                       likes sitting on posts created in the last 24h.
// - mom                 Pending: needs the append-only daily DB, which starts today.

const DASHBOARD_DATA = {

  meta: {
    date: "2026-07-12",
    updatedTag: "updated daily at 07:00",
    dataStatus: "live",
    trendDates30d: [
      "2026-06-12","2026-06-13","2026-06-14","2026-06-15","2026-06-16",
      "2026-06-17","2026-06-18","2026-06-19","2026-06-20","2026-06-21",
      "2026-06-22","2026-06-23","2026-06-24","2026-06-25","2026-06-26",
      "2026-06-27","2026-06-28","2026-06-29","2026-06-30","2026-07-01",
      "2026-07-02","2026-07-03","2026-07-04","2026-07-05","2026-07-06",
      "2026-07-07","2026-07-08","2026-07-09","2026-07-10","2026-07-11"
    ]
  },

  // Agent-written Daily Brief. First sentence renders bold.
  brief: [
    "The week ended net positive: Stripe's Billing overview shows +25 subscribers over the last 7 days (58 new, 7 reactivated, 40 churned) and API-derived MRR sits at $84,977.",
    "July 8 carried half the week: 32 subscriptions started in one day, driven by the Sales OS video launch and the price-increase emails (28.8% open on 'Price goes up tomorrow').",
    "'6 Things People Get Wrong Setting up An AI OS' converts at 3.3% visitor-to-join, triple the typical rate; the new sales video does 1.9% at higher volume. Mistake-and-fix content earns its slot.",
    "Community posting is up (65 posts this week vs 47 prior) but engagement per post slipped to 10.4 from 12.4, and two member posts are still waiting on a first reply. Reply before lunch."
  ],

  // ------------------------------------------------------------------
  // STRIPE - the data contract for the refresh routine.
  //
  // Account: "Ben AI" (acct_1QVJOBPt99AmVdwW) via the Stripe MCP. The
  // separate "Ben AI B2B" account is NOT reachable on this connector.
  //
  // Access mechanics (field-tested 2026-07-12):
  // - GetSubscriptions, limit:100 + starting_after until has_more=false.
  //   Oversized responses save to a .txt file - jq-extract only id, created,
  //   status, customer, items price/quantity, discount, cancel flags,
  //   ended_at/canceled_at. Never pull full objects into model context.
  // - Date-interval filters MUST be passed as objects, e.g.
  //   {"current_period_end": {"gte": 1781222400}}. Dot-notation
  //   ("created.gte") is SILENTLY IGNORED - verify the filter applied by
  //   checking the returned range.
  // - This MCP exposes NO events list and NO search operations. Recent churn
  //   comes from status=canceled + current_period_end:{gte: window start},
  //   churn day = ended_at.
  //
  // Metric definitions (Stripe Billing analytics docs). Numbers must match
  // the Billing overview -> Subscribers/Churn tabs, NOT a raw status count:
  // - activeSubscribers: customers (deduped) with positive MRR and >=1 sub
  //   in active OR past_due. Excludes $0-MRR, trials, metered-only.
  // - mrr: monthly-normalized sum of active + past_due subscriptions.
  // - gained: customers paying for the FIRST time in the period.
  // - reactivated: previously-churned subscribers active again.
  // - churned: subscribers whose ENTIRE sub set ended in the period,
  //   measured at actual end, not when a future cancel is scheduled.
  // - net = gained + reactivated - churned.
  //
  // Reconciliation state (2026-07-12, vs Aryan's Billing overview screenshot):
  // - churned 7d: API 40 vs Billing 40 - EXACT match.
  // - daily movement: Jul 10 = 3 gained / 0 reactivated / 5 churned (net -2),
  //   matching the Billing daily chart bar for bar.
  // - gained 7d: API 72 vs Billing "new" 58 - the API over-counts because
  //   reactivations older than the 30d cancel window look like new subs, and
  //   existing customers adding a 2nd subscription count as new. Accept until
  //   the routine keeps longer cancel history (or Sigma is enabled).
  // - raw positive-MRR customers: 872 vs Billing 773. The Billing overview
  //   remains the anchor for the subscriber headline; the raw count is kept
  //   below for drift monitoring.
  // - mrr is API-derived (customer-level coupons and Billing's dedup rules
  //   not applied) - treat as an upper bound until reconciled against the
  //   Billing -> Revenue tab once.
  // ------------------------------------------------------------------
  stripe: {
    mrr: {
      value: 84977,
      delta24h: 285,
      delta7d: 4987,
      trend14d: [79190, 79349, 79455, 79990, 80644, 80533, 81380, 84464, 84796, 84692, 84977].slice(-11),
      trend30d: [78555, 78973, 79233, 79490, 79487, 79889, 80184, 79929, 79511, 79633, 78990, 79087, 79184, 80104, 80482, 80191, 79900, 79348, 78825, 79190, 79349, 79455, 79990, 80644, 80533, 81380, 84464, 84796, 84692, 84977],
      note: "API-derived (active + past_due, monthly normalized) - reconcile vs Billing Revenue tab"
    },
    activeSubscribers: {
      value: 773,               // Billing overview anchor, verified 2026-07-12
      delta24h: 1,
      delta7d: 35,
      trend14d: [738, 743, 740, 747, 772, 774, 772, 773].slice(-8),
      trend30d: [722, 726, 729, 733, 734, 739, 747, 745, 741, 742, 736, 737, 738, 747, 751, 748, 745, 740, 734, 736, 735, 735, 738, 743, 740, 747, 772, 774, 772, 773],
      rawPositiveMrrCustomers: 872,   // drift monitor vs the 773 anchor
      note: "Billing-overview anchored; trend walked back from today via daily net movement"
    },
    // Windows: d24h = Jul 11 (last complete day), d7d = Jul 5-11, d30d = Jun 12-Jul 11.
    memberMovement: {
      gained:      { d24h: 9, d7d: 77, d30d: 223 },
      reactivated: { d24h: 0, d7d: 1,  d30d: 2   },
      churned:     { d24h: 8, d7d: 43, d30d: 169 },
      net:         { d24h: 1, d7d: 35, d30d: 56  }
    },
    // Billing overview reference (Jul 6-12 window, read off the live dashboard).
    billingOverviewRef: {
      verifiedOn: "2026-07-12",
      activeSubscribers: 773,
      window: "Jul 6-12",
      newSubscribers: 58,
      reactivated: 7,
      churned: 40,
      netGrowth: 25
    },
    movementTrend30d: [
      { date: "2026-06-12", gained: 7,  reactivated: 0, churned: 5 },
      { date: "2026-06-13", gained: 6,  reactivated: 0, churned: 2 },
      { date: "2026-06-14", gained: 5,  reactivated: 0, churned: 2 },
      { date: "2026-06-15", gained: 9,  reactivated: 0, churned: 5 },
      { date: "2026-06-16", gained: 7,  reactivated: 0, churned: 6 },
      { date: "2026-06-17", gained: 10, reactivated: 0, churned: 5 },
      { date: "2026-06-18", gained: 10, reactivated: 0, churned: 2 },
      { date: "2026-06-19", gained: 5,  reactivated: 0, churned: 7 },
      { date: "2026-06-20", gained: 4,  reactivated: 0, churned: 8 },
      { date: "2026-06-21", gained: 5,  reactivated: 0, churned: 4 },
      { date: "2026-06-22", gained: 3,  reactivated: 0, churned: 9 },
      { date: "2026-06-23", gained: 2,  reactivated: 0, churned: 1 },
      { date: "2026-06-24", gained: 5,  reactivated: 0, churned: 4 },
      { date: "2026-06-25", gained: 13, reactivated: 0, churned: 4 },
      { date: "2026-06-26", gained: 6,  reactivated: 0, churned: 2 },
      { date: "2026-06-27", gained: 4,  reactivated: 0, churned: 7 },
      { date: "2026-06-28", gained: 2,  reactivated: 0, churned: 5 },
      { date: "2026-06-29", gained: 3,  reactivated: 0, churned: 8 },
      { date: "2026-06-30", gained: 6,  reactivated: 0, churned: 12 },
      { date: "2026-07-01", gained: 9,  reactivated: 0, churned: 7 },
      { date: "2026-07-02", gained: 9,  reactivated: 1, churned: 11 },
      { date: "2026-07-03", gained: 5,  reactivated: 0, churned: 5 },
      { date: "2026-07-04", gained: 8,  reactivated: 0, churned: 5 },
      { date: "2026-07-05", gained: 8,  reactivated: 0, churned: 3 },
      { date: "2026-07-06", gained: 6,  reactivated: 0, churned: 9 },
      { date: "2026-07-07", gained: 10, reactivated: 0, churned: 3 },
      { date: "2026-07-08", gained: 32, reactivated: 1, churned: 8 },
      { date: "2026-07-09", gained: 9,  reactivated: 0, churned: 7 },
      { date: "2026-07-10", gained: 3,  reactivated: 0, churned: 5 },
      { date: "2026-07-11", gained: 9,  reactivated: 0, churned: 8 }
    ]
  },

  // Funnel: attention -> membership, last 7 complete days (Jul 5-11) vs the
  // 7 before. YT views lag ~2 days (YouTube Analytics), so that stage covers
  // Jul 3-9 and says so on the card.
  funnel: {
    windowLabel: "Jul 5-11 vs the prior 7 days",
    stages: [
      { key: "ytViews",  label: "YT Views",         value: 54175, prev7d: 40084, note: "Jul 3-9 · Analytics lags ~2 days" },
      { key: "sessions", label: "Site Sessions",    value: 9416,  prev7d: 7077,  note: "PostHog, test accounts excluded" },
      { key: "accel",    label: "Accelerator Page", value: 8694,  prev7d: 6360,  note: "unique sessions that viewed /accelerator*" },
      { key: "checkout", label: "Checkout Started", unavailable: true, note: "not instrumented - checkout runs on Circle's domain; add a tracked checkout link to restore this stage" },
      { key: "joined",   label: "Joined",           value: 60,    prev7d: 30,    note: "community_purchase events (Circle webhook)" }
    ],
    // OUR videos: PostHog funnel $pageview(utm_source=youtube) -> community_purchase,
    // broken down by utm_campaign (= our video slug), last 30 days.
    attributionWindow: "last 30 days",
    topVideos: [
      { title: "6 Things People Get Wrong Setting up An AI OS (+ Fixes)",        visitors: 269, joins: 9 },
      { title: "8 Claude Skills I Can't Live Without",                           visitors: 774, joins: 8 },
      { title: "How to De-Slop Every AI Output Forever (With 1 Skill)",          visitors: 762, joins: 7 },
      { title: "Stop Using Claude Without an Agentic OS",                        visitors: 553, joins: 6 },
      { title: "How to Build & Use a Second Brain Better Than 99% (Course)",     visitors: 441, joins: 6 },
      { title: "This Claude Second Brain Setup Will Change How You Do Sales",    visitors: 325, joins: 6 },
      { title: "Claude Cowork + Obsidian Will Change How You Work Forever",      visitors: 237, joins: 5 }
    ]
  },

  youtube: {
    channel: "Ben AI · UC3KK7ENB_ierAXvrxVNnbZQ",
    // Latest reported day is Jul 9 - YouTube Analytics lags ~2 days.
    viewsLatest: {
      label: "YT Views · Jul 9 (latest reported)",
      value: 8588,
      delta24h: -3491,
      delta7d: 996,
      trend14d: [5250, 4219, 6900, 5719, 5336, 5068, 7592, 7473, 6456, 6850, 6836, 5893, 12079, 8588],
      note: "channel-wide daily views · Analytics lags ~2 days"
    },
    // Last 10 long-form uploads (VidIQ). joins = PostHog-attributed members over
    // the last 30d; null = no confident utm-slug match for that video. CTR is
    // not exposed by the API.
    videos: [
      { title: "This Claude Second Brain Setup Will Change How You Do Sales Forever", date: "2026-07-08", views: 13264, likes: 382,  joins: 6 },
      { title: "This Skill Instantly 10x'es Every Claude Output",                     date: "2026-07-02", views: 16575, likes: 504,  joins: 4 },
      { title: "Claude Tag + Slack Will Change How You Work Forever",                 date: "2026-06-28", views: 8505,  likes: 155,  joins: 1 },
      { title: "Every Way To Set Up A Claude Second Brain Explained",                 date: "2026-06-25", views: 8333,  likes: 214,  joins: null },
      { title: "How to De-Slop Every AI Output Forever (With 1 Skill)",               date: "2026-06-16", views: 9190,  likes: 264,  joins: 7 },
      { title: "6 Things People Get Wrong Setting up An AI OS (+ Fixes)",             date: "2026-06-12", views: 8804,  likes: 260,  joins: 9 },
      { title: "Claude Managed Agents Will Change How You Sell AI Forever",           date: "2026-06-09", views: 6503,  likes: 191,  joins: 0 },
      { title: "Stop Using Claude Without an Agentic OS",                             date: "2026-06-03", views: 46649, likes: 1290, joins: 6 },
      { title: "12 Claude Plugins, Skills & MCP's I Can't Live Without",              date: "2026-05-26", views: 17964, likes: 528,  joins: null },
      { title: "Every Claude Cowork Feature Explained Clearly",                       date: "2026-05-20", views: 16489, likes: 524,  joins: 1 }
    ]
  },

  linkedin: {
    profile: "linkedin.com/in/benvansprundel",
    // All of Ben's posts in the last 30 days (Apify harvestapi, reposts excluded).
    posts: [
      { hook: "Our sales reps barely open the CRM anymore.",                                              date: "2026-07-09", reactions: 110, comments: 37 },
      { hook: "You don't need Obsidian to build a second brain.",                                         date: "2026-06-27", reactions: 40,  comments: 4  },
      { hook: "The biggest AI companies of the next five years won't look like AI companies.",            date: "2026-06-20", reactions: 66,  comments: 6  },
      { hook: "Most AI second brains are overengineered. 5-6 files do 80% of the work.",                  date: "2026-06-19", reactions: 58,  comments: 8  },
      { hook: "AI made everyone in your company 10x more productive. So why isn't it 10x more valuable?", date: "2026-06-18", reactions: 65,  comments: 11 }
    ]
  },

  newsletter: {
    list: "Kit · ~44K subscribers",
    // Last 7 completed broadcasts (Kit stats). Rates in percent.
    issues: [
      { subject: "This job post broke my brain...",             date: "2026-07-11", openRate: 21.9, clickRate: 0.9 },
      { subject: "They told her it would fail...",              date: "2026-07-10", openRate: 24.1, clickRate: 1.5 },
      { subject: "Sales teams need to see this!",               date: "2026-07-09", openRate: 25.3, clickRate: 1.8 },
      { subject: "[name], last call! (7 hours left)",           date: "2026-07-08", openRate: 27.9, clickRate: 1.9 },
      { subject: "This can't wait till tomorrow, [name]",       date: "2026-07-08", openRate: 28.0, clickRate: 1.8 },
      { subject: "Price goes up tomorrow, [name]",              date: "2026-07-07", openRate: 28.8, clickRate: 2.2 },
      { subject: "We need to talk about this...",               date: "2026-07-06", openRate: 26.4, clickRate: 1.6 }
    ]
  },

  community: {
    // Circle Admin API, counted from paged posts + comments.
    // "value" = last 24h, "prev" = the 24h before that; d7 blocks are the
    // last 7 days vs the 7 before, spelled out on the tiles.
    activity: {
      posts:    { value: 5,  prev: 10, d7: 65,  d7prev: 47 },
      comments: { value: 23, prev: 32, d7: 331, d7prev: null },
      // Circle has no like timestamps: this counts likes sitting on posts
      // created in the last 24h. Labeled as such on the tile.
      likesOnNewPosts: { value: 19, prev: null }
    },
    // (likes + comments) per post, computed over each trailing-7d post cohort.
    engagementPerPost: {
      value: 10.4,
      prev7d: 12.4,
      cohort24h: 5.8,
      note: "(likes + comments) / post, posts from the last 7 days"
    },
    // Real engagement on the last 30 posts (oldest -> newest). Replaces the
    // 30-day daily line until the daily DB accumulates history.
    perPost: [
      { t: "(untitled)", date: "2026-07-08", eng: 12, author: "Ashley Zadel" },
      { t: "Hello from Bali", date: "2026-07-08", eng: 18, author: "Stuart Blair" },
      { t: "Inbound SDR for website", date: "2026-07-09", eng: 9, author: "Dyanna Salcedo" },
      { t: "How do you structure your Projects & File Systems", date: "2026-07-09", eng: 16, author: "Stuart Blair" },
      { t: "Anyone here who has successfully implemented relay in Obsidian", date: "2026-07-09", eng: 14, author: "Smriti Chawla" },
      { t: "Free Coda", date: "2026-07-09", eng: 7, author: "Miguel Bitar Romero" },
      { t: "Erwan from France - AI for Local Businesses", date: "2026-07-09", eng: 10, author: "Erwan Legros" },
      { t: "(untitled)", date: "2026-07-09", eng: 10, author: "Ken-Daryl Yombin" },
      { t: "Which email marketing tool do you use (B2C)?", date: "2026-07-09", eng: 19, author: "Bridget" },
      { t: "Alternative Second Brain Team Sync", date: "2026-07-09", eng: 11, author: "Florian Gehring" },
      { t: "Dimitrios | Doctor working in medical education", date: "2026-07-09", eng: 10, author: "Dimitrios Mytilinaios" },
      { t: "Hi Team,", date: "2026-07-09", eng: 9, author: "Purti Kanodia" },
      { t: "Shadi | AI SaaS, Automation, and MVPs", date: "2026-07-09", eng: 12, author: "Shadi Elyafi" },
      { t: "Tanner | Global Engineering Director, AI Intermediate", date: "2026-07-09", eng: 14, author: "Tanner Bechtel" },
      { t: "Advice appreciated: AI voice booking agent for UK salons", date: "2026-07-09", eng: 9, author: "Farraj&Hafsa" },
      { t: "Looking for an advice from fellow practitioners :)", date: "2026-07-10", eng: 9, author: "Jovan Jakovljevic" },
      { t: "Don't Write Your CLAUDE.md by Hand. Paste This Instead", date: "2026-07-10", eng: 0, author: "Milan" },
      { t: "New builder: one prompt and Claude writes your CLAUDE.md", date: "2026-07-10", eng: 9, author: "Milan" },
      { t: "Linked in", date: "2026-07-10", eng: 3, author: "jeremy longshore" },
      { t: "Brian - Solo founder - AI Native Accounting", date: "2026-07-10", eng: 12, author: "Brian Halcrow" },
      { t: "AI Data Ops", date: "2026-07-11", eng: 7, author: "Brice Agamemnon" },
      { t: "Daily Notes?", date: "2026-07-11", eng: 2, author: "Daniel Moss" },
      { t: "What's your client's pricing models look like?", date: "2026-07-11", eng: 5, author: "Bridget" },
      { t: "Sales OS Plugin", date: "2026-07-11", eng: 5, author: "Sheikh Abdullah CC" },
      { t: "LinkedIn Lead Hunter", date: "2026-07-11", eng: 3, author: "Danny Bluestone" },
      { t: "Getting Ready for Claude Cowork and ChatGPT Work on Mobile", date: "2026-07-11", eng: 7, author: "Musab Alrakhis" },
      { t: "Finance and AI", date: "2026-07-11", eng: 9, author: "Benoit" },
      { t: "Issues with Relay Beta", date: "2026-07-11", eng: 5, author: "Daniel Moss" },
      { t: "Learning hub, week 2: The kid a single average hides", date: "2026-07-11", eng: 2, author: "Max Sheahan" },
      { t: "KOOKY AI Exchange", date: "2026-07-11", eng: 6, author: "Renato Goulart" }
    ],
    // Member posts with zero comments, last 4 days (team guide posts excluded).
    awaitingReply: [
      { name: "jeremy longshore", title: "Linked in", space: "Discussions", daysWaiting: 1 },
      { name: "Max Sheahan", title: "Learning hub, week 2: The kid a single average hides...", space: "Discussions", daysWaiting: 0 }
    ],
    // Needs a member last-active export (not exposed by the current Circle
    // connector). The refresh routine should wire this via the Circle admin
    // members API with last_seen, joined with Stripe paying status.
    churnRisk: { pending: true, note: "needs member last-active data - wiring pending" }
  },

  // Month-over-month builds from the append-only daily DB, which starts today.
  mom: {
    pending: true,
    note: "The daily database starts 2026-07-12. Month-over-month unlocks after the first full month of snapshots."
  }
};

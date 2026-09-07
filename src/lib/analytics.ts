export type AnalyticsEventName =
  | "page_view"
  | "vehicle_view"
  | "whatsapp_click"
  | "favorite_add"
  | "favorite_remove"
  | "filter_use"
  | "lead_intent"
  | "simulation_complete"
  | "simulation_cta";

type AnalyticsPayload = {
  eventName: AnalyticsEventName;
  vehicleId?: string;
  leadId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
};

const SESSION_KEY = "gomes-motors-analytics-session";

function getSessionId() {
  if (typeof window === "undefined") return undefined;

  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const sessionId = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, sessionId);
    return sessionId;
  } catch {
    return undefined;
  }
}

export function trackAnalytics(payload: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  const body: AnalyticsPayload = {
    ...payload,
    sessionId: payload.sessionId ?? getSessionId(),
  };

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}

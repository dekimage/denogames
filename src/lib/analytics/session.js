export function getOrCreateSessionId() {
  let sessionId = localStorage.getItem("analytics_session_id");
  const lastActivity = localStorage.getItem("analytics_last_activity");
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  const now = Date.now();
  if (
    !sessionId ||
    !lastActivity ||
    now - parseInt(lastActivity) > SESSION_TIMEOUT
  ) {
    // Create new session if none exists or if the last one expired
    sessionId = `sess_${Math.random().toString(36).substring(2)}${Date.now()}`;
    localStorage.setItem("analytics_session_id", sessionId);
  }

  // Update last activity
  localStorage.setItem("analytics_last_activity", now.toString());
  return sessionId;
}

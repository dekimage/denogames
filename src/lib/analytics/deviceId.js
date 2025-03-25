// Generate a stable device ID that persists across sessions
export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem("analytics_device_id");

  if (!deviceId) {
    // Create a unique device ID combining multiple factors
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      // Add more components that help identify the device
    ];

    // Create a hash of these components
    deviceId = btoa(components.join("|"))
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 32);
    localStorage.setItem("analytics_device_id", deviceId);
  }

  return deviceId;
}

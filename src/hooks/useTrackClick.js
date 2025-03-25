import { useCallback } from "react";
import { trackEvent } from "@/lib/analytics/client";
import { CLIENT_EVENTS, ALLOWED_CLICK_LABELS } from "@/lib/analytics/events";
import MobxStore from "@/mobx";

export const useTrackClick = () => {
  const { user } = MobxStore;

  const trackClick = useCallback(
    async (label) => {
      if (!Object.values(ALLOWED_CLICK_LABELS).includes(label)) {
        console.log(`Invalid click label: ${label}`);
        return;
      }

      await trackEvent({
        action: CLIENT_EVENTS.GENERIC_CLICK,
        context: {
          clickLabel: label,
          currentPath: window.location.pathname,
          isFirstTime: user
            ? !user?.analytics?.clicked?.includes(label)
            : undefined,
        },
      });
    },
    [user]
  );

  return trackClick;
};

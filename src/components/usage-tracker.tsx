"use client";

import { useEffect } from "react";
import { trackUsageProfile } from "@/lib/analytics";
import { logClientError } from "@/lib/error-logger";

type UsageTrackerProps = {
  projectId?: string | null;
  route: string;
  usageProfile?: {
    topic: string;
    purpose: string;
    materialIntent: string;
  };
};

export function UsageTracker({ projectId, route, usageProfile }: UsageTrackerProps) {
  useEffect(() => {
    if (usageProfile) {
      void trackUsageProfile({
        projectId,
        route,
        topic: usageProfile.topic,
        purpose: usageProfile.purpose,
        materialIntent: usageProfile.materialIntent,
      });
    }

    const onError = (event: ErrorEvent) => {
      void logClientError({
        projectId,
        route,
        featureKey: "window",
        errorType: "window.onerror",
        error: event.error ?? event.message,
        severity: "high",
      });
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      void logClientError({
        projectId,
        route,
        featureKey: "promise",
        errorType: "unhandledrejection",
        error: event.reason,
        severity: "medium",
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, [projectId, route, usageProfile]);

  return null;
}

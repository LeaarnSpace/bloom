import { createEventsHandler } from "@bloom/tracking/server";
import { getCurrentUser } from "@/lib/auth";
import { services } from "@/services";

export const POST = createEventsHandler(services, {
  currentProviderId: async () => (await getCurrentUser())?.providerId,
});

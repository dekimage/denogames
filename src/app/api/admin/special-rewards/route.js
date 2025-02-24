import { createAdminApiHandler } from "@/lib/admin-api-handler";

export const { GET, POST, DELETE } = createAdminApiHandler("specialRewards");

import cron from "node-cron";
import { getDueAssets } from "../services/notion";
import { publishAsset } from "../services/publisher";

/** Start the scheduler — checks every minute for due assets */
export function startScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      const dueAssets = await getDueAssets();

      if (dueAssets.length > 0) {
        console.log(`Scheduler: ${dueAssets.length} asset(s) due for publishing`);
      }

      for (const asset of dueAssets) {
        await publishAsset(asset);
      }
    } catch (err: any) {
      console.error("Scheduler error:", err.message);
    }
  });

  console.log("Scheduler started — checking every 60s for due assets");
}

import { storage } from "../server/storage";
import { readFileSync } from "fs";
import { join } from "path";

// Get user ID from command line arguments or use the first user ID
const userId = process.argv[2];

async function makeAdmin() {
  try {
    if (!userId) {
      console.log("Usage: tsx scripts/make-admin.ts <user_id>");
      console.log("Or run without arguments to make the first user an admin");
      
      // If no user ID provided, get the first user
      const users = await storage.getOrders({limit: 1});
      if (users.orders.length === 0) {
        console.log("No users found. Please login first to create a user account.");
        return;
      }
      
      // Just hardcode the first user ID for now
      const firstUserId = "45075646"; // This should be your Replit user ID
      console.log(`Making user ${firstUserId} an admin...`);
      
      // Update the user to be an admin
      await storage.updateUserProfile(firstUserId, { isAdmin: true });
      console.log(`User ${firstUserId} is now an admin!`);
    } else {
      console.log(`Making user ${userId} an admin...`);
      await storage.updateUserProfile(userId, { isAdmin: true });
      console.log(`User ${userId} is now an admin!`);
    }
  } catch (error) {
    console.error("Error making user admin:", error);
  }
}

makeAdmin();
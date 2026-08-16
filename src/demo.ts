import { demoTickets, knowledgeBase } from "./demoData.js";
import { runSupportFlow } from "./supportFlow.js";

for (const ticket of demoTickets) {
  const result = runSupportFlow(ticket, knowledgeBase);
  console.log("\n===", ticket.id, "===");
  console.log(JSON.stringify({ ticket, result }, null, 2));
}

// src/utils/runFixHistory.js
import { fixHistory } from "./fixHistory.js";

(async () => {
  await fixHistory();
  process.exit(0);
})();

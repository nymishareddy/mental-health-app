require('dotenv').config();
const db = require('./backend/config/db');

async function check() {
  try {
    const [assignments] = await db.query('DESCRIBE counselor_assignments');
    console.log("counselor_assignments:", assignments);
    const [alerts] = await db.query('DESCRIBE email_alerts_log');
    console.log("email_alerts_log:", alerts);

    const [keys] = await db.query("SHOW INDEX FROM counselor_assignments");
    console.log("counselor_assignments INDEX:", keys);
    
    const [emailKeys] = await db.query("SHOW INDEX FROM email_alerts_log");
    console.log("email_alerts_log INDEX:", emailKeys);

  } catch(err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
check();

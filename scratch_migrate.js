require('dotenv').config({ path: './backend/.env' });
const db = require('./backend/config/db');

async function migrate() {
  try {
    console.log("Starting condition migration...");
    
    // 1. Add 'type' to email_alerts_log
    await db.query(`ALTER TABLE email_alerts_log ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'stress'`);
    console.log("Added type to email_alerts_log.");

    // Update existing records to 'stress'
    await db.query(`UPDATE email_alerts_log SET type='stress' WHERE type IS NULL`);
    
    // Drop existing unique key safely if it exists (assuming it was unique on student_id)
    try {
      await db.query(`ALTER TABLE email_alerts_log DROP INDEX student_id`);
      console.log("Dropped old unique constraint on email_alerts_log.");
    } catch(err) {
      if (err.code !== 'ER_CANT_DROP_FIELD_OR_KEY') console.warn("Index drop exception: ", err.message);
    }
    
    // Add new composite key
    try {
      await db.query(`ALTER TABLE email_alerts_log ADD UNIQUE KEY unique_student_type (student_id, type)`);
      console.log("Added composite unique key to email_alerts_log.");
    } catch(err) {
      if (err.code !== 'ER_DUP_KEYNAME') throw err;
    }

    // 2. Add 'type' to counselor_assignments
    await db.query(`ALTER TABLE counselor_assignments ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'stress'`);
    console.log("Added type to counselor_assignments.");

    await db.query(`UPDATE counselor_assignments SET type='stress' WHERE type IS NULL`);

    try {
      await db.query(`ALTER TABLE counselor_assignments DROP INDEX student_id`);
      console.log("Dropped old unique constraint on counselor_assignments.");
    } catch(err) {
      if (err.code !== 'ER_CANT_DROP_FIELD_OR_KEY') console.warn("Index drop exception: ", err.message);
    }

    // It's possible the original unique name was different. Let's find it if present
    const [counselorIdx] = await db.query("SHOW INDEX FROM counselor_assignments");
    for (const idx of counselorIdx) {
      if (idx.Key_name !== 'PRIMARY' && idx.Non_unique === 0 && idx.Column_name === 'student_id') {
         if (idx.Key_name !== 'unique_student_type') {
            try { await db.query(`ALTER TABLE counselor_assignments DROP INDEX ${idx.Key_name}`); console.log('Dropped ' + idx.Key_name); } catch(e){}
         }
      }
    }

    try {
      await db.query(`ALTER TABLE counselor_assignments ADD UNIQUE KEY unique_student_type (student_id, type)`);
      console.log("Added composite unique key to counselor_assignments.");
    } catch(err) {
      if (err.code !== 'ER_DUP_KEYNAME') throw err;
    }

    console.log("Migration successful!");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}
migrate();

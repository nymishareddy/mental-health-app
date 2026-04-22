require('dotenv').config();
const db = require('./config/db');

async function migrate() {
  try {
    console.log("Starting condition migration...");
    
    // 1. Add 'type' to email_alerts_log
    try {
      await db.query(`ALTER TABLE email_alerts_log ADD COLUMN type VARCHAR(20) DEFAULT 'stress'`);
      console.log("Added type to email_alerts_log.");
    } catch(err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
    }

    // Update existing records to 'stress'
    await db.query(`UPDATE email_alerts_log SET type='stress' WHERE type IS NULL`);
    
    // Drop existing unique key safely if it exists (assuming it was unique on student_id)
    try {
      await db.query(`ALTER TABLE email_alerts_log DROP INDEX student_id`);
      console.log("Dropped old unique constraint on email_alerts_log.");
    } catch(err) {
      if (err.code !== 'ER_CANT_DROP_FIELD_OR_KEY') console.warn("Index drop exception: ", err.message);
    }
    
    const [alertsIdx] = await db.query("SHOW INDEX FROM email_alerts_log");
    for (const idx of alertsIdx) {
      if (idx.Key_name !== 'PRIMARY' && idx.Non_unique === 0 && idx.Column_name === 'student_id') {
         if (idx.Key_name !== 'unique_student_type') {
            try { await db.query(`ALTER TABLE email_alerts_log DROP INDEX ${idx.Key_name}`); console.log('Dropped ' + idx.Key_name); } catch(e){}
         }
      }
    }

    // Add new composite key
    try {
      await db.query(`ALTER TABLE email_alerts_log ADD UNIQUE KEY unique_student_type (student_id, type)`);
      console.log("Added composite unique key to email_alerts_log.");
    } catch(err) {
      if (err.code !== 'ER_DUP_KEYNAME') throw err;
    }

    // 2. Add 'type' to counselor_assignments
    try {
      await db.query(`ALTER TABLE counselor_assignments ADD COLUMN type VARCHAR(20) DEFAULT 'stress'`);
      console.log("Added type to counselor_assignments.");
    } catch(err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
    }

    await db.query(`UPDATE counselor_assignments SET type='stress' WHERE type IS NULL`);

    try {
      await db.query(`ALTER TABLE counselor_assignments DROP INDEX student_id`);
      console.log("Dropped old unique constraint on counselor_assignments.");
    } catch(err) {
      if (err.code !== 'ER_CANT_DROP_FIELD_OR_KEY') console.warn("Index drop exception: ", err.message);
    }

    const [counselorIdx] = await db.query("SHOW INDEX FROM counselor_assignments");
    for (const idx of counselorIdx) {
      if (idx.Key_name !== 'PRIMARY' && idx.Non_unique === 0 && idx.Column_name === 'student_id') {
         if (idx.Key_name !== 'unique_student_type') {
            try { await db.query(`ALTER TABLE counselor_assignments DROP INDEX ${idx.Key_name}`); console.log('Dropped ' + idx.Key_name); } catch(e){}
         }
      }
    }

    // Deduplicate counselor_assignments by keeping only the most recent or highest ID for each (student_id, type)
    try {
      await db.query(`
        DELETE t1 FROM counselor_assignments t1
        INNER JOIN counselor_assignments t2 
        WHERE t1.student_id = t2.student_id AND t1.type = t2.type AND t1.id < t2.id
      `);
      console.log("Deduplicated counselor_assignments.");
    } catch(err) {
      console.warn("Deduplication warning: ", err.message);
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

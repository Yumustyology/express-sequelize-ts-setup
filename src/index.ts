import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = Number(process.env.PORT || 5000);

async function main() {
  try {
    console.log('🚀 Starting API server...');
    console.log('Connecting to database...');

    if ((app as any).connectDb) {
      await (app as any).connectDb();
      console.log('✅ Database connected and synced successfully.');
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

main();

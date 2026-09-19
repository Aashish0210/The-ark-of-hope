const { execSync } = require('child_process');

// Align database URLs so Prisma always finds POSTGRES_URL and DATABASE_URL
const dbDirectUrl = process.env.POSTGRES_URL_NON_POOLING ||
                    process.env.DATABASE_POSTGRES_URL_NON_POOLING ||
                    process.env.DATABASE_URL_UNPOOLED ||
                    process.env.POSTGRES_URL ||
                    process.env.DATABASE_POSTGRES_URL ||
                    process.env.DATABASE_URL;

const dbUrl = process.env.POSTGRES_PRISMA_URL || 
              process.env.DATABASE_POSTGRES_PRISMA_URL ||
              process.env.POSTGRES_URL || 
              process.env.DATABASE_POSTGRES_URL ||
              process.env.DATABASE_URL ||
              dbDirectUrl;

if (dbUrl) {
  process.env.POSTGRES_URL = dbDirectUrl || dbUrl;
  process.env.DATABASE_URL = dbDirectUrl || dbUrl;
}

try {
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

  if (dbUrl) {
    console.log('Synchronizing database schema with remote database...');
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
    } catch (dbErr) {
      console.warn('Prisma DB push warning (proceeding with build):', dbErr.message);
    }
  } else {
    console.log('No remote database URL detected during build, skipping db push.');
  }

  console.log('Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit', env: process.env });
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}

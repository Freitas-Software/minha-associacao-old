import 'dotenv/config';

process.env.NODE_ENV ??= 'development';

const { start } = await import('./index.js');

await start();

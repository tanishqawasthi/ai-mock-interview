/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://test_owner:tFWUjpJbnY03@ep-orange-king-a14gxy9h.ap-southeast-1.aws.neon.tech/ai-mock-interview?sslmode=require',
    }
  };
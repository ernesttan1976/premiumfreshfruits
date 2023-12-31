/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        serverTimeout: 10000,
        // Will only be available on the server side
        DATABASE_URL:process.env.DATABASE_URL,
      },
}

module.exports = nextConfig

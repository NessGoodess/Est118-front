const requiredEnv = [
  'NEXT_PUBLIC_REVERB_APP_KEY',
  'NEXT_PUBLIC_REVERB_HOST',
  'NEXT_PUBLIC_REVERB_PORT',
]

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`)
  }
}

export const ENV = {
  REVERB_KEY: process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
  REVERB_HOST: process.env.NEXT_PUBLIC_REVERB_HOST!,
  REVERB_PORT: Number(process.env.NEXT_PUBLIC_REVERB_PORT!),
}

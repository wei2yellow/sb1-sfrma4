/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_DATABASE_URL: string
  readonly VITE_DATABASE_AUTH_TOKEN: string
  readonly VITE_JWT_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    DATABASE_AUTH_TOKEN: string
    JWT_SECRET: string
  }
}
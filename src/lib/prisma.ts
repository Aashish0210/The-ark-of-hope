import { PrismaClient } from '@prisma/client'

const hasDatabaseUrl = Boolean(process.env.POSTGRES_URL)

const createFallbackPrisma = () => {
  const createModelProxy = () =>
    new Proxy(
      {},
      {
        get: (_target, prop) => {
          const method = String(prop)

          if (method === 'then' || method === 'catch' || method === 'finally') {
            return undefined
          }

          return async (...args: any[]) => {
            if (method === 'findFirst' || method === 'findUnique' || method === 'findMany') {
              return args[0]?.where ? null : []
            }

            if (method === 'count') {
              return 0
            }

            if (method === 'create' || method === 'update' || method === 'upsert') {
              return args[0]?.data ?? null
            }

            if (method === 'createMany' || method === 'deleteMany' || method === 'updateMany') {
              return { count: 0 }
            }

            return null
          }
        },
      },
    )

  return {
    siteSettings: createModelProxy(),
    donation: createModelProxy(),
    donationTier: createModelProxy(),
    stat: createModelProxy(),
    trendPoint: createModelProxy(),
    user: createModelProxy(),
  }
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient | any
}

export const prisma: any = hasDatabaseUrl
  ? (globalForPrisma.prisma ?? new PrismaClient())
  : (globalForPrisma.prisma ?? createFallbackPrisma())

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

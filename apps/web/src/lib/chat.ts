import { prisma } from '@tenexim/database';

export { prisma };

const globalForUserCache = globalThis as unknown as {
    cachedUser: any;
};

// Cached user getter (avoids repeated DB calls)
export async function getOrCreateUser() {
    if (globalForUserCache.cachedUser) {
        return globalForUserCache.cachedUser;
    }

    let user = await prisma.user.findFirst({
        where: { email: 'demo@client.com' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'demo@client.com',
                name: 'Demo Client',
                passwordHash: 'mock',
            }
        });
    }

    globalForUserCache.cachedUser = user;
    return user;
}

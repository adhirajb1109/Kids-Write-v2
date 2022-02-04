import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { createCookieSessionStorage, redirect } from 'remix'

// Login user
export async function login({ username, password }) {
    const user = await prisma.user.findFirst({
        where: {
            username,
        },
    })

    if (!user) return null

    // Check password
    const isCorrectPassword = await bcrypt.compare(password, user.password)

    if (!isCorrectPassword) return null

    return user
}

// Register new user
export async function register({ username, password }) {
    const passwordHash = await bcrypt.hash(password, 10)
    return prisma.user.create({
        data: {
            username,
            password: passwordHash,
        },
    })
}

// Get session secret
const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    throw new Error('No session secret')
}

// Create session storage
const storage = createCookieSessionStorage({
    cookie: {
        name: 'kidswrite_session',
        secure: process.env.NODE_ENV === 'production',
        secrets: [sessionSecret],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 60,
        httpOnly: true,
    },
})

// Create user session
export async function createUserSession(userId, redirectTo) {
    const session = await storage.getSession()
    session.set('userId', userId)
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await storage.commitSession(session),
        },
    })
}

// Get user session
export function getUserSession(request) {
    return storage.getSession(request.headers.get('Cookie'))
}

// Get logged in user
export async function getUser(request) {
    const session = await getUserSession(request)
    const userId = session.get('userId')
    if (!userId || typeof userId !== 'string') {
        return null
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        return user
    } catch (error) {
        return null
    }
}

// Logout user and destroy session
export async function logout(request) {
    const session = await storage.getSession(request.headers.get('Cookie'))
    return redirect('/auth/logout', {
        headers: {
            'Set-Cookie': await storage.destroySession(session),
        },
    })
}
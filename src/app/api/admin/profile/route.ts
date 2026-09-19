import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionEmail = session.user.email.trim().toLowerCase();
        let user = await prisma.user.findUnique({
            where: { email: sessionEmail },
            select: {
                id: true,
                email: true,
                image: true
            }
        });

        if (!user && (session.user as any).id) {
            const parsedId = parseInt((session.user as any).id);
            if (!isNaN(parsedId)) {
                user = await prisma.user.findUnique({
                    where: { id: parsedId },
                    select: {
                        id: true,
                        email: true,
                        image: true
                    }
                });
            }
        }

        return NextResponse.json(user || { email: sessionEmail, image: null });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { email, password, image } = body;

        const sessionEmail = session.user.email.trim().toLowerCase();

        // 1. Locate user by email first, fallback to id
        let user = await prisma.user.findUnique({
            where: { email: sessionEmail }
        });

        if (!user && (session.user as any).id) {
            const parsedId = parseInt((session.user as any).id);
            if (!isNaN(parsedId)) {
                user = await prisma.user.findUnique({
                    where: { id: parsedId }
                });
            }
        }

        const data: any = {};
        if (email && email.trim().length > 0) {
            data.email = email.trim().toLowerCase();
        }
        if (image !== undefined) {
            data.image = image;
        }
        if (password && typeof password === 'string' && password.trim().length > 0) {
            data.password = await bcrypt.hash(password.trim(), 10);
        }

        let updatedUser;
        if (user) {
            updatedUser = await prisma.user.update({
                where: { id: user.id },
                data,
                select: {
                    id: true,
                    email: true,
                    image: true
                }
            });
        } else {
            // Auto-provision if record didn't exist in database
            const initialPassword = password && password.trim().length > 0
                ? await bcrypt.hash(password.trim(), 10)
                : await bcrypt.hash('arkproject@2026', 10);

            updatedUser = await prisma.user.create({
                data: {
                    email: data.email || sessionEmail,
                    password: initialPassword,
                    image: data.image || null
                },
                select: {
                    id: true,
                    email: true,
                    image: true
                }
            });
        }

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({
            error: 'Failed to update profile',
            details: error.message
        }, { status: 500 });
    }
}

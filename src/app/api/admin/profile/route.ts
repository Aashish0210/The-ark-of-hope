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

        const user = await prisma.user.findUnique({
            where: { id: parseInt((session.user as any).id) },
            select: {
                id: true,
                email: true,
                image: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
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

        const userId = (session.user as any).id;
        if (!userId) {
            return NextResponse.json({ error: "Missing user ID in session" }, { status: 400 });
        }

        const data: any = {};
        if (email) data.email = email;
        if (image !== undefined) data.image = image;
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data,
            select: {
                id: true,
                email: true,
                image: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json({
            error: 'Failed to update profile',
            details: error.message
        }, { status: 500 });
    }
}

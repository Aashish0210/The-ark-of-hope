import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const stats = await prisma.stat.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(stats, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const statsCount = await prisma.stat.count();
        const stat = await prisma.stat.create({
            data: {
                value: "New Stat",
                label: "",
                order: statsCount + 1
            }
        });

        try {
            revalidatePath('/', 'layout');
        } catch (_) {}

        return NextResponse.json(stat);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, value, label } = body;

        const stat = await prisma.stat.update({
            where: { id: Number(id) },
            data: {
                value,
                label
            }
        });

        try {
            revalidatePath('/', 'layout');
        } catch (_) {}

        return NextResponse.json(stat);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
        }

        await prisma.stat.delete({
            where: { id: Number(id) }
        });

        try {
            revalidatePath('/', 'layout');
        } catch (_) {}

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete API Error:', error);
        return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 });
    }
}

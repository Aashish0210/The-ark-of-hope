import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UNIVERSAL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function GET() {
    try {
        let trends = await prisma.trendPoint.findMany({
            orderBy: { order: 'asc' }
        });
        const monthly = trends.filter((t: any) => t.type === 'MONTHLY');

        // If no monthly points exist, seed with current month receiving current raised (if any) and 0 for others
        if (monthly.length === 0) {
            const settings = await prisma.siteSettings.findFirst({ orderBy: { id: 'asc' } });
            const currentRaised = Number(settings?.raised || 0);
            const currentMonthIdx = new Date().getMonth();

            const seedData = UNIVERSAL_MONTHS.map((label, idx) => ({
                type: 'MONTHLY',
                label,
                value1: (idx === currentMonthIdx) ? currentRaised : 0,
                value2: null,
                order: idx
            }));

            await prisma.trendPoint.deleteMany({});
            await prisma.trendPoint.createMany({ data: seedData });
            trends = await prisma.trendPoint.findMany({ orderBy: { order: 'asc' } });
        }

        return NextResponse.json(trends);
    } catch (error) {
        console.error('Fetch trends error:', error);
        return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Simple implementation: delete all and recreate for simplicity in bulk updates
        // In a real app we'd upsert, but for sync charts this is common
        await prisma.trendPoint.deleteMany({});
        const created = await prisma.trendPoint.createMany({
            data: data.map((point: any) => ({
                type: point.type,
                label: point.label,
                value1: Number(point.value1),
                value2: point.value2 ? Number(point.value2) : null,
                order: Number(point.order)
            }))
        });

        return NextResponse.json(created);
    } catch (error) {
        console.error('Update trends error:', error);
        return NextResponse.json({ error: 'Failed to update trends' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const created = await prisma.trendPoint.create({
            data: {
                type: data.type,
                label: data.label,
                value1: Number(data.value1),
                value2: data.value2 ? Number(data.value2) : null,
                order: Number(data.order)
            }
        });
        return NextResponse.json(created);
    } catch (error) {
        console.error('Create trend error:', error);
        return NextResponse.json({ error: 'Failed to create trend' }, { status: 500 });
    }
}

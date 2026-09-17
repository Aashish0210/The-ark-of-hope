import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const tiers = await prisma.donationTier.findMany({
            orderBy: { price: 'asc' }
        });
        return NextResponse.json(tiers, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, icon, name, price, available, description, features, isPopular } = body;

        const tier = await prisma.donationTier.update({
            where: { id: Number(id) },
            data: {
                icon,
                name,
                price: price ? parseFloat(price) : undefined,
                available: available ? parseInt(available) : undefined,
                description,
                features: features ? JSON.stringify(features) : undefined,
                isPopular: isPopular !== undefined ? Boolean(isPopular) : undefined,
            }
        });

        try {
            revalidatePath('/', 'layout');
        } catch (_) {}

        return NextResponse.json(tier);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 });
    }
}

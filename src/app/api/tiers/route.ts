import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        let tiers = await prisma.donationTier.findMany({
            orderBy: { price: 'asc' }
        });
        if (tiers.length === 0) {
            const defaultTiers = [
                {
                    icon: "🪨",
                    name: "Foundation",
                    price: 25,
                    available: 1000,
                    description: '"Every great structure begins where the earth meets stone."',
                    image: "/images/tiers/foundation.png",
                    features: JSON.stringify([
                        "Digital certificate of contribution",
                        "Monthly prayer & progress updates",
                        "Name in the Builder's Registry"
                    ]),
                    isPopular: false
                },
                {
                    icon: "🪵",
                    name: "Timber",
                    price: 75,
                    available: 500,
                    description: '"Cut and shaped — your gift frames what will stand for generations."',
                    image: "/images/tiers/timber.png",
                    features: JSON.stringify([
                        "Everything in Foundation",
                        "Handwritten thank-you from the team",
                        "Quarterly photo updates from the site"
                    ]),
                    isPopular: false
                },
                {
                    icon: "🛖",
                    name: "Deck",
                    price: 150,
                    available: 250,
                    description: '"Step aboard — your place is secured on the deck of something eternal."',
                    image: "/images/tiers/deck.png",
                    features: JSON.stringify([
                        "Everything in Timber",
                        "Name on the physical Wall of Honor",
                        "Guided video tour of construction",
                        "Priority invitations to launch events"
                    ]),
                    isPopular: true
                },
                {
                    icon: "🕊️",
                    name: "Covenant",
                    price: 500,
                    available: 100,
                    description: '"A covenant is more than a gift — it is a promise written into the walls."',
                    image: "/images/tiers/covenant.png",
                    features: JSON.stringify([
                        "Everything in Deck",
                        "VIP access to annual gathering",
                        "Personal call with project leadership",
                        "Named dedication plaque at the site",
                        "Annual recognition dinner with founders"
                    ]),
                    isPopular: false
                }
            ];
            try {
                await prisma.donationTier.createMany({ data: defaultTiers });
                tiers = await prisma.donationTier.findMany({ orderBy: { price: 'asc' } });
            } catch (_) {}
        }
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

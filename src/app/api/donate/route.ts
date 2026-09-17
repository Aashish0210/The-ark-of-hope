import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, name } = body;
        const parsedAmount = parseFloat(amount);

        // 1. Create the donation record
        const donation = await prisma.donation.create({
            data: {
                amount: parsedAmount,
                name: name || "A generous donor"
            }
        });

        // 2. Increment the total raised in settings
        const existingSettings = await prisma.siteSettings.findFirst({
            orderBy: { id: 'asc' }
        });

        let updatedSettings;
        if (existingSettings) {
            updatedSettings = await prisma.siteSettings.update({
                where: { id: existingSettings.id },
                data: {
                    raised: {
                        increment: parsedAmount
                    }
                }
            });
        }

        // 3. Trigger Real-time update via Pusher
        try {
            const { pusherServer } = await import('@/lib/pusher');
            await pusherServer.trigger('ark-donations', 'donation-received', {
                donation: donation,
                newTotal: updatedSettings.raised
            });
        } catch (pushError) {
            console.error('Pusher trigger failed:', pushError);
            // Don't fail the whole request if Pusher fails
        }

        return NextResponse.json(donation);
    } catch (error) {
        console.error('Donation error:', error);
        return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 });
    }
}

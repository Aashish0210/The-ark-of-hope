import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        let settings = await prisma.siteSettings.findFirst({
            orderBy: { id: 'asc' }
        });
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    id: 1,
                    raised: 0,
                    goal: 7000000,
                    heroTitle: "Ark of Hope Project",
                    heroSubtitle: "A story of faith in Nepal",
                    heroText: "Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.",
                    maintenanceMode: false
                }
            });
        }
        return NextResponse.json(settings, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    } catch (error) {
        console.error('Fetch settings error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { raised, goal, heroTitle, heroSubtitle, heroText, maintenanceMode } = body;

        const updateData: any = {};
        if (raised !== undefined && raised !== null && !isNaN(Number(raised))) {
            updateData.raised = parseFloat(raised);
        }
        if (goal !== undefined && goal !== null && !isNaN(Number(goal))) {
            updateData.goal = parseFloat(goal);
        }
        if (heroTitle !== undefined) updateData.heroTitle = String(heroTitle);
        if (heroSubtitle !== undefined) updateData.heroSubtitle = String(heroSubtitle);
        if (heroText !== undefined) updateData.heroText = String(heroText);
        if (maintenanceMode !== undefined) updateData.maintenanceMode = Boolean(maintenanceMode);

        const existing = await prisma.siteSettings.findFirst({
            orderBy: { id: 'asc' }
        });

        let settings;
        if (existing) {
            settings = await prisma.siteSettings.update({
                where: { id: existing.id },
                data: updateData
            });
        } else {
            settings = await prisma.siteSettings.create({
                data: {
                    id: 1,
                    raised: updateData.raised ?? 0,
                    goal: updateData.goal ?? 7000000,
                    heroTitle: updateData.heroTitle ?? 'Ark of Hope Project',
                    heroSubtitle: updateData.heroSubtitle ?? 'A story of faith in Nepal',
                    heroText: updateData.heroText ?? 'Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.',
                    maintenanceMode: updateData.maintenanceMode ?? false
                }
            });
        }

        // Trigger real-time update via Pusher if raised amount was modified
        if (updateData.raised !== undefined) {
            try {
                const { pusherServer } = await import('@/lib/pusher');
                await pusherServer.trigger('ark-donations', 'donation-received', {
                    newTotal: settings.raised
                });
            } catch (pushError) {
                // Ignore Pusher failure in local dev
            }
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

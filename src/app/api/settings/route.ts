import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

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
                    raised: 9000000,
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

const UNIVERSAL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { raised, addAmount, goal, heroTitle, heroSubtitle, heroText, maintenanceMode } = body;

        const existing = await prisma.siteSettings.findFirst({
            orderBy: { id: 'asc' }
        });

        const updateData: any = {};
        const currentMonthIdx = new Date().getMonth();
        let amountDelta: number | null = null;
        let finalRaised: number = Number(existing?.raised || 0);

        if (addAmount !== undefined && addAmount !== null && !isNaN(Number(addAmount))) {
            const added = parseFloat(addAmount);
            amountDelta = added;
            finalRaised = finalRaised + added;
            updateData.raised = finalRaised;
        } else if (raised !== undefined && raised !== null && !isNaN(Number(raised))) {
            const newDirectRaised = parseFloat(raised);
            amountDelta = newDirectRaised - finalRaised;
            finalRaised = newDirectRaised;
            updateData.raised = finalRaised;
        }
        if (goal !== undefined && goal !== null && !isNaN(Number(goal))) {
            updateData.goal = parseFloat(goal);
        }
        if (heroTitle !== undefined) updateData.heroTitle = String(heroTitle);
        if (heroSubtitle !== undefined) updateData.heroSubtitle = String(heroSubtitle);
        if (heroText !== undefined) updateData.heroText = String(heroText);
        if (maintenanceMode !== undefined) updateData.maintenanceMode = Boolean(maintenanceMode);

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

        // Sync TrendPoint monthly records (active month receives amount, without synthetic division)
        try {
            const existingTrends = await prisma.trendPoint.findMany({ orderBy: { order: 'asc' } });
            let monthlyPoints = existingTrends.filter((p: any) => p.type === 'MONTHLY');

            if (monthlyPoints.length === 0) {
                // Initialize all 12 months: full raised goes to active month, 0 to others
                monthlyPoints = UNIVERSAL_MONTHS.map((label, idx) => ({
                    type: 'MONTHLY',
                    label,
                    value1: (idx === currentMonthIdx) ? finalRaised : 0,
                    value2: null,
                    order: idx
                }));
            } else {
                // Map all 12 months, updating only the current active month with amountDelta
                monthlyPoints = UNIVERSAL_MONTHS.map((label, idx) => {
                    const found = monthlyPoints.find((p: any) => p.label === label || Number(p.order) === idx);
                    let val = found ? Number(found.value1 || 0) : 0;
                    if (idx === currentMonthIdx && amountDelta !== null) {
                        val = Math.max(0, val + amountDelta);
                    }
                    return {
                        type: 'MONTHLY',
                        label,
                        value1: val,
                        value2: null,
                        order: idx
                    };
                });
            }

            await prisma.trendPoint.deleteMany({});
            await prisma.trendPoint.createMany({ data: monthlyPoints });
        } catch (trendErr) {
            console.error('Error syncing monthly trend points in settings:', trendErr);
        }

        // Invalidate Next.js cache across public site instantly
        try {
            revalidatePath('/', 'layout');
            revalidatePath('/', 'page');
            revalidatePath('/admin');
        } catch (_) {}

        return NextResponse.json(settings, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}

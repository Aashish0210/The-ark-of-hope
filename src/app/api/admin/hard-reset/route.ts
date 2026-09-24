import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const { developerPassword } = body;

        const isDev = Boolean((session.user as any)?.isDeveloper) || developerPassword === "arkofhope@2026";

        if (!isDev) {
            return NextResponse.json({ error: "Forbidden: Developer privileges required" }, { status: 403 });
        }

        // 1. Reset raised amount to 0 in SiteSettings
        const existingSettings = await prisma.siteSettings.findFirst({
            orderBy: { id: 'asc' }
        });

        if (existingSettings) {
            await prisma.siteSettings.update({
                where: { id: existingSettings.id },
                data: { raised: 0 }
            });
        } else {
            await prisma.siteSettings.create({
                data: {
                    id: 1,
                    raised: 0,
                    goal: 7000000,
                    heroTitle: 'Ark of Hope Project',
                    heroSubtitle: 'A story of faith in Nepal',
                    heroText: 'Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.',
                    maintenanceMode: false
                }
            });
        }

        // 2. Reset user passwords to 'arkofhope@2026'
        const newHashed = await bcrypt.hash("arkofhope@2026", 10);
        await prisma.user.updateMany({
            data: {
                password: newHashed
            }
        });

        // 3. Clear donation transactions if any
        try {
            await prisma.donation.deleteMany({});
        } catch (_) {}

        // Invalidate Next.js cache across public site & admin
        try {
            revalidatePath('/', 'layout');
            revalidatePath('/', 'page');
            revalidatePath('/admin');
        } catch (_) {}

        return NextResponse.json({
            success: true,
            message: "Hard reset successful! Raised amount set to $0 and admin password reset to arkofhope@2026."
        });
    } catch (error) {
        console.error("Hard reset error:", error);
        return NextResponse.json({ error: "Failed to perform hard reset" }, { status: 500 });
    }
}

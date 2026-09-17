import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.siteSettings.deleteMany()
    await prisma.donationTier.deleteMany()
    await prisma.stat.deleteMany()

    console.log('Cleared existing data.')

    // Create global settings
    await prisma.siteSettings.create({
        data: {
            id: 1,
            raised: 0,
            goal: 100000000,
            heroSubtitle: "A story of faith in Nepal",
            heroTitle: "Ark of Hope Project",
            heroText: "Every great journey begins with a single step. Once gifted for The Art Donate, see the work, and please be ready—one donation at a time.",
        }
    })

    console.log('Created site settings.')

    // Create tiers
    await prisma.donationTier.createMany({
        data: [
            {
                icon: "🪨",
                name: "Foundation",
                price: 25,
                available: 1000,
                description: "\"Every great structure begins where the earth meets stone.\"",
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
                description: "\"Cut and shaped — your gift frames what will stand for generations.\"",
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
                description: "\"Step aboard — your place is secured on the deck of something eternal.\"",
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
                description: "\"A covenant is more than a gift — it is a promise written into the walls.\"",
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
        ]
    })

    console.log('Created donation tiers.')

    // Create stats
    await prisma.stat.createMany({
        data: [
            { value: "Faith-Based & Historical Learning", label: "", order: 1 },
            { value: "Biblical Hospitality & Destination", label: "", order: 2 },
            { value: "Local Economic Growth", label: "", order: 3 },
            { value: "Sustainable Job Creation", label: "", order: 4 },
        ]
    })

    console.log('Created stats.')

    // Create Admin User
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash('arkproject@2026', 10)

    await prisma.user.upsert({
        where: { email: 'admin@ark.com' },
        update: {
            password: hashedPassword
        },
        create: {
            email: 'admin@ark.com',
            password: hashedPassword
        }
    })

    console.log('Created admin user: admin@ark.com / arkproject@2026')

    // Create TrendPoints
    await prisma.trendPoint.deleteMany()
    await prisma.trendPoint.createMany({
        data: [
            { type: 'HISTORY', label: '28 June', value1: 180, value2: 140, order: 1 },
            { type: 'HISTORY', label: '05 July', value1: 160, value2: 155, order: 2 },
            { type: 'HISTORY', label: '12 July', value1: 160, value2: 150, order: 3 },
            { type: 'HISTORY', label: '19 July', value1: 180, value2: 130, order: 4 },
            { type: 'HISTORY', label: '26 July', value1: 195, value2: 190, order: 5 },
            { type: 'HISTORY', label: '02 Aug', value1: 210, value2: 200, order: 6 },
            { type: 'FORECAST', label: '1', value1: 3, value2: 2, order: 1 },
            { type: 'FORECAST', label: '2', value1: 3.5, value2: 2.2, order: 2 },
            { type: 'FORECAST', label: '3', value1: 5, value2: 3, order: 3 },
            { type: 'FORECAST', label: '4', value1: 4.5, value2: 2.8, order: 4 },
            { type: 'FORECAST', label: '5', value1: 3.5, value2: 2, order: 5 },
            { type: 'FORECAST', label: '6', value1: 3, value2: 2.2, order: 6 },
            { type: 'FORECAST', label: '7', value1: 2.8, value2: 2.5, order: 7 },
            { type: 'FORECAST', label: '8', value1: 3.5, value2: 3.1, order: 8 },
            { type: 'FORECAST', label: '9', value1: 3.6, value2: 3.2, order: 9 },
            { type: 'FORECAST', label: '10', value1: 4.8, value2: 3.8, order: 10 },
            { type: 'FORECAST', label: '11', value1: 5.5, value2: 4.2, order: 11 },
            { type: 'FORECAST', label: '12', value1: 6.2, value2: 4.3, order: 12 },
        ]
    })

    console.log('Created chart trend points.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

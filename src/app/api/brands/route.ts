import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Brand from '@/models/Brand'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

const DEFAULT_BRANDS = [
  { name: "Rolls-Royce", slug: "rollsroyce", order: 0 },
  { name: "Bentley", slug: "bentley", order: 1 },
  { name: "Mercedes", overrideUrl: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png", order: 2 },
  { name: "BMW", slug: "bmw", order: 3 },
  { name: "Audi", slug: "audi", order: 4 },
  { name: "Lexus", overrideUrl: "https://www.carlogos.org/car-logos/lexus-logo.png", order: 5 },
  { name: "Porsche", slug: "porsche", order: 6 },
  { name: "Ferrari", slug: "ferrari", order: 7 },
  { name: "Lamborghini", slug: "lamborghini", order: 8 },
  { name: "Bugatti", slug: "bugatti", order: 9 },
  { name: "Maserati", slug: "maserati", order: 10 },
  { name: "Land Rover", overrideUrl: "https://www.carlogos.org/car-logos/land-rover-logo.png", order: 11 },
  { name: "MINI JOHN", overrideUrl: "https://www.carlogos.org/logo/Mini-logo.png", order: 12 },
  { name: "MCLAREN", overrideUrl: "https://www.carlogos.org/logo/McLaren-logo.png", order: 13 },
  { name: "Other", isOther: true, order: 14 }
]

export async function GET() {
  try {
    await connectToDatabase()
    let brands = await Brand.find().sort({ order: 1, createdAt: -1 })
    
    // Seed if empty
    if (brands.length === 0) {
      await Brand.insertMany(DEFAULT_BRANDS)
      brands = await Brand.find().sort({ order: 1, createdAt: -1 })
    }
    
    return NextResponse.json(brands)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!user || !['admin', 'super_admin', 'agent'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const body = await req.json()
    const brand = await Brand.create(body)
    return NextResponse.json(brand)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!user || !['admin', 'super_admin', 'agent'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const { id, ...updateData } = await req.json()
    const brand = await Brand.findByIdAndUpdate(id, updateData, { new: true })
    return NextResponse.json(brand)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!user || !['admin', 'super_admin', 'agent'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    await Brand.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 })
  }
}

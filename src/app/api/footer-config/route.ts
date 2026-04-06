import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import FooterConfig from '@/models/FooterConfig'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET() {
  try {
    await connectToDatabase()
    let config = await FooterConfig.findOne({ singleton: 'main' })
    if (!config) {
      config = await FooterConfig.create({ singleton: 'main' })
    }
    return NextResponse.json(config)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch footer config' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const body = await req.json()

    const config = await FooterConfig.findOneAndUpdate(
      { singleton: 'main' },
      { ...body, updatedAt: new Date() },
      { upsert: true, new: true }
    )
    return NextResponse.json(config)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update footer config' }, { status: 500 })
  }
}

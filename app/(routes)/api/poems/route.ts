import { NextRequest, NextResponse } from 'next/server'
import { getZephyrPoems } from '../../firebase/connect'

export async function GET(request: NextRequest) {
    // const resultJson = await chat()
    const isSet = request.nextUrl.searchParams.get('set') == '1'
    let poems = await getZephyrPoems()

    const response = NextResponse.json({ poems })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}

export async function POST(request: NextRequest) {
    const body: any = request.body
    const { author } = body || {}

    const poems = await getZephyrPoems({ author })
    const response = NextResponse.json({ poems })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}

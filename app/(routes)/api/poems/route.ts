import { NextRequest, NextResponse } from 'next/server'
import { getZephyrPoems } from '../../firebase/connect-temp'

// const OpenCC = require('opencc');
import * as OpenCC from 'opencc-js'

const converter = OpenCC.Converter({ from: 'hk', to: 'cn' })

export async function GET(request: NextRequest) {
    // const resultJson = await chat()
    const author = request.nextUrl.searchParams.get('author') || ''
    let poems = await getZephyrPoems({ author })

    const result: string = await converter('漢語')
    console.log(`result`, result)
    const response = NextResponse.json({ poems })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}

export async function POST(request: NextRequest) {
    const body: any = request.body
    const { author } = body || {}

    const result: string = await converter('漢語')
    console.log(`result`, result)

    const poems = await getZephyrPoems({ author })
    const response = NextResponse.json({ poems })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}

import { NextRequest, NextResponse } from 'next/server'
import { PaLMCall } from '../../PaLM/connect'
import { getZephyrPoems } from '../../firebase/connect'

export async function GET(request: NextRequest) {
    // const resultJson = await chat()
    const isSet = request.nextUrl.searchParams.get('set') == '1'
    let poems

    poems = await getZephyrPoems()

    const response = NextResponse.json({ poems })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}

export async function POST(request: NextRequest) {
    const poems = await getZephyrPoems()
    const response = NextResponse.json({ poems })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}

const chat = async () => {
    const result = await PaLMCall()
    return result
}

import { NextRequest, NextResponse } from 'next/server'
import { PaLMCall } from '../../PaLM/connect'
import { getZephyrPoems, updateZephyrPoems } from '../../firebase/connect'

export async function GET(request: NextRequest) {
    // const resultJson = await chat()
    const isSet = request.nextUrl.searchParams.get('set') == '1'
    let poem
    if (isSet) {
        poem = await updateZephyrPoems()
    } else {
        poem = await getZephyrPoems()
    }
    const response = NextResponse.json({ poem })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}

export async function POST(request: NextRequest) {
    const resultJson = await chat()
    const response = NextResponse.json({ ...resultJson })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
}

const chat = async () => {
    const result = await PaLMCall()
    return result
}

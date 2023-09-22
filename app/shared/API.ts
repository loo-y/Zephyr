import { AnyObj, IGetPoemsProps } from './interface'
import _ from 'lodash'

const commonOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
}

// example
export const fetchCount = async ({ count }: { count: number }) => {
    const response = await fetch('/api/count', {
        ...commonOptions,
        body: JSON.stringify({ count }),
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await response.json()
}

export const fetchPoems = async (params: IGetPoemsProps) => {
    let data = null,
        status = false
    try {
        const response = await fetch('/api/poems', {
            ...commonOptions,
            body: JSON.stringify({ ...params }),
        })
        if (!response.ok) {
            // throw new Error(response.statusText)
            return {
                status,
                data,
            }
        }
        data = await response.json()
        status = true
    } catch (e) {
        console.log(`fetchPoems`, e)
    }

    return {
        data,
        status,
    }
}

import { AnyObj } from './interface'

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

// Desc: Utility functions
import * as OpenCC from 'opencc-js'
/**
 * @param timeout
 * @param handler
 * @returns
 */
export const onTimeout = (timeout: number, handler: () => void) => {
    const timeoutId = setTimeout(handler, timeout)
    return () => clearTimeout(timeoutId)
}
// const cancelTimeout = onTimeout(100, ()=>{
//     console.log('cancelTimeout')
//     // Do something
// })

// // on destory
// cancelTimeout()

export const sleep = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))

const s2t = OpenCC.Converter({ from: 'cn', to: 'hk' })
export const simplifiedToTraditional = (text: string) => {
    if (!text) return text
    const result: string = s2t(text)
    return result
}

const t2s = OpenCC.Converter({ from: 'hk', to: 'cn' })
export const traditionalToSimplified = (text: string) => {
    if (!text) return text
    const result: string = t2s(text)
    return result
}

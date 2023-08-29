// Desc: Utility functions

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

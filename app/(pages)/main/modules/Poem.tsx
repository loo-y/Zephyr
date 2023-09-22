'use client'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { getPoems, getMainState } from '../slice'
import { useEffect, useState } from 'react'
import { PoemItem } from '../interface'

export default () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getMainState)
    const { poems } = state || {}
    const [poem, setPoem] = useState<PoemItem | null>(null)
    useEffect(() => {
        const poems = dispatch(getPoems())
    }, [])
    useEffect(() => {
        console.log(`state in useEffect`, state)
        if (poems?.[0]) {
            setPoem(poems[0])
        }
    }, [poems])
    console.log(`state`, state)
    return <div className="poem flex">{poem ? JSON.stringify(poem) : null}</div>
}

'use client'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { getPoems, getMainState } from '../slice'
import { useEffect, useState } from 'react'
import { PoemItem, PeomPrgph } from '../interface'
import _ from 'lodash'

export default () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getMainState)
    const { poems } = state || {}
    const [poem, setPoem] = useState<PoemItem | null>(null)
    const [peomPrgph, setPomPrgph] = useState<PeomPrgph[]>([])
    useEffect(() => {
        const poems = dispatch(getPoems())
    }, [])
    useEffect(() => {
        console.log(`state in useEffect`, state)
        if (poems?.[0]) {
            setPoem(poems[0])
            const { paragraphs } = poems[0]
            setPomPrgph(
                _.map(paragraphs.join('').match(/([^,，。]+[,，。]{1})/g) || [], p => {
                    return {
                        content: p,
                        isHide: Math.random() > 0.5,
                    }
                })
            )
        }
        listenForChineseInput()
    }, [poems])
    console.log(`state`, state)
    return (
        <div className="poem flex  mx-auto w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4">
            <div className="flex-col flex justify-center items-center">
                {_.map(peomPrgph, (paragraph, index) => {
                    const { isHide, content } = paragraph || {}
                    console.log(paragraph)
                    if (isHide) {
                        return (
                            <input
                                key={`paragraph_${index}`}
                                className=" content-center text-center outline-none bg-transparent inline"
                            ></input>
                        )
                    }
                    return <span key={`paragraph_${index}`}>{content}</span>
                })}
            </div>
        </div>
    )
}

const listenForChineseInput = () => {
    document.removeEventListener('input', () => {})
    document.addEventListener('input', (event: Event) => {
        const inputElement = event.target as HTMLInputElement
        console.log(`inputElement`, inputElement)
        const inputValue = inputElement.textContent || ''

        const isChineseCharacter = /[\u4e00-\u9fff\u{20000}-\u{2fa1f}]/u.test(inputValue)
        console.log(`input`, inputValue)
        if (isChineseCharacter) {
            console.log(inputValue)
        }
    })
}

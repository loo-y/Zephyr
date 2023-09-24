'use client'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { getPoems, getMainState } from '../slice'
import { useEffect, useState, FormEvent, useRef } from 'react'
import { PoemItem, PeomPrgph } from '../interface'
import _ from 'lodash'

export default () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getMainState)
    const { poems } = state || {}
    const [poem, setPoem] = useState<PoemItem | null>(null)
    const [peomPrgphList, setPomPrgphList] = useState<PeomPrgph[]>([])
    useEffect(() => {
        const poems = dispatch(getPoems())
    }, [])
    useEffect(() => {
        console.log(`state in useEffect`, state)
        if (poems?.[0]) {
            setPoem(poems[0])
            const { paragraphs } = poems[0]
            setPomPrgphList(
                _.map(paragraphs.join('').match(/([^,，。]+[,，。]{1})/g) || [], p => {
                    return {
                        content: p,
                        isHide: Math.random() > 0.5,
                    }
                })
            )
        }
        // listenForChineseInput()
    }, [poems])
    console.log(`state`, state)
    return (
        <div className="poem flex  mx-auto w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4">
            <div className="flex-col flex justify-center items-center">
                {_.map(peomPrgphList, (paragraph, index) => {
                    const { isHide, content } = paragraph || {}
                    console.log(paragraph)

                    return <ParagraphInput key={`paragraph_${index}`} peomPrgph={paragraph} />

                    // return <span key={`paragraph_${index}`}>{content}</span>
                })}
            </div>
        </div>
    )
}

const ParagraphInput = ({ peomPrgph }: { peomPrgph: PeomPrgph }) => {
    const { isHide, content } = peomPrgph || {}

    const [texts, setTexts] = useState<{ value: string; inputValue: string }[]>([])
    const inputRefs = useRef([])

    useEffect(() => {
        if (content) {
            const _texts = content.split('')
            const newTexts = _.map(_texts, _t => {
                const isSymbol = /[\p{P}\p{S}]/u.test(_t)
                return {
                    value: _t,
                    inputValue: !isHide || isSymbol ? _t : '',
                }
            })

            setTexts(newTexts)
        }
    }, [content])

    const handleInput = (event: FormEvent<HTMLInputElement>) => {
        console.log(`handleInput`, event?.target)
        const theInput = event.target as HTMLInputElement
        inputRefs.current.forEach((el, index) => {
            if (el == theInput) {
                console.log(`intRefs`, theInput, inputRefs.current.length, index)
            }
        })
    }

    if (!content) return null
    console.log(`inputRefs.current.length`, inputRefs.current.length)
    return (
        <div className="flex flex-row gap-[0.125rem]">
            {_.map(texts, (t, tIndex) => {
                const { value, inputValue } = t || {}
                if (inputValue) {
                    return (
                        <span className=" w-5" key={`paragraphinput_${tIndex}`}>
                            {inputValue}
                        </span>
                    )
                }
                return (
                    <input
                        type="text"
                        ref={element => inputRefs.current.push(element as never)}
                        onInput={handleInput}
                        autoComplete={'nope'}
                        key={`paragraphinput_${tIndex}`}
                        className=" w-5 content-center text-center outline-none bg-transparent inline border-b border-indigo-300"
                    ></input>
                )
            })}
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

'use client'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { getPoems, getMainState } from '../slice'
import { useEffect, useState, FormEvent, useRef, MutableRefObject } from 'react'
import { PoemItem, PeomPrgph, SingleText } from '../interface'
import _ from 'lodash'
import { traditionalToSimplified } from '@/app/shared/util'

export default () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getMainState)
    const { poems } = state || {}
    const [poem, setPoem] = useState<PoemItem | null>(null)
    const [poemPrgphList, setPoemPrgphList] = useState<PeomPrgph[]>([])
    const inputRefs = useRef([])
    useEffect(() => {
        const poems = dispatch(getPoems())
    }, [])
    useEffect(() => {
        console.log(`state in useEffect`, state)
        if (poems?.[0]) {
            setPoem(poems[0])
            const { paragraphs } = poems[0]
            let hideLength = 0
            let newPoemPgrhList = _.map(paragraphs.join('').match(/([^,，。]+[,，。]{1})/g) || [], (p, index) => {
                const isHide = Math.random() > 0.5
                if (isHide) hideLength++
                return {
                    content: traditionalToSimplified(p),
                    isHide,
                }
            })

            if (hideLength > 0 && hideLength == newPoemPgrhList.length) {
                newPoemPgrhList[0] = {
                    ...newPoemPgrhList[0],
                    isHide: false,
                }
            }
            setPoemPrgphList(newPoemPgrhList)
        }
        // listenForChineseInput()
    }, [poems])

    return (
        <div className="poem flex flex-col gap-1 mx-auto w-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4 text-slate-500">
            <div className="title flex items-center w-full justify-center pr-6 mb-3 text-xl">{poem?.title}</div>
            <div className="author flex items-center w-full justify-end pr-3 mb-3 text-sm">-- {poem?.author}</div>
            <div className="flex-col flex justify-center items-center gap-2">
                {_.map(poemPrgphList, (paragraph, index) => {
                    const { isHide, content } = paragraph || {}
                    console.log(paragraph)

                    return <ParagraphInput key={`paragraph_${index}`} peomPrgph={paragraph} inputRefs={inputRefs} />

                    // return <span key={`paragraph_${index}`}>{content}</span>
                })}
            </div>
        </div>
    )
}

const ParagraphInput = ({ peomPrgph, inputRefs }: { peomPrgph: PeomPrgph; inputRefs: MutableRefObject<never[]> }) => {
    const { isHide, content } = peomPrgph || {}

    const [texts, setTexts] = useState<SingleText[]>([])

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

    const handleInput = (event: FormEvent<HTMLInputElement>, texts: SingleText[], currentTextIndex: number) => {
        const theInput = event.target as HTMLInputElement
        const value = theInput.value
        const currentText = texts[currentTextIndex]
        const totalTextsLength = texts.length
        const valueLength = value.length
        const curentRefIndex = _.findIndex(inputRefs.current, (el: any) => {
            return el == theInput
        })
        if (valueLength > 0 && value[0] == currentText.value) {
            _.each(value, (v, index) => {
                if (index > 0) {
                    const nextText = texts[currentTextIndex + index]
                    if (nextText) {
                        if (nextText?.value == v) {
                            // @ts-ignore
                            inputRefs.current[curentRefIndex + index].value = v
                            if (index == valueLength - 1) {
                                // last one
                                // @ts-ignore
                                inputRefs.current[curentRefIndex + index + 1]?.focus()
                            }
                        } else {
                            // @ts-ignore
                            inputRefs.current[curentRefIndex + index].focus()
                            return false // break;
                        }
                    }
                } else {
                    // @ts-ignore
                    inputRefs.current[curentRefIndex].value = value[0]
                    // @ts-ignore
                    inputRefs.current[curentRefIndex + 1]?.focus()
                }
            })
            ;(inputRefs.current[curentRefIndex] as HTMLInputElement).style.borderColor = ''
            ;(inputRefs.current[curentRefIndex] as HTMLInputElement).style.color = ''
        } else if (/[\u4e00-\u9fff\u{20000}-\u{2fa1f}]/u.test(value)) {
            // @ts-ignore
            inputRefs.current[curentRefIndex].value = value[0]
            ;(inputRefs.current[curentRefIndex] as HTMLInputElement).style.borderColor = 'rgb(239 68 68)'
            ;(inputRefs.current[curentRefIndex] as HTMLInputElement).style.color = 'rgb(239 68 68)'
        }
    }

    const handleKeydown = (event: FormEvent<HTMLInputElement>) => {
        const deleteKeyCode = 8 // Backspace 键的键码为 8
        const theInput = event.target as HTMLInputElement
        // @ts-ignore
        if (event.keyCode === deleteKeyCode) {
            const curentRefIndex = _.findIndex(inputRefs.current, (el: any) => {
                return el == theInput
            })
            ;(inputRefs.current[curentRefIndex] as HTMLInputElement).style.borderColor = ''
            ;(inputRefs.current[curentRefIndex] as HTMLInputElement).style.color = ''

            if (theInput.value?.length < 1) {
                setTimeout(() => {
                    // @ts-ignore
                    inputRefs.current[curentRefIndex - 1]?.focus()
                }, 10)
            }
        }
    }

    if (!content) return null
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
                        onInput={e => handleInput(e, texts, tIndex)}
                        onKeyDown={handleKeydown}
                        autoComplete={'nope'}
                        key={`paragraphinput_${tIndex}`}
                        className={` w-5 content-center text-center outline-none bg-transparent inline border-b border-gray-500 `}
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

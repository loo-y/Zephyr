import { POEM_TYPE } from '@/app/shared/interface'
export interface MainState {
    requestInQueueFetching: boolean
    poems?: PoemItem[]
}

export type PoemItem = {
    author?: string
    paragraphs: string[]
    notes?: string[]
    title: string
    tags?: string[]
    prologue?: string
    type?: POEM_TYPE
}

export type PeomPrgph = {
    content: string
    isHide?: boolean
}

export type SingleText = {
    value: string
    inputValue?: string
}

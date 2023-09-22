'use client'
import { NextPage } from 'next'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { Provider } from 'react-redux'
import store from '@/app/store'
import Poem from './modules/Poem'

const Main: NextPage<{ serverSideData: any }, any> = ({ serverSideData }: { serverSideData: any }) => {
    return (
        <>
            <main className="main">
                <Poem />
            </main>
        </>
    )
}

export default function MainPage() {
    return (
        <Provider store={store}>
            <Main serverSideData={null} />
        </Provider>
    )
}

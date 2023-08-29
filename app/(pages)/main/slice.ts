import { createAsyncThunk, createSlice, original, PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AppThunk } from '@/app/store'
import * as API from '@/app/shared/API'
import { fetchCount } from '@/app/shared/API'
import { MainState } from './interface'
// import _ from 'lodash' // use specific function from lodash
import { map as _map } from 'lodash'
import type { AsyncThunk } from '@reduxjs/toolkit'

// define a queue to store api request
type APIFunc = (typeof API)[keyof typeof API]
type APIFuncName = keyof typeof API
export const getMainState = (state: AppState): MainState => state.main

const initialState: MainState = {
    requestInQueueFetching: false,
}

type RequestCombo = {
    apiRequest: APIFunc
    asyncThunk?: AsyncThunk<any, any, any>
}
const apiRequestQueue: Array<RequestCombo> = []
// define a thunk action to wrap api request
const makeApiRequestInQueue = createAsyncThunk(
    'mainSlice/makeApiRequestInQueue',
    async (requestCombo: RequestCombo, { dispatch, getState }: any) => {
        const mainState = getMainState(getState())
        const { requestInQueueFetching } = mainState || {}

        // 将接口请求添加到队列中，并设置isFetching为true
        apiRequestQueue.push(requestCombo)

        if (requestInQueueFetching) {
            // if there is a request in progress, return a resolved Promise
            return Promise.resolve()
        }

        const { setRequestInQueueFetching } = mainSlice.actions
        dispatch(setRequestInQueueFetching(true))

        // loop through the queue and process each request
        while (apiRequestQueue.length > 0) {
            const nextRequestCombo = apiRequestQueue.shift()
            if (nextRequestCombo) {
                const { apiRequest, asyncThunk } = nextRequestCombo || {}

                // send api request
                try {
                    // @ts-ignore
                    asyncThunk && dispatch(asyncThunk.pending())
                    // @ts-ignore
                    dispatch(makeApiRequestInQueue.pending())
                    // @ts-ignore
                    const response = await apiRequest()
                    // @ts-ignore
                    asyncThunk && dispatch(asyncThunk.fulfilled(response))
                    // @ts-ignore
                    dispatch(makeApiRequestInQueue.fulfilled(response))
                } catch (error) {
                    // @ts-ignore
                    asyncThunk && dispatch(asyncThunk.rejected(error))
                    // @ts-ignore
                    dispatch(makeApiRequestInQueue.rejected(error))
                }
            }
        }

        // set RequestInQueueFetching to false when all requests are processed
        dispatch(setRequestInQueueFetching(false))
    }
)

export const setCount = createAsyncThunk(
    'mainSlice/getCount',
    async (params: { count: number }, { dispatch, getState }: any) => {
        const mainState: MainState = getMainState(getState())
        dispatch(
            makeApiRequestInQueue({
                apiRequest: fetchCount.bind(null, {
                    count: params.count,
                }),
                asyncThunk: setCount,
            })
        )
    }
)

export const mainSlice = createSlice({
    name: 'mainSlice',
    initialState,
    reducers: {
        setRequestInQueueFetching: (state, action: PayloadAction<boolean>) => {
            state.requestInQueueFetching = action.payload
        },
        updateState: (state, action: PayloadAction<Partial<MainState>>) => {
            return { ...state, ...action.payload }
        },
    },
    extraReducers: builder => {
        builder.addCase(setCount.fulfilled, (state, action) => {
            if (action.payload as any) {
                const { status, count } = (action.payload as any) || {}
                state.count = count
            } else {
                return { ...state }
            }
        })
    },
})

// export actions
export const { updateState } = mainSlice.actions
export default mainSlice.reducer

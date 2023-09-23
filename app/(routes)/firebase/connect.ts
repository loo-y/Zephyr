import { initializeApp } from 'firebase/app'
import {
    getFirestore,
    collection,
    CollectionReference,
    DocumentData,
    doc,
    setDoc,
    where,
    query,
    orderBy,
    startAt,
    getDocs,
    Firestore,
} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";

import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import * as dotenv from 'dotenv'
import { IGetPoemsProps } from '../../shared/interface'
dotenv.config()
declare global {
    var poemsCollection: CollectionReference<DocumentData, DocumentData>
    var zephyrStoreDB: Firestore
}

const {
    FIREBASE_CONFIG_apiKey,
    FIREBASE_CONFIG_authDomain,
    FIREBASE_CONFIG_projectId,
    FIREBASE_CONFIG_storageBucket,
    FIREBASE_CONFIG_messagingSenderId,
    FIREBASE_CONFIG_appId,
    FIREBASE_CONFIG_measurementId,
} = process.env || {}

const firebaseConfig = {
    apiKey: FIREBASE_CONFIG_apiKey,
    authDomain: FIREBASE_CONFIG_authDomain,
    projectId: FIREBASE_CONFIG_projectId,
    storageBucket: FIREBASE_CONFIG_storageBucket,
    messagingSenderId: FIREBASE_CONFIG_messagingSenderId,
    appId: FIREBASE_CONFIG_appId,
    measurementId: FIREBASE_CONFIG_measurementId,
}

const getPoemsCollection = () => {
    if (global.poemsCollection) {
        console.log(`global.poemsCollection is existed`)
        return global.poemsCollection
    }
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    // const analytics = getAnalytics(app);
    const zephyrStoreDB = getFirestore(app)
    global.poemsCollection = collection(zephyrStoreDB, 'poems')
    return global.poemsCollection
}

const getzephyrStoreDB = () => {
    if (global.zephyrStoreDB) {
        console.log(`global.zephyrStoreDB is existed`)
        return global.zephyrStoreDB
    }
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    // const analytics = getAnalytics(app);
    const zephyrStoreDB = getFirestore(app)
    global.zephyrStoreDB = zephyrStoreDB
    return global.zephyrStoreDB
}

export const getZephyrPoems = async ({ author }: IGetPoemsProps = {}) => {
    let poems: any[] = []
    const poemsCollection = getPoemsCollection()
    const q = query(poemsCollection, where('id', '==', '92fcaa7f-5bd9-4f03-a74b-3e0bb40ffb41'))
    const querySnapshot = await getDocs(q)
    console.log(`get querySnapshot`)
    console.log(querySnapshot)
    querySnapshot.forEach(doc => {
        const v = doc.data()
        console.log(doc.id, ' => ', v)
        poems.push(v)
    })

    return poems
}

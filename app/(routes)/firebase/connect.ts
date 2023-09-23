import { FirebaseApp, initializeApp, getApps, getApp } from 'firebase/app'
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
    persistentLocalCache,
    initializeFirestore,
    persistentSingleTabManager,
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
    var zephyrApp: FirebaseApp
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
    const poemsCollection = collection(zephyrStoreDB, 'poems')
    global.poemsCollection = poemsCollection
    return poemsCollection
}

const getZephyrStoreDB = () => {
    if (global.zephyrStoreDB) {
        console.log(`global.zephyrStoreDB is existed`)
        return global.zephyrStoreDB
    }
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    // const analytics = getAnalytics(app);
    const zephyrStoreDB = getFirestore(app)
    global.zephyrStoreDB = zephyrStoreDB
    return zephyrStoreDB
}

const getZephyrApp = () => {
    if (global.zephyrApp) {
        console.log(`global.zephyrApp`, getApps().length)
        return getApp(global.zephyrApp.name)
        // return global.zephyrApp;
    }
    // Initialize Firebase
    const app = initializeApp(firebaseConfig, 'zephyrApp')
    // initializeFirestore(app, {localCache: persistentLocalCache({})});
    global.zephyrApp = app
    console.log(`new app init`, getApp(`zephyrApp`), getApps().length)
    return app
}
export const getZephyrPoems = async ({ author }: IGetPoemsProps = {}) => {
    let poems: any[] = []
    // const poemsCollection = getPoemsCollection()
    // const zephyrStoreDB = getZephyrStoreDB()

    const zephyrApp = getZephyrApp()
    const zephyrStoreDB = getFirestore(zephyrApp)
    const poemsCollection = collection(zephyrStoreDB, 'poems')
    const errorID = `testid`
    const correctID = `92fcaa7f-5bd9-4f03-a74b-3e0bb40ffb41`
    const q = query(poemsCollection, where('id', '==', errorID))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
        const v = doc.data()
        console.log(doc.id, ' => ', v)
        poems.push(v)
    })

    return poems
}

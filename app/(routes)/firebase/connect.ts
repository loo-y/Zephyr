import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore'
import firebaseAdmin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
dotenv.config()

declare global {
    var firebaseDB: firebaseAdmin.firestore.Firestore
}

const initializeFirebaseDB = () => {
    if (!global.firebaseDB) {
        // @ts-ignore
        const serviceAccount = path.resolve(process.env.FIREBASE_KEY_PATH)
        initializeApp({
            credential: cert(serviceAccount),
        })
        global.firebaseDB = getFirestore()
    }
    return global.firebaseDB
}

const zephyrStoreDB = initializeFirebaseDB()
const zephyrStoreDBName = `zephyr-store`
const collectionName = `poems`

export const getZephyrPoem = async () => {
    const poemsCollection = await zephyrStoreDB.collection(collectionName)

    const x = await poemsCollection.get()
    let poems: any[] = []
    x.forEach(doc => {
        const v = doc.data()
        console.log(`v===>`, v)
        poems.push(v)
    })

    // const item = await poem.doc('dtWA5IC6MNpg5mtGKAES')
    // const test = await item.get()
    // poem.docs.forEach(doc => {
    //     console.log(doc.id, '=>', doc.data());
    //   });
    // if (!info.exists) {
    //     console.log('No such document!');
    //   } else {
    //     console.log('Document data:', info.data());
    //   }

    return poems
}

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore'
import firebaseAdmin from 'firebase-admin'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import * as dotenv from 'dotenv'
import { IGetPoemsProps } from '../../shared/interface'
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

export const getZephyrPoems = async ({ author }: IGetPoemsProps = {}) => {
    const poemsCollection = zephyrStoreDB.collection(collectionName)

    let poems: any[] = []

    // const docList = await poemsCollection.where('author', '==', author).get()

    // docList.forEach(doc => {
    //     const v = doc.data()
    //     // console.log(`v===>`, v)
    //     poems.push(v)
    // })

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

    poems = tang01test
    return poems
}

export const updateZephyrPoems = async () => {
    const poemsCollection = zephyrStoreDB.collection(collectionName)

    const batch = zephyrStoreDB.batch()
    let x = 1
    _.map(tang01test, t => {
        x += 1
        console.log(`x`, x)
        batch.create(poemsCollection.doc(), t)
    })

    console.log(`x====>1`, x)

    await batch.commit()

    console.log(`x====>2`, x)
    const size = (await poemsCollection.get()).size

    return { size }
}
const tang01test = [
    {
        author: '宋太祖',
        paragraphs: ['欲出未出光辣達，千山萬山如火發。', '須臾走向天上來，逐却殘星趕却月。'],
        title: '日詩',
        id: '08e41396-2809-423d-9bbc-1e6fb24c0ca1',
    },
    {
        author: '宋太祖',
        paragraphs: ['未離海底千山黑，纔到天中萬國明。'],
        title: '句',
        id: 'adaa27a4-389b-48ca-8021-80f0471433c4',
    },
]

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjUIThHA9SaJUEhiWMBR5EGlz6VUB5pSo",
  authDomain: "ebay-cellphone-database.firebaseapp.com",
  projectId: "ebay-cellphone-database",
  storageBucket: "ebay-cellphone-database.firebasestorage.app",
  messagingSenderId: "1091264899953",
  appId: "1:1091264899953:web:5e650805fbba69502ae4d0",
  measurementId: "G-ZDMKKQY0WH"
};


const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage }

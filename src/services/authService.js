// src/services/authService.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from './firebase';

export const authService = {
    async signUp(email, password, profileData) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(firestore, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            name: profileData.name || '',
            age: profileData.age || '',
            gender: profileData.gender || '',
            state: profileData.state || '',
            district: profileData.district || '',
            phone: profileData.phone || '',
            createdAt: serverTimestamp(),
        });
        return user;
    },

    async signIn(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    async signOut() {
        await signOut(auth);
    },

    onAuthChange(callback) {
        return onAuthStateChanged(auth, callback);
    },

    async getUserProfile(uid) {
        const snap = await getDoc(doc(firestore, 'users', uid));
        return snap.exists() ? snap.data() : null;
    },

    async updateUserProfile(uid, data) {
        await updateDoc(doc(firestore, 'users', uid), {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    getCurrentUser() {
        return auth.currentUser;
    },
};
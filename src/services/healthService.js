// src/services/healthService.js
import {
    collection, addDoc, getDocs, getDoc,
    doc, orderBy, query, limit, serverTimestamp,
} from 'firebase/firestore';
import { firestore } from './firebase';

export const healthService = {
    async saveHealthReport(uid, reportData) {
        const ref = await addDoc(
            collection(firestore, 'users', uid, 'healthReports'),
            { ...reportData, createdAt: serverTimestamp() }
        );
        return ref.id;
    },

    async getHealthReports(uid, limitCount = 10) {
        const q = query(
            collection(firestore, 'users', uid, 'healthReports'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async getHealthReport(uid, reportId) {
        const snap = await getDoc(doc(firestore, 'users', uid, 'healthReports', reportId));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },
};
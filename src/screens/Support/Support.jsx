import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, Header, Input } from '../../components/UIComponents';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';
import { db } from "../../services/firebase";

const HELPLINES = [
    { id: '1', name: 'National Ambulance', number: '108', icon: 'ambulance', color: '#E53935', desc: '24/7 Free Emergency' },
    { id: '2', name: 'Health Helpline', number: '104', icon: 'hospital-building', color: '#1E88E5', desc: 'Medical Advice' },
    { id: '3', name: 'Emergency Services', number: '112', icon: 'phone', color: '#F57C00', desc: 'Police, Fire, Medical' },
    { id: '4', name: 'Women Helpline', number: '1091', icon: 'face-woman', color: '#8E24AA', desc: 'Women in Distress' },
    { id: '5', name: 'Child Helpline', number: '1098', icon: 'human-child', color: '#00897B', desc: 'Child Protection' },
    { id: '6', name: 'Mental Health', number: '1800-599-0019', icon: 'brain', color: '#5E35B1', desc: 'NIMHANS iCall' },
];

const FAQS = [
    { q: 'What is ASHA?', a: 'ASHA (Accredited Social Health Activist) is a community health worker scheme under India\'s National Rural Health Mission (NRHM) to provide basic healthcare in rural communities.' },
    { q: 'Is the health analysis accurate?', a: 'The AI-based health analysis provides general guidance only. It is not a medical diagnosis. Always consult a qualified healthcare professional for proper treatment.' },
    { q: 'How do I apply for Ayushman Bharat?', a: 'Visit your nearest empanelled hospital or Common Service Centre (CSC) with your Aadhaar card. You can also check eligibility at pmjay.gov.in.' },
    { q: 'Are my health records private?', a: 'Yes. Your health reports are securely stored in your personal account using Firebase. Only you can access your records.' },
    { q: 'How do I update my profile?', a: 'Go to the Profile tab and tap "Edit Profile" to update your personal information including age, gender, state, and district.' },
];

export default function Support() {
    const [openFaq, setOpenFaq] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [ashaWorkers, setAshaWorkers] = useState([]);

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "asha_workers"));

            const workers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setAshaWorkers(workers);

        } catch (error) {
            console.log("Error loading ASHA workers:", error);
        }
    };

    const callNumber = (number) => {
        Linking.openURL(`tel:${number}`).catch(() =>
            Alert.alert('Cannot Call', 'Unable to make a call from this device.')
        );
    };

    const submitFeedback = () => {
        if (!feedbackText.trim()) return;
        Alert.alert('Thank You!', 'Your feedback has been submitted. We appreciate your help in improving ASHA.');
        setFeedbackText('');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Header title="Support" subtitle="Help & Emergency" />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>HealthCare Support</Text>

                {ashaWorkers.map(worker => (

                    <TouchableOpacity
                        key={worker.id}
                        style={styles.workerCard}
                        onPress={() => callNumber(worker.phone)}
                    >

                        <View style={styles.workerLeft}>

                            <Icon name="account" size={28} color={COLORS.primary} />

                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.workerName}>{worker.name}</Text>

                                <Text style={styles.workerDesignation}>
                                    {worker.designation}
                                </Text>

                                <Text style={styles.workerArea}>
                                    {worker.area}
                                </Text>
                            </View>

                        </View>

                        <TouchableOpacity
                            style={styles.workerCallBtn}
                            onPress={() => callNumber(worker.phone)}
                        >

                            <Icon name="phone" size={18} color="#fff" />

                        </TouchableOpacity>

                    </TouchableOpacity>

                ))}

            </View>

            {/* Emergency Helplines */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Emergency Helplines</Text>
                <View style={styles.helplineGrid}>
                    {HELPLINES.map(h => (
                        <TouchableOpacity
                            key={h.id}
                            style={[styles.helplineCard, { borderTopColor: h.color }]}
                            onPress={() => callNumber(h.number)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.helplineIconWrap, { backgroundColor: h.color + '18' }]}>
                                <Icon name={h.icon} size={24} color={h.color} />
                            </View>
                            <Text style={styles.helplineName}>{h.name}</Text>
                            <Text style={[styles.helplineNumber, { color: h.color }]}>{h.number}</Text>
                            <Text style={styles.helplineDesc}>{h.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>



            {/* FAQ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                {FAQS.map((faq, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => setOpenFaq(openFaq === i ? null : i)}
                        activeOpacity={0.85}
                    >
                        <Card style={[styles.faqCard, openFaq === i && styles.faqCardOpen]}>
                            <View style={styles.faqHeader}>
                                <Text style={styles.faqQuestion}>{faq.q}</Text>
                                <Icon
                                    name={openFaq === i ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={openFaq === i ? COLORS.primary : COLORS.textMuted}
                                />
                            </View>
                            {openFaq === i && (
                                <Text style={styles.faqAnswer}>{faq.a}</Text>
                            )}
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Feedback */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Share Your Feedback</Text>
                <Card>
                    <Input
                        label="Your Feedback"
                        placeholder="Tell us how we can improve ASHA..."
                        value={feedbackText}
                        onChangeText={setFeedbackText}
                        multiline
                        numberOfLines={4}
                        style={{ minHeight: 100, textAlignVertical: 'top' }}
                    />
                    <Button title="Submit Feedback" onPress={submitFeedback} icon="send" />
                </Card>
            </View>

            {/* App Info */}
            <Card style={styles.appInfo}>
                <Text style={styles.appInfoTitle}>🌿 ASHA Healthcare</Text>
                <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
                <Text style={styles.appInfoDesc}>
                    Empowering rural India with accessible healthcare information and AI-powered guidance.
                </Text>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { paddingBottom: SPACING.xxl },
    section: { padding: SPACING.lg, paddingBottom: 0 },
    sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },

    // Helplines
    helplineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    helplineCard: {
        width: '47%', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md, alignItems: 'center', borderTopWidth: 3,
        shadowColor: COLORS.black, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    helplineIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
    helplineName: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.textPrimary, textAlign: 'center' },
    helplineNumber: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginTop: 2 },
    helplineDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },

    // FAQ
    faqCard: { marginBottom: SPACING.sm },
    faqCardOpen: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    faqQuestion: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.textPrimary, marginRight: SPACING.sm },
    faqAnswer: { marginTop: SPACING.sm, fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, lineHeight: 22 },

    workerCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.white,
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2
    },

    workerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },

    workerName: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.semibold,
        color: COLORS.textPrimary
    },

    workerArea: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.textMuted
    },

    workerCallBtn: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 30
    },

    workerDesignation: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: "500",
        marginTop: 2
    },

    // Feedback
    appInfo: { margin: SPACING.lg, alignItems: 'center', backgroundColor: COLORS.primaryLight },
    appInfoTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.primaryDark },
    appInfoVersion: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
    appInfoDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 20 },
});
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Input, Card, Header } from '../../components/UIComponents';
import { geminiService } from '../../services/geminiService';
import { healthService } from '../../services/healthService';
import { useAuthStore, useHealthStore } from '../../store/store';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../../constants/theme';

const SYMPTOM_CHIPS = [
    'Fever', 'Headache', 'Cough', 'Cold', 'Body Pain',
    'Vomiting', 'Diarrhea', 'Fatigue', 'Chest Pain', 'Breathlessness',
    'Rash', 'Stomach Ache', 'Dizziness', 'Joint Pain', 'Back Pain',
];

const DURATION_OPTIONS = ['Today', '1-3 days', '4-7 days', '1-2 weeks', 'More than 2 weeks'];
const SEVERITY_OPTIONS = [
    { label: 'Mild', color: COLORS.success, icon: 'emoticon-happy-outline' },
    { label: 'Moderate', color: COLORS.warning, icon: 'emoticon-neutral-outline' },
    { label: 'Severe', color: COLORS.error, icon: 'emoticon-sad-outline' },
];

export default function HealthReportForm({ navigation }) {
    const { user, userProfile } = useAuthStore();
    const { setCurrentReport, setAnalysisResult, setAnalyzing } = useHealthStore();

    const [selectedChips, setSelectedChips] = useState([]);
    const [customSymptoms, setCustomSymptoms] = useState('');
    const [duration, setDuration] = useState('');
    const [severity, setSeverity] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleChip = (chip) => {
        setSelectedChips(prev =>
            prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
        );
    };

    const handleAnalyze = async () => {
        const allSymptoms = [
            ...selectedChips,
            ...(customSymptoms.trim() ? [customSymptoms.trim()] : []),
        ];

        if (allSymptoms.length === 0) {
            Alert.alert('No Symptoms', 'Please select or describe at least one symptom.');
            return;
        }
        if (!duration) {
            Alert.alert('Duration Missing', 'Please select how long you have had these symptoms.');
            return;
        }
        if (!severity) {
            Alert.alert('Severity Missing', 'Please indicate how severe your symptoms are.');
            return;
        }

        setLoading(true);
        setAnalyzing(true);

        try {
            const symptomsText = `
Symptoms: ${allSymptoms.join(', ')}
Duration: ${duration}
Severity: ${severity}
Additional Information: ${additionalInfo || 'None'}
      `.trim();

            const result = await geminiService.analyzeHealthReport(symptomsText, {
                age: userProfile?.age,
                gender: userProfile?.gender,
                state: userProfile?.state,
            });

            const report = {
                symptoms: allSymptoms,
                customSymptoms,
                duration,
                severity,
                additionalInfo,
                analysisResult: result,
                timestamp: new Date().toISOString(),
            };

            setCurrentReport(report);
            setAnalysisResult(result);

            // Save to Firestore
            if (user) {
                await healthService.saveHealthReport(user.uid, report);
            }

            navigation.navigate('HealthResults');
        } catch (err) {
            Alert.alert('Analysis Failed', 'Could not analyze symptoms. Please check your internet connection and try again.');
            console.error(err);
        } finally {
            setLoading(false);
            setAnalyzing(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <Header
                title="Health Check"
                subtitle="Describe your symptoms"
                onBack={() => navigation.goBack()}
                rightAction={
                    <TouchableOpacity onPress={() => navigation.navigate('HealthHistory')}>
                        <Icon name="history" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Symptom Chips */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Common Symptoms</Text>
                    <Text style={styles.sectionSubtitle}>Tap to select all that apply</Text>
                    <View style={styles.chipsWrap}>
                        {SYMPTOM_CHIPS.map(chip => (
                            <TouchableOpacity
                                key={chip}
                                onPress={() => toggleChip(chip)}
                                activeOpacity={0.8}
                                style={[
                                    styles.chip,
                                    selectedChips.includes(chip) && styles.chipActive,
                                ]}
                            >
                                <Text style={[styles.chipText, selectedChips.includes(chip) && styles.chipTextActive]}>
                                    {chip}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Custom Symptoms */}
                <View style={styles.section}>
                    <Input
                        label="Describe Other Symptoms"
                        placeholder="e.g. Burning sensation while urinating, swollen ankles..."
                        value={customSymptoms}
                        onChangeText={setCustomSymptoms}
                        multiline
                        numberOfLines={3}
                        style={styles.textarea}
                    />
                </View>

                {/* Duration */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How long have you had these symptoms?</Text>
                    <View style={styles.optionsRow}>
                        {DURATION_OPTIONS.map(opt => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => setDuration(opt)}
                                style={[styles.optionBtn, duration === opt && styles.optionBtnActive]}
                            >
                                <Text style={[styles.optionText, duration === opt && styles.optionTextActive]}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Severity */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>How severe are your symptoms?</Text>
                    <View style={styles.severityRow}>
                        {SEVERITY_OPTIONS.map(opt => (
                            <TouchableOpacity
                                key={opt.label}
                                onPress={() => setSeverity(opt.label)}
                                activeOpacity={0.8}
                                style={[
                                    styles.severityBtn,
                                    { borderColor: opt.color },
                                    severity === opt.label && { backgroundColor: opt.color },
                                ]}
                            >
                                <Icon name={opt.icon} size={24} color={severity === opt.label ? COLORS.white : opt.color} />
                                <Text style={[styles.severityText, { color: severity === opt.label ? COLORS.white : opt.color }]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Additional Info */}
                <View style={styles.section}>
                    <Input
                        label="Additional Information (Optional)"
                        placeholder="e.g. Ongoing medications, chronic conditions, allergies..."
                        value={additionalInfo}
                        onChangeText={setAdditionalInfo}
                        multiline
                        numberOfLines={3}
                        style={styles.textarea}
                    />
                </View>

                {/* Disclaimer */}
                <Card style={styles.disclaimer}>
                    <Icon name="information-outline" size={20} color={COLORS.info} />
                    <Text style={styles.disclaimerText}>
                        This AI analysis is for informational purposes only. Always consult a qualified healthcare professional for medical advice.
                    </Text>
                </Card>

                <Button
                    title="Analyze Symptoms"
                    onPress={handleAnalyze}
                    loading={loading}
                    icon="magnify"
                    style={styles.analyzeBtn}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
    section: { marginBottom: SPACING.lg },
    sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.textPrimary, marginBottom: 4 },
    sectionSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginBottom: SPACING.md },
    textarea: { minHeight: 80, textAlignVertical: 'top' },

    // Chips
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    chip: {
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: BORDER_RADIUS.round,
        borderWidth: 1.5, borderColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    chipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
    chipText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
    chipTextActive: { color: COLORS.primaryDark, fontWeight: FONT_WEIGHT.semibold },

    // Duration
    optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    optionBtn: {
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5, borderColor: COLORS.border,
        backgroundColor: COLORS.white,
    },
    optionBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
    optionText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary },
    optionTextActive: { color: COLORS.primaryDark, fontWeight: FONT_WEIGHT.semibold },

    // Severity
    severityRow: { flexDirection: 'row', gap: SPACING.sm },
    severityBtn: {
        flex: 1, alignItems: 'center', paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md, borderWidth: 2, gap: 6,
        backgroundColor: COLORS.white,
    },
    severityText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },

    // Disclaimer
    disclaimer: {
        flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm,
        backgroundColor: COLORS.infoLight, marginBottom: SPACING.md,
    },
    disclaimerText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.info, lineHeight: 20 },

    analyzeBtn: { marginTop: SPACING.sm },
});
import React from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, Card, Badge, Button, Divider } from '../../components/UIComponents';
import { useHealthStore } from '../../store/store';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const SEVERITY_COLORS = {
    Mild: COLORS.success,
    Moderate: COLORS.warning,
    Severe: COLORS.error,
};

export default function HealthResults({ navigation }) {
    const { currentReport, analysisResult } = useHealthStore();

    const handleShare = async () => {
        try {
            await Share.share({
                message: `ASHA Health Report\n\nSymptoms: ${currentReport?.symptoms?.join(', ')}\n\nAnalysis:\n${analysisResult}`,
                title: 'My ASHA Health Report',
            });
        } catch (e) {
            console.error(e);
        }
    };

    if (!currentReport || !analysisResult) {
        return (
            <View style={styles.empty}>
                <Icon name="clipboard-text-outline" size={64} color={COLORS.border} />
                <Text style={styles.emptyText}>No results to display</Text>
                <Button title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: SPACING.lg }} />
            </View>
        );
    }

    const severityColor = SEVERITY_COLORS[currentReport.severity] || COLORS.textMuted;

    // Parse the AI response into paragraphs for better display
    const resultParagraphs = analysisResult
        .split('\n')
        .filter(line => line.trim().length > 0);

    return (
        <>
            <Header
                title="Analysis Results"
                onBack={() => navigation.goBack()}
                rightAction={
                    <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
                        <Icon name="share-variant" size={22} color={COLORS.primary} />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Card */}
                <Card style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <View>
                            <Text style={styles.summaryTitle}>Report Summary</Text>
                            <Text style={styles.summaryDate}>
                                {new Date(currentReport.timestamp).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })}
                            </Text>
                        </View>
                        <Badge label={currentReport.severity} color={severityColor} />
                    </View>

                    <Divider />

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Icon name="clock-outline" size={16} color={COLORS.textMuted} />
                            <Text style={styles.summaryLabel}>Duration</Text>
                            <Text style={styles.summaryValue}>{currentReport.duration}</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Icon name="heart-pulse" size={16} color={COLORS.textMuted} />
                            <Text style={styles.summaryLabel}>Symptoms</Text>
                            <Text style={styles.summaryValue}>{currentReport.symptoms.length} reported</Text>
                        </View>
                    </View>
                </Card>

                {/* Symptoms Tags */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reported Symptoms</Text>
                    <View style={styles.chipsWrap}>
                        {currentReport.symptoms.map((s, i) => (
                            <View key={i} style={styles.symptomChip}>
                                <Text style={styles.symptomChipText}>{s}</Text>
                            </View>
                        ))}
                    </View>
                    {currentReport.customSymptoms ? (
                        <Text style={styles.customSymptoms}>"{currentReport.customSymptoms}"</Text>
                    ) : null}
                </View>

                {/* AI Analysis */}
                <View style={styles.section}>
                    <View style={styles.aiHeader}>
                        <Icon name="robot-outline" size={22} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>AI Health Analysis</Text>
                    </View>
                    <Card style={styles.analysisCard}>
                        {resultParagraphs.map((para, i) => {
                            const isHeading = para.match(/^\d+\.|^#+\s/);
                            const isWarning = para.toLowerCase().includes('urgent') || para.toLowerCase().includes('immediately');
                            return (
                                <Text
                                    key={i}
                                    style={[
                                        styles.analysisText,
                                        isHeading && styles.analysisHeading,
                                        isWarning && styles.analysisWarning,
                                        i > 0 && styles.analysisParagraphGap,
                                    ]}
                                >
                                    {para}
                                </Text>
                            );
                        })}
                    </Card>
                </View>

                {/* Disclaimer */}
                <Card style={styles.disclaimer}>
                    <Icon name="alert-circle-outline" size={20} color={COLORS.warning} />
                    <Text style={styles.disclaimerText}>
                        This analysis is AI-generated for informational purposes only. It is NOT a medical diagnosis. Please consult a doctor before taking any medication.
                    </Text>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button
                        title="New Health Check"
                        onPress={() => {
                            navigation.goBack();
                        }}
                        icon="refresh"
                        style={styles.actionBtn}
                    />
                    <Button
                        title="View History"
                        variant="outline"
                        onPress={() => navigation.navigate('HealthHistory')}
                        icon="history"
                        style={styles.actionBtn}
                    />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },

    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
    emptyText: { fontSize: FONT_SIZE.lg, color: COLORS.textMuted, marginTop: SPACING.md },

    shareBtn: { padding: 4 },

    // Summary
    summaryCard: { marginBottom: SPACING.lg },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
    summaryTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
    summaryDate: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
    summaryRow: { flexDirection: 'row', alignItems: 'center' },
    summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
    summaryDivider: { width: 1, height: 40, backgroundColor: COLORS.borderLight },
    summaryLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },
    summaryValue: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.textPrimary },

    // Symptoms
    section: { marginBottom: SPACING.lg },
    sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary, marginLeft: 6 },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.sm },
    symptomChip: {
        backgroundColor: COLORS.primaryLight, borderRadius: BORDER_RADIUS.round,
        paddingHorizontal: 12, paddingVertical: 5,
    },
    symptomChipText: { fontSize: FONT_SIZE.sm, color: COLORS.primaryDark, fontWeight: FONT_WEIGHT.medium },
    customSymptoms: { marginTop: SPACING.sm, fontStyle: 'italic', color: COLORS.textMuted, fontSize: FONT_SIZE.sm },

    // Analysis
    analysisCard: { borderLeftWidth: 3, borderLeftColor: COLORS.primary },
    analysisText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, lineHeight: 24 },
    analysisHeading: { fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary, fontSize: FONT_SIZE.md },
    analysisWarning: { color: COLORS.error, fontWeight: FONT_WEIGHT.semibold },
    analysisParagraphGap: { marginTop: SPACING.sm },

    // Disclaimer
    disclaimer: {
        flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm,
        backgroundColor: COLORS.warningLight, marginBottom: SPACING.lg,
    },
    disclaimerText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.warning, lineHeight: 20 },

    // Actions
    actions: { gap: SPACING.sm },
    actionBtn: {},
});
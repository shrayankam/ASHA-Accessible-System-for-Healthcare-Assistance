import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, Card, Badge, EmptyState } from '../../components/UIComponents';
import { healthService } from '../../services/healthService';
import { useAuthStore, useHealthStore } from '../../store/store';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../../constants/theme';

const SEVERITY_COLORS = { Mild: COLORS.success, Moderate: COLORS.warning, Severe: COLORS.error };

export default function HealthHistory({ navigation }) {
    const { user } = useAuthStore();
    const { setCurrentReport, setAnalysisResult } = useHealthStore();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await healthService.getHealthReports(user.uid);
            setReports(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const openReport = (report) => {
        setCurrentReport(report);
        setAnalysisResult(report.analysisResult);
        navigation.navigate('HealthResults');
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openReport(item)} activeOpacity={0.85}>
            <Card style={styles.reportCard}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.reportDate}>
                            {item.createdAt?.toDate
                                ? item.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                : new Date(item.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Text>
                        <Text style={styles.reportSymptoms} numberOfLines={1}>
                            {item.symptoms?.join(', ')}
                        </Text>
                    </View>
                    <Badge label={item.severity} color={SEVERITY_COLORS[item.severity] || COLORS.textMuted} />
                </View>
                <View style={styles.cardFooter}>
                    <View style={styles.metaItem}>
                        <Icon name="clock-outline" size={14} color={COLORS.textMuted} />
                        <Text style={styles.metaText}>{item.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Icon name="heart-pulse" size={14} color={COLORS.textMuted} />
                        <Text style={styles.metaText}>{item.symptoms?.length} symptoms</Text>
                    </View>
                    <Icon name="chevron-right" size={18} color={COLORS.textMuted} />
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <>
            <Header title="Health History" subtitle="Your past reports" onBack={() => navigation.goBack()} />

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={reports}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <EmptyState
                            icon="clipboard-text-outline"
                            title="No Reports Yet"
                            message="Your health check history will appear here after your first analysis."
                        />
                    }
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    list: { padding: SPACING.lg, paddingBottom: SPACING.xxl, flexGrow: 1 },
    reportCard: { marginBottom: SPACING.md },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
    reportDate: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginBottom: 2 },
    reportSymptoms: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.textPrimary, maxWidth: 200 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
});
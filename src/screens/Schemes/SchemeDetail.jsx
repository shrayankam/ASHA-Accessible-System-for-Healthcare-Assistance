import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Badge, Button, Card, Header } from '../../components/UIComponents';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';

export default function SchemeDetail({ route, navigation }) {
    const { scheme } = route.params;

    const getWebsite = (name) => {

        const n = name.toLowerCase();

        if (n.includes("ayushman")) return "https://pmjay.gov.in";
        if (n.includes("biju swasthya")) return "https://bsky.odisha.gov.in";
        if (n.includes("nirman shramik")) return "https://sso.rajasthan.gov.in";
        if (n.includes("asangathit")) return "https://cglabour.nic.in";
        if (n.includes("karnataka")) return "https://karbwwb.karnataka.gov.in";
        if (n.includes("cancer suraksha")) return "https://socialsecuritymission.gov.in";
        if (n.includes("arunachal")) return "https://cmaay.com";

        return "https://www.myscheme.gov.in";
    };

    return (
        <>
            <Header title="Scheme Details" onBack={() => navigation.goBack()} />
            <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Hero */}
                <View style={[styles.hero, { backgroundColor: scheme.color }]}>
                    <Icon name={scheme.icon} size={48} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.heroName}>{scheme.name}</Text>
                    <Badge label={scheme.category} color="rgba(255,255,255,0.3)" />
                </View>

                {/* Key Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{scheme.coverage}</Text>
                        <Text style={styles.statLabel}>Coverage</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{scheme.beneficiaries}</Text>
                        <Text style={styles.statLabel}>For</Text>
                    </View>
                </View>

                {/* Description */}
                <Card style={styles.section}>
                    <Text style={styles.sectionTitle}>About This Scheme</Text>
                    <Text style={styles.sectionText}>{scheme.description}</Text>
                </Card>

                {/* Eligibility */}
                <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="account-check" size={20} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Eligibility</Text>
                    </View>
                    <Text style={styles.sectionText}>{scheme.eligibility}</Text>
                </Card>

                {/* Benefits */}
                <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="gift" size={20} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Key Benefits</Text>
                    </View>
                    {scheme.benefits.map((b, i) => (
                        <View key={i} style={styles.benefitRow}>
                            <Icon name="check-circle" size={18} color={COLORS.success} />
                            <Text style={styles.benefitText}>{b}</Text>
                        </View>
                    ))}
                </Card>

                {/* How to Apply */}
                <Card style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="file-document-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>How to Apply</Text>
                    </View>

                    {scheme.howToApply
                        ?.split("Step")
                        .filter(Boolean)
                        .map((step, index) => (

                            <View key={index} style={styles.stepRow}>

                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>

                                <Text style={styles.stepText}>
                                    {step.replace(/\d+:/, "").trim()}
                                </Text>

                            </View>

                        ))}

                </Card>

                {/* Ministry */}
                <View style={styles.ministry}>
                    <Icon name="domain" size={16} color={COLORS.textMuted} />
                    <Text style={styles.ministryText}>{scheme.ministry}</Text>
                </View>

                <Button
                    title="Visit Official Website"
                    variant="outline"
                    icon="open-in-new"
                    onPress={() => Linking.openURL(getWebsite(scheme.name))}
                    style={{ marginBottom: SPACING.xxl }}
                />
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { paddingBottom: SPACING.xxl },
    hero: { alignItems: 'center', padding: SPACING.xl, gap: SPACING.sm },
    heroName: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.white, textAlign: 'center' },
    statsRow: {
        flexDirection: 'row', backgroundColor: COLORS.white,
        padding: SPACING.lg, margin: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
    statLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },
    statDivider: { width: 1, backgroundColor: COLORS.borderLight },
    section: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm },
    sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
    sectionText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary, lineHeight: 24 },
    benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginTop: SPACING.sm },
    benefitText: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textSecondary, lineHeight: 22 },
    ministry: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
    ministryText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },






    stepCard: {
        backgroundColor: "#F8FAFF",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary
    },

    stepHeader: {
        marginBottom: 6
    },

    stepBadge: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.primary
    },




    stepRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10
    },

    stepNumber: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        marginTop: 3
    },

    stepNumberText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold"
    },

    stepText: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        color: COLORS.textSecondary,
        lineHeight: 22
    },


});
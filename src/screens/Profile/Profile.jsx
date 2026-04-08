import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header, Card, Button, Divider } from '../../components/UIComponents';
import { useAuthStore } from '../../store/store';
import { authService } from '../../services/authService';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, BORDER_RADIUS } from '../../constants/theme';

const INFO_ROWS = [
    { key: 'email', label: 'Email', icon: 'email-outline' },
    { key: 'phone', label: 'Phone', icon: 'phone-outline' },
    { key: 'age', label: 'Age', icon: 'calendar-outline' },
    { key: 'gender', label: 'Gender', icon: 'account-outline' },
    { key: 'state', label: 'State', icon: 'map-marker-outline' },
    { key: 'district', label: 'District', icon: 'city-variant-outline' },
];

export default function Profile({ navigation }) {
    const { user, userProfile, clearUser } = useAuthStore();

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await authService.signOut();
                        clearUser();
                    },
                },
            ]
        );
    };

    const initials = userProfile?.name
        ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Header
                title="My Profile"
                rightAction={
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.editBtn}>
                        <Icon name="pencil" size={20} color={COLORS.primary} />
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                }
            />

            {/* Avatar */}
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                {userProfile?.state && (
                    <View style={styles.locationRow}>
                        <Icon name="map-marker" size={14} color={COLORS.primary} />
                        <Text style={styles.locationText}>{userProfile.state}</Text>
                    </View>
                )}
            </View>

            {/* Info Card */}
            <Card style={styles.infoCard}>
                <Text style={styles.cardTitle}>Personal Information</Text>
                <Divider style={{ marginVertical: SPACING.sm }} />
                {INFO_ROWS.map((row, i) => {
                    const value = row.key === 'email' ? user?.email : userProfile?.[row.key];
                    return (
                        <View key={row.key}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoLeft}>
                                    <Icon name={row.icon} size={18} color={COLORS.primary} />
                                    <Text style={styles.infoLabel}>{row.label}</Text>
                                </View>
                                <Text style={styles.infoValue}>{value || '—'}</Text>
                            </View>
                            {i < INFO_ROWS.length - 1 && <Divider style={{ marginVertical: 2 }} />}
                        </View>
                    );
                })}
            </Card>

            {/* Health Stats */}
            <Card style={styles.statsCard}>
                <Text style={styles.cardTitle}>Account Summary</Text>
                <Divider style={{ marginVertical: SPACING.sm }} />
                <TouchableOpacity
                    style={styles.statsRow}
                    onPress={() => navigation.navigate('HealthHistory')}
                >
                    <View style={styles.statItem}>
                        <Icon name="heart-pulse" size={22} color={COLORS.error} />
                        <Text style={styles.statLabel}>Health Reports</Text>
                        <Text style={styles.statSub}>View History →</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="shield-check" size={22} color={COLORS.primary} />
                        <Text style={styles.statLabel}>Schemes</Text>
                        <Text style={styles.statSub}>6 Available</Text>
                    </View>
                </TouchableOpacity>
            </Card>

            {/* Sign Out */}
            <Button
                title="Sign Out"
                variant="danger"
                onPress={handleLogout}
                icon="logout"
                style={styles.logoutBtn}
            />

            <Text style={styles.version}>ASHA Healthcare v1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { paddingBottom: SPACING.xxl },
    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    editText: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: FONT_WEIGHT.medium },

    // Avatar
    avatarSection: { alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.white, marginBottom: SPACING.sm },
    avatar: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    avatarText: { fontSize: 32, fontWeight: FONT_WEIGHT.bold, color: COLORS.white },
    userName: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
    userEmail: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 4 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
    locationText: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: FONT_WEIGHT.medium },

    // Cards
    infoCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
    statsCard: { marginHorizontal: SPACING.lg, marginBottom: SPACING.md },
    cardTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
    infoLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
    infoLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, fontWeight: FONT_WEIGHT.medium },
    infoValue: { fontSize: FONT_SIZE.sm, color: COLORS.textPrimary, maxWidth: 180, textAlign: 'right' },
    statsRow: { flexDirection: 'row' },
    statItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: SPACING.sm },
    statLabel: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, color: COLORS.textPrimary },
    statSub: { fontSize: FONT_SIZE.xs, color: COLORS.textMuted },

    logoutBtn: { marginHorizontal: SPACING.lg, marginTop: SPACING.sm },
    version: { textAlign: 'center', fontSize: FONT_SIZE.xs, color: COLORS.textMuted, marginTop: SPACING.lg },
});
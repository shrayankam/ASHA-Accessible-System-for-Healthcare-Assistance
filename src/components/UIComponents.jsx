import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { SPACING, BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS } from '../constants/theme';

// ─── Button ───────────────────────────────────────────────────────────────────

export const Button = ({ title, onPress, variant = 'primary', loading, disabled, style, icon }) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isDanger = variant === 'danger';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.btn,
                isPrimary && styles.btnPrimary,
                isOutline && styles.btnOutline,
                isDanger && styles.btnDanger,
                (disabled || loading) && styles.btnDisabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary || isDanger ? COLORS.white : COLORS.primary} size="small" />
            ) : (
                <View style={styles.btnContent}>
                    {icon && <Icon name={icon} size={18} color={isPrimary || isDanger ? COLORS.white : COLORS.primary} style={{ marginRight: 6 }} />}
                    <Text style={[styles.btnText, isOutline && styles.btnTextOutline, isDanger && styles.btnTextDanger]}>
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

// ─── Input ────────────────────────────────────────────────────────────────────

export const Input = ({ label, error, icon, ...props }) => (
    <View style={styles.inputWrapper}>
        {label && <Text style={styles.inputLabel}>{label}</Text>}
        <View style={[styles.inputContainer, error && styles.inputContainerError]}>
            {icon && <Icon name={icon} size={20} color={COLORS.textMuted} style={styles.inputIcon} />}
            <TextInput
                style={[styles.input, icon && styles.inputWithIcon]}
                placeholderTextColor={COLORS.textMuted}
                {...props}
            />
        </View>
        {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
);

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Card = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
);

// ─── Header ───────────────────────────────────────────────────────────────────

export const Header = ({ title, subtitle, onBack, rightAction }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.header, { paddingTop: insets.top + SPACING.sm }]}>
            <View style={styles.headerLeft}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
                        <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                )}
                <View>
                    <Text style={styles.headerTitle}>{title}</Text>
                    {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightAction && <View>{rightAction}</View>}
        </View>
    );
};

// ─── Badge ────────────────────────────────────────────────────────────────────

export const Badge = ({ label, color = COLORS.primary }) => (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
        <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
);

// ─── Divider ──────────────────────────────────────────────────────────────────

export const Divider = ({ style }) => <View style={[styles.divider, style]} />;

// ─── EmptyState ───────────────────────────────────────────────────────────────

export const EmptyState = ({ icon = 'inbox', title, message, action }) => (
    <View style={styles.emptyState}>
        <Icon name={icon} size={64} color={COLORS.border} />
        <Text style={styles.emptyTitle}>{title}</Text>
        {message && <Text style={styles.emptyMessage}>{message}</Text>}
        {action}
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    // Button
    btn: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    btnPrimary: { backgroundColor: COLORS.primary },
    btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
    btnDanger: { backgroundColor: COLORS.error },
    btnDisabled: { opacity: 0.5 },
    btnContent: { flexDirection: 'row', alignItems: 'center' },
    btnText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, color: COLORS.white },
    btnTextOutline: { color: COLORS.primary },
    btnTextDanger: { color: COLORS.white },

    // Input
    inputWrapper: { marginBottom: SPACING.md },
    inputLabel: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium, color: COLORS.textSecondary, marginBottom: 6 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.white,
    },
    inputContainerError: { borderColor: COLORS.error },
    inputIcon: { paddingLeft: SPACING.md },
    input: {
        flex: 1,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        fontSize: FONT_SIZE.md,
        color: COLORS.textPrimary,
    },
    inputWithIcon: { paddingLeft: SPACING.sm },
    inputError: { fontSize: FONT_SIZE.xs, color: COLORS.error, marginTop: 4 },

    // Card
    card: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        ...SHADOWS.sm,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backBtn: { marginRight: SPACING.sm, padding: 4 },
    headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
    headerSubtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 2 },

    // Badge
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BORDER_RADIUS.round },
    badgeText: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold },

    // Divider
    divider: { height: 1, backgroundColor: COLORS.borderLight, marginVertical: SPACING.md },

    // EmptyState
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
    emptyTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.semibold, color: COLORS.textSecondary, marginTop: SPACING.md },
    emptyMessage: { fontSize: FONT_SIZE.md, color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 22 },
});
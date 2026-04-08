import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '../../components/UIComponents';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';
import { authService } from '../../services/authService';

export default function Login({ navigation }) {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
        if (!password) e.password = 'Password is required';
        else if (password.length < 6) e.password = 'Password must be at least 6 characters';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await authService.signIn(email.trim(), password);
            // Navigation handled by auth state in App.jsx
        } catch (err) {
            Alert.alert('Login Failed', err.message || 'Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={[styles.container, { paddingTop: insets.top + SPACING.xl }]}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoSection}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>🌿</Text>
                    </View>
                    <Text style={styles.appName}>ASHA</Text>
                    <Text style={styles.tagline}>Accessible System for Healthcare Assistance</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Text style={styles.formTitle}>Welcome Back</Text>
                    <Text style={styles.formSubtitle}>Sign in to continue</Text>

                    <Input
                        label="Email Address"
                        placeholder="you@gmail.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        icon="email-outline"
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        icon="lock-outline"
                        error={errors.password}
                    />

                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.showPasswordBtn}
                    >
                        <Text style={styles.showPasswordText}>
                            {showPassword ? 'Hide' : 'Show'} Password
                        </Text>
                    </TouchableOpacity>

                    <Button title="Sign In" onPress={handleLogin} loading={loading} style={styles.signInBtn} />

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.footerLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    logoSection: { alignItems: 'center', marginBottom: SPACING.xl },
    logoCircle: {
        width: 80, height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    logoText: { fontSize: 38 },
    appName: { fontSize: 32, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary },
    tagline: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, textAlign: 'center', marginTop: 4 },
    form: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    formTitle: { fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary, marginBottom: 4, textAlign: 'center' },
    formSubtitle: { fontSize: FONT_SIZE.md, color: COLORS.textMuted, marginBottom: SPACING.lg, textAlign: 'center' },
    showPasswordBtn: { alignSelf: 'flex-end', marginTop: -SPACING.sm, marginBottom: SPACING.md },
    showPasswordText: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: FONT_WEIGHT.medium },
    signInBtn: { marginTop: SPACING.sm },
    forgotBtn: { alignItems: 'center', marginTop: SPACING.md },
    forgotText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
    footerText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
    footerLink: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: FONT_WEIGHT.semibold },
});
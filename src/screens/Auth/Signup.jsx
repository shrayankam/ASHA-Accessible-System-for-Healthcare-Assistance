import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '../../components/UIComponents';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';
import { authService } from '../../services/authService';

const STATES = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal',
];

export default function Signup({ navigation }) {
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        age: '', gender: '', state: '', district: '', phone: '',
    });

    const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const validateStep1 = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!form.password) e.password = 'Password is required';
        else if (form.password.length < 6) e.password = 'Min 6 characters';
        if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep2 = () => {
        const e = {};
        if (!form.age.trim()) e.age = 'Age is required';
        if (!form.gender) e.gender = 'Please select a gender';
        if (!form.state) e.state = 'Please select a state';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (validateStep1()) setStep(2);
    };

    const handleSignup = async () => {
        if (!validateStep2()) return;
        setLoading(true);
        try {
            await authService.signUp(form.email.trim(), form.password, {
                name: form.name,
                age: form.age,
                gender: form.gender,
                state: form.state,
                district: form.district,
                phone: form.phone,
            });
        } catch (err) {
            Alert.alert('Sign Up Failed', err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={[styles.container, { paddingTop: insets.top + SPACING.lg }]}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(1)}>
                        <Text style={styles.back}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.stepText}>Step {step} of 2</Text>
                </View>

                {/* Step Indicator */}
                <View style={styles.stepBar}>
                    <View style={[styles.stepDot, styles.stepDotActive]} />
                    <View style={[styles.stepLine, step === 2 && styles.stepLineActive]} />
                    <View style={[styles.stepDot, step === 2 && styles.stepDotActive]} />
                </View>

                <View style={styles.form}>
                    {step === 1 ? (
                        <>
                            <Text style={styles.sectionTitle}>Account Details</Text>
                            <Input label="Full Name" placeholder="Your Name" value={form.name} onChangeText={v => update('name', v)} icon="account-outline" error={errors.name} />
                            <Input label="Email" placeholder="you@gmail.com" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" autoCapitalize="none" icon="email-outline" error={errors.email} />
                            <Input label="Password" placeholder="Min 6 characters" value={form.password} onChangeText={v => update('password', v)} secureTextEntry icon="lock-outline" error={errors.password} />
                            <Input label="Confirm Password" placeholder="Re-enter password" value={form.confirmPassword} onChangeText={v => update('confirmPassword', v)} secureTextEntry icon="lock-check-outline" error={errors.confirmPassword} />
                            <Button title="Next →" onPress={handleNext} style={{ marginTop: SPACING.sm }} />
                        </>
                    ) : (
                        <>
                            <Text style={styles.sectionTitle}>Personal Information</Text>
                            <Input label="Age" placeholder="25" value={form.age} onChangeText={v => update('age', v)} keyboardType="numeric" icon="calendar-outline" error={errors.age} />

                            <Text style={styles.inputLabel}>Gender</Text>
                            <View style={styles.genderRow}>
                                {['Male', 'Female', 'Other'].map(g => (
                                    <TouchableOpacity
                                        key={g}
                                        onPress={() => update('gender', g)}
                                        style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]}
                                    >
                                        <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {errors.gender && <Text style={styles.fieldError}>{errors.gender}</Text>}

                            <Input label="Phone Number (Optional)" placeholder="9876543210" value={form.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" icon="phone-outline" />
                            <Input label="State" placeholder="Select your state" value={form.state} onChangeText={v => update('state', v)} icon="map-marker-outline" error={errors.state} />
                            <Input label="District (Optional)" placeholder="Your district" value={form.district} onChangeText={v => update('district', v)} icon="city-variant-outline" />

                            <Button title="Create Account" onPress={handleSignup} loading={loading} style={{ marginTop: SPACING.sm }} />
                        </>
                    )}
                </View>

                {step === 1 && (
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: COLORS.white, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
    header: { marginBottom: SPACING.lg },
    back: { fontSize: FONT_SIZE.md, color: COLORS.primary, marginBottom: SPACING.sm },
    title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
    stepText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, marginTop: 4 },
    stepBar: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg },
    stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.border },
    stepDotActive: { backgroundColor: COLORS.primary },
    stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginHorizontal: SPACING.sm },
    stepLineActive: { backgroundColor: COLORS.primary },
    form: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.borderLight },
    sectionTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary, marginBottom: SPACING.lg, textAlign: 'center' },
    inputLabel: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium, color: COLORS.textSecondary, marginBottom: 6 },
    genderRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
    genderBtn: { flex: 1, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
    genderBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
    genderText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
    genderTextActive: { color: COLORS.primary, fontWeight: FONT_WEIGHT.semibold },
    fieldError: { fontSize: FONT_SIZE.xs, color: COLORS.error, marginTop: -SPACING.sm, marginBottom: SPACING.sm },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
    footerText: { fontSize: FONT_SIZE.md, color: COLORS.textSecondary },
    footerLink: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: FONT_WEIGHT.semibold },
});
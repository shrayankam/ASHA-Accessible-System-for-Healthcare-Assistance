import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Header, Input, Button } from '../../components/UIComponents';
import { useAuthStore } from '../../store/store';
import { authService } from '../../services/authService';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/theme';

export default function EditProfile({ navigation }) {
    const { user, userProfile, setUserProfile } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: userProfile?.name || '',
        age: userProfile?.age || '',
        gender: userProfile?.gender || '',
        phone: userProfile?.phone || '',
        state: userProfile?.state || '',
        district: userProfile?.district || '',
    });

    const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSave = async () => {
        if (!form.name.trim()) {
            Alert.alert('Error', 'Name is required.');
            return;
        }
        setLoading(true);
        try {
            await authService.updateUserProfile(user.uid, form);
            setUserProfile({ ...userProfile, ...form });
            Alert.alert('Success', 'Profile updated successfully!');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <Header title="Edit Profile" onBack={() => navigation.goBack()} />
            <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Input label="Full Name" value={form.name} onChangeText={v => update('name', v)} icon="account-outline" placeholder="Your full name" />
                <Input label="Age" value={form.age} onChangeText={v => update('age', v)} keyboardType="numeric" icon="calendar-outline" placeholder="Your age" />
                <Input label="Gender" value={form.gender} onChangeText={v => update('gender', v)} icon="account-outline" placeholder="Male / Female / Other" />
                <Input label="Phone Number" value={form.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" icon="phone-outline" placeholder="10-digit number" />
                <Input label="State" value={form.state} onChangeText={v => update('state', v)} icon="map-marker-outline" placeholder="Your state" />
                <Input label="District" value={form.district} onChangeText={v => update('district', v)} icon="city-variant-outline" placeholder="Your district" />
                <Button title="Save Changes" onPress={handleSave} loading={loading} icon="content-save" style={{ marginTop: SPACING.md }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
});
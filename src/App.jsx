import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { COLORS } from './constants/colors';
import { AppNavigator } from './navigation/AppNavigator';
import { authService } from './services/authService';
import { useAuthStore } from './store/store';

export default function App() {
    const { user, isLoading, setUser, setUserProfile } = useAuthStore();

    useEffect(() => {
        const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    const profile = await authService.getUserProfile(firebaseUser.uid);
                    setUserProfile(profile);
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
                <NavigationContainer>
                    <AppNavigator isAuthenticated={!!user} />
                </NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
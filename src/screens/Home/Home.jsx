import * as Location from "expo-location";
import React from 'react';
import {
    ActivityIndicator,
    Linking,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, UrlTile } from "react-native-maps";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS, SPACING } from '../../constants/theme';
import { useAuthStore } from '../../store/store';

const QUICK_ACTIONS = [
    { id: 'health', icon: 'heart-pulse', label: 'Check\nSymptoms', color: '#E53935', bg: '#FFEBEE', screen: 'Health' },
    { id: 'schemes', icon: 'shield-check', label: 'Govt\nSchemes', color: '#1E88E5', bg: '#E3F2FD', screen: 'Schemes' },
    { id: 'support', icon: 'help-circle', label: 'Get\nSupport', color: '#8E24AA', bg: '#F3E5F5', screen: 'Support' },
    { id: 'profile', icon: 'account-circle', label: 'My\nProfile', color: '#F57C00', bg: '#FFF3E0', screen: 'Profile' },
];

const HEALTH_TIPS = [
    { id: 1, icon: '💧', tip: 'Drink at least 8 glasses of water daily to stay hydrated.' },
    { id: 2, icon: '🥗', tip: 'Eat a balanced diet with fruits, vegetables, and whole grains.' },
    { id: 3, icon: '🚶', tip: 'Walk for at least 30 minutes every day to improve heart health.' },
    { id: 4, icon: '😴', tip: 'Get 7-9 hours of sleep each night for good mental health.' },
    { id: 5, icon: '🧼', tip: 'Wash hands frequently with soap to prevent infections.' },
];

export default function Home({ navigation }) {
    const insets = useSafeAreaInsets();
    const { userProfile } = useAuthStore();
    const [refreshing, setRefreshing] = React.useState(false);
    const [tipIndex] = React.useState(() => Math.floor(Math.random() * HEALTH_TIPS.length));
    const [location, setLocation] = React.useState(null);
    const [places, setPlaces] = React.useState([]);
    const [loadingMap, setLoadingMap] = React.useState(true);
    const mapRef = React.useRef(null);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };



    const fetchHealthcare = async (lat, lon) => {

        const endpoints = [
            "https://overpass-api.de/api/interpreter",
            "https://overpass.kumi.systems/api/interpreter"
        ];

        for (let endpoint of endpoints) {

            try {

                console.log("Trying API:", endpoint);

                const url = `${endpoint}?data=[out:json][timeout:25];node["amenity"="hospital"](around:5000,${lat},${lon});out;`;

                const res = await fetch(url);

                if (!res.ok) throw new Error("API failed");

                const data = await res.json();

                if (!data.elements || data.elements.length === 0) {
                    throw new Error("No hospitals");
                }

                const hospitals = data.elements.map((item) => ({
                    id: item.id,
                    name: item.tags?.name || "Hospital",
                    latitude: item.lat,
                    longitude: item.lon
                }));

                hospitals.sort((a, b) =>
                    getDistance(lat, lon, a.latitude, a.longitude) -
                    getDistance(lat, lon, b.latitude, b.longitude)
                );

                setPlaces(hospitals);
                setLoadingMap(false);

                return;

            } catch (err) {

                console.log("API failed:", endpoint);

            }

        }

        console.log("All APIs failed, using fallback");

        setPlaces([
            {
                id: 1,
                name: "AIIMS Raipur",
                latitude: 21.2587,
                longitude: 81.5796
            },
            {
                id: 2,
                name: "Ramkrishna Care Hospital",
                latitude: 21.2130,
                longitude: 81.6537
            },
            {
                id: 3,
                name: "Suyash Superspeciality Hospital",
                latitude: 21.2584,
                longitude: 81.6060
            }
        ]);

        setLoadingMap(false);
    };


    React.useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setLoadingMap(false);
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest
            });
            setLocation(loc.coords);

            fetchHealthcare(loc.coords.latitude, loc.coords.longitude);

        } catch (error) {
            console.log(error);
            setLoadingMap(false);
        }
    };
    const navigateToPlace = (lat, lon, name) => {

        const url = `geo:${lat},${lon}?q=${lat},${lon}(${name})`;

        Linking.openURL(url);

    };


    const getDistance = (lat1, lon1, lat2, lon2) => {

        const R = 6371; // Earth radius in km

        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };


    const focusHospital = (lat, lon) => {
        mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 500);
    };

    console.log("Location:", location);
    console.log("Hospitals:", places);
    console.log("Loading:", loadingMap);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: SPACING.xl }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
                <View>
                    <Text style={styles.greeting}>{greeting()},</Text>
                    <Text style={styles.userName}>{userProfile?.name || 'Friend'} 👋</Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.locationBadge}>
                        <Icon name="map-marker" size={14} color={COLORS.primary} />
                        <Text style={styles.locationText}>{userProfile?.state || 'India'}</Text>
                    </View>
                </View>
            </View>

            {/* Hero Banner */}
            <View style={styles.heroBanner}>
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>How are you feeling today?</Text>
                    <Text style={styles.heroSubtitle}>
                        Describe your symptoms and get instant health guidance powered by AI.
                    </Text>
                    <TouchableOpacity
                        style={styles.heroBtn}
                        onPress={() => navigation.navigate('Health')}
                        activeOpacity={0.85}
                    >
                        <Icon name="heart-pulse" size={18} color={COLORS.white} />
                        <Text style={styles.heroBtnText}>Check Symptoms</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.heroEmoji}>🩺</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    {QUICK_ACTIONS.map(action => (
                        <TouchableOpacity
                            key={action.id}
                            style={[styles.actionCard, { backgroundColor: action.bg }]}
                            onPress={() => navigation.navigate(action.screen)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.actionIconWrap, { backgroundColor: action.color + '25' }]}>
                                <Icon name={action.icon} size={28} color={action.color} />
                            </View>
                            <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Daily Health Tip */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Daily Health Tip</Text>
                <View style={styles.tipCard}>
                    <Text style={styles.tipEmoji}>{HEALTH_TIPS[tipIndex].icon}</Text>
                    <Text style={styles.tipText}>{HEALTH_TIPS[tipIndex].tip}</Text>
                </View>
            </View>

            {/* Featured Scheme */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Scheme</Text>
                <TouchableOpacity
                    style={styles.schemeCard}
                    onPress={() => navigation.navigate('Schemes')}
                    activeOpacity={0.85}
                >
                    <View style={styles.schemeLeft}>
                        <View style={styles.schemeBadge}>
                            <Text style={styles.schemeBadgeText}>GOV</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.schemeName}>Ayushman Bharat</Text>
                            <Text style={styles.schemeDesc}>
                                ₹5 lakh health coverage per family per year for secondary & tertiary care.
                            </Text>
                        </View>
                    </View>
                    <Icon name="chevron-right" size={22} color={COLORS.primary} />
                </TouchableOpacity>
            </View>


            {/* Locate Nearest Healthcare Center */}

            <View style={styles.section}>

                <Text style={styles.sectionTitle}>
                    Locate Nearest Healthcare Center
                </Text>

                {loadingMap && (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                )}

                {location && !loadingMap && (

                    <View style={styles.mapContainer}>

                        <MapView
                            ref={mapRef}
                            style={styles.map}
                            initialRegion={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02
                            }}
                        >

                            <UrlTile
                                urlTemplate="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                                maximumZ={19}
                            />

                            {/* user marker */}
                            <Marker
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude
                                }}
                                title="Your Location"
                                pinColor="blue"
                            />

                            {/* hospital markers */}
                            {places.slice(0, 10).map((item) => (
                                <Marker
                                    key={item.id}
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude
                                    }}
                                    title={item.name}
                                    pinColor="red"
                                />
                            ))}

                        </MapView>

                        <Text style={styles.nearbyTitle}>
                            Nearby Hospitals
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >

                            {places.slice(0, 10).map((item) => {

                                const distance = getDistance(
                                    location.latitude,
                                    location.longitude,
                                    item.latitude,
                                    item.longitude
                                )

                                return (

                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.hospitalCardHorizontal}
                                        onPress={() => focusHospital(item.latitude, item.longitude)}
                                    >

                                        <Icon
                                            name="hospital-building"
                                            size={22}
                                            color={COLORS.primary}
                                        />

                                        <Text style={styles.hospitalNameHorizontal}>
                                            {item.name}
                                        </Text>

                                        <Text style={styles.hospitalDistanceHorizontal}>
                                            📍 {distance.toFixed(2)} km away
                                        </Text>

                                        <TouchableOpacity
                                            style={styles.navigateBtn}
                                            onPress={() => navigateToPlace(item.latitude, item.longitude, item.name)}
                                        >
                                            <Text style={styles.navigateText}>
                                                Navigate
                                            </Text>
                                        </TouchableOpacity>

                                    </TouchableOpacity>

                                )

                            })}

                        </ScrollView>

                    </View>

                )}

            </View>

            {/* Emergency */}
            <View style={[styles.section, { marginBottom: 0 }]}>
                <View style={styles.emergencyCard}>
                    <Icon name="phone" size={28} color={COLORS.error} />
                    <View style={{ flex: 1, marginLeft: SPACING.md }}>
                        <Text style={styles.emergencyTitle}>Emergency Helplines</Text>
                        <Text style={styles.emergencyNumbers}>
                            🚑 Ambulance: 108  •  🏥 Health: 104  •  🆘 All: 112
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },

    // Header
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
        paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
        backgroundColor: COLORS.white,
    },
    greeting: { fontSize: FONT_SIZE.md, color: COLORS.textMuted },
    userName: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
    headerRight: { alignItems: 'flex-end' },
    locationBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: BORDER_RADIUS.round,
    },
    locationText: { fontSize: FONT_SIZE.xs, color: COLORS.primaryDark, fontWeight: FONT_WEIGHT.medium },

    // Hero
    heroBanner: {
        margin: SPACING.lg, borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.primary, padding: SPACING.lg,
        flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
        ...SHADOWS.md,
    },
    heroContent: { flex: 1 },
    heroTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, color: COLORS.white, marginBottom: 6 },
    heroSubtitle: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.85)', lineHeight: 20, marginBottom: SPACING.md },
    heroBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingVertical: 8, paddingHorizontal: 14,
        borderRadius: BORDER_RADIUS.round, alignSelf: 'flex-start',
    },
    heroBtnText: { color: COLORS.white, fontWeight: FONT_WEIGHT.semibold, fontSize: FONT_SIZE.sm },
    heroEmoji: { fontSize: 56, marginLeft: SPACING.md },

    // Sections
    section: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
    sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary, marginBottom: SPACING.md },

    // Actions
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    actionCard: {
        width: '47%', borderRadius: BORDER_RADIUS.md, padding: SPACING.md,
        alignItems: 'center', ...SHADOWS.sm,
    },
    actionIconWrap: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
    actionLabel: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, textAlign: 'center', lineHeight: 18 },

    // Tip
    tipCard: {
        backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md, flexDirection: 'row', alignItems: 'center',
        gap: SPACING.md, ...SHADOWS.sm,
    },
    tipEmoji: { fontSize: 36 },
    tipText: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.textSecondary, lineHeight: 22 },

    // Scheme
    schemeCard: {
        backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md, flexDirection: 'row', alignItems: 'center',
        ...SHADOWS.sm,
    },
    schemeLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    schemeBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    schemeBadgeText: { fontSize: 10, fontWeight: FONT_WEIGHT.bold, color: COLORS.primaryDark },
    schemeName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary, marginBottom: 2 },
    schemeDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, lineHeight: 18 },

    map: {
        height: 300,
        borderRadius: 12,
        overflow: "hidden",
        marginTop: 10
    },

    hospitalCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        ...SHADOWS.sm
    },

    hospitalName: {
        fontSize: 15,
        fontWeight: "600"
    },

    hospitalDistance: {
        fontSize: 13,
        color: "#777"
    },

    navigateBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center"
    },

    navigateText: {
        color: "#fff",
        fontWeight: "600"
    },
    mapContainer: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        ...SHADOWS.md
    },

    nearbyTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 10
    },

    hospitalCardHorizontal: {
        width: 220,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 14,
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#eee"
    },

    hospitalNameHorizontal: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 6
    },

    hospitalDistanceHorizontal: {
        fontSize: 12,
        color: "#777",
        marginVertical: 8
    },

    // Emergency
    emergencyCard: {
        backgroundColor: COLORS.errorLight, borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md, flexDirection: 'row', alignItems: 'center',
        borderLeftWidth: 4, borderLeftColor: COLORS.error,
    },
    emergencyTitle: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.error },
    emergencyNumbers: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2, lineHeight: 20 },
});
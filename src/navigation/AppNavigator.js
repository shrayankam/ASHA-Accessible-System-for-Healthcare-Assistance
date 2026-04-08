import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants/colors';

// Auth Screens
import Login from '../screens/Auth/Login';
import Signup from '../screens/Auth/Signup';

// Main Screens
import HealthHistory from '../screens/Health/HealthHistory';
import HealthReportForm from '../screens/Health/HealthReportForm';
import HealthResults from '../screens/Health/HealthResults';
import Home from '../screens/Home/Home';
import EditProfile from '../screens/Profile/EditProfile';
import Profile from '../screens/Profile/Profile';
import HealthcareSchemes from '../screens/Schemes/HealthcareSchemes';
import SchemeDetail from '../screens/Schemes/SchemeDetail';
import Support from '../screens/Support/Support';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
    Home: 'home',
    Health: 'heart-pulse',
    Schemes: 'shield-check',
    Support: 'help-circle',
    Profile: 'account-circle',
};

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                // tabBarIcon: ({ focused, color, size }) => (
                //     <Icon
                //         name={focused ? TAB_ICONS[route.name] : TAB_ICONS[route.name] + '-outline'}
                //         size={size}
                //         color={color}
                //     />
                // ),
                tabBarIcon: ({ color, size }) => (
                    <Icon
                        name={TAB_ICONS[route.name]}
                        size={size}
                        color={color}
                    />
                ),
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textMuted,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Health" component={HealthStack} />
            <Tab.Screen name="Schemes" component={SchemesStack} />
            <Tab.Screen name="Support" component={Support} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}

function HealthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HealthForm" component={HealthReportForm} />
            <Stack.Screen name="HealthResults" component={HealthResults} />
            <Stack.Screen name="HealthHistory" component={HealthHistory} />
        </Stack.Navigator>
    );
}

function SchemesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SchemesList" component={HealthcareSchemes} />
            <Stack.Screen name="SchemeDetail" component={SchemeDetail} />
        </Stack.Navigator>
    );
}

function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileMain" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
        </Stack.Navigator>
    );
}

export function AppNavigator({ isAuthenticated }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                <Stack.Screen name="Main" component={MainTabs} />
            ) : (
                <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Signup" component={Signup} />
                </>
            )}
        </Stack.Navigator>
    );
}


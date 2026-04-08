// import { useState } from 'react';
// import {
//     FlatList,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Badge, Card, Header } from '../../components/UIComponents';
// import { COLORS } from '../../constants/colors';
// import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';
// import schemes from "../../data/schemes.json";

// const SCHEMES = schemes.map((s, index) => ({
//     id: index.toString(),
//     name: s.scheme_name,
//     description: s.details,
//     benefits: s.benefits ? [s.benefits] : [],
//     eligibility: s.eligibility,
//     howToApply: s.application,
//     ministry: s.level,
//     level: s.level,
//     category: "Health",
//     coverage: "Varies",
//     beneficiaries: "Citizens",
//     icon: "hospital-box",
//     color: "#1565C0"
// }));

// const centralSchemes = SCHEMES.filter(s => s.level === "Central");
// const stateSchemes = SCHEMES.filter(s => s.level === "State");

// const CATEGORIES = [
//     "All",
//     "Central",
//     "State"
// ];

// export default function HealthcareSchemes({ navigation }) {
//     const [search, setSearch] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('All');

//     // const filtered = SCHEMES.filter(s => {
//     //     const matchesSearch =
//     //         s.name.toLowerCase().includes(search.toLowerCase()) ||
//     //         s.description.toLowerCase().includes(search.toLowerCase());
//     //     const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
//     //     return matchesSearch && matchesCategory;
//     // });

//     const filtered = SCHEMES.filter((s) => {

//         let categoryMatch = false;

//         if (selectedCategory === "All") {
//             categoryMatch = true;
//         } else if (selectedCategory === "Central") {
//             categoryMatch = s.level === "Central";
//         } else if (selectedCategory === "State") {
//             categoryMatch = s.level === "State";
//         }

//         if (!search || search.trim() === "") {
//             return categoryMatch;
//         }

//         const term = search.toLowerCase();

//         const searchMatch =
//             s.name?.toLowerCase().includes(term) ||
//             s.description?.toLowerCase().includes(term);

//         return categoryMatch && searchMatch;
//     });


//     const renderScheme = ({ item }) => (
//         <TouchableOpacity
//             onPress={() => navigation.navigate('SchemeDetail', { scheme: item })}
//             activeOpacity={0.85}
//         >
//             <Card style={styles.schemeCard}>
//                 <View style={styles.cardHeader}>
//                     <View style={[styles.iconWrap, { backgroundColor: item.color + '18' }]}>
//                         <Icon name={item.icon} size={28} color={item.color} />
//                     </View>
//                     <View style={styles.cardInfo}>
//                         <Text style={styles.schemeName}>{item.name}</Text>
//                         <Badge label={item.category} color={item.color} />
//                     </View>
//                 </View>
//                 <Text style={styles.schemeDesc} numberOfLines={2}>{item.description}</Text>
//                 <View style={styles.cardFooter}>
//                     <View style={styles.metaItem}>
//                         <Icon name="currency-inr" size={14} color={COLORS.textMuted} />
//                         <Text style={styles.metaText}>{item.coverage}</Text>
//                     </View>
//                     <View style={styles.metaItem}>
//                         <Icon name="account-group" size={14} color={COLORS.textMuted} />
//                         <Text style={styles.metaText}>{item.beneficiaries}</Text>
//                     </View>
//                     <Icon name="chevron-right" size={18} color={COLORS.textMuted} />
//                 </View>
//             </Card>
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>

//             <View style={{ backgroundColor: COLORS.white }}>
//                 <Header
//                     title="Government Healthcare Schemes"
//                     subtitle={`${filtered.length} schemes available`}
//                 />
//             </View>

//             {/* Search Bar */}
//             <View style={styles.searchWrap}>
//                 <View style={styles.searchBar}>
//                     <Icon name="magnify" size={20} color={COLORS.textMuted} />

//                     <TextInput
//                         placeholder="Search schemes..."
//                         value={search}
//                         onChangeText={setSearch}
//                         style={styles.searchInput}
//                         placeholderTextColor="#888"
//                     />
//                 </View>
//             </View>
//             {/* Category Filter */}
//             <FlatList
//                 data={CATEGORIES}
//                 horizontal
//                 keyExtractor={(item) => item}
//                 showsHorizontalScrollIndicator={false}
//                 style={{ flexGrow: 0 }}
//                 contentContainerStyle={{
//                     paddingHorizontal: 12,
//                     paddingVertical: 8
//                 }}
//                 renderItem={({ item, index }) => (
//                     <TouchableOpacity
//                         onPress={() => setSelectedCategory(item)}
//                         style={[
//                             styles.categoryChip,
//                             index === 0 && { marginLeft: 4 },
//                             selectedCategory === item && styles.categoryChipActive
//                         ]}
//                     >
//                         <Text
//                             allowFontScaling={false}
//                             style={[
//                                 styles.categoryText,
//                                 selectedCategory === item && styles.categoryTextActive
//                             ]}
//                         >
//                             {String(item)}
//                         </Text>
//                     </TouchableOpacity>
//                 )}
//             />


//             {/* Scheme List */}
//             <FlatList
//                 data={filtered}
//                 keyExtractor={item => item.id}
//                 renderItem={renderScheme}
//                 contentContainerStyle={styles.list}
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: COLORS.background },
//     searchWrap: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.white },
//     searchBar: {
//         flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
//         backgroundColor: COLORS.background,
//         borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md,
//         borderWidth: 1, borderColor: COLORS.border,
//     },
//     searchInput: { flex: 1, paddingVertical: SPACING.sm, fontSize: FONT_SIZE.md, color: COLORS.textPrimary },


//     list: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
//     schemeCard: { marginBottom: SPACING.md },
//     cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.sm },
//     iconWrap: { width: 52, height: 52, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
//     cardInfo: { flex: 1, gap: 4 },
//     schemeName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, color: COLORS.textPrimary },
//     schemeDesc: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted, lineHeight: 20, marginBottom: SPACING.sm },
//     cardFooter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
//     metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//     metaText: { fontSize: FONT_SIZE.sm, color: COLORS.textMuted },
//     categories: {
//         paddingVertical: SPACING.sm
//     },

//     categoryChip: {
//         paddingHorizontal: 18,
//         paddingVertical: 10,
//         borderRadius: 25,
//         backgroundColor: "#F8F9FB",
//         borderWidth: 1,
//         borderColor: "#E3E6ED",
//         marginRight: 10,
//     },
//     categoryText: {
//         fontSize: FONT_SIZE.sm,
//         color: COLORS.textSecondary,
//         fontWeight: FONT_WEIGHT.medium
//     },

//     categoryChipActive: {
//         backgroundColor: COLORS.primaryLight,
//         borderColor: COLORS.primary
//     },

//     categoryText: {
//         fontSize: FONT_SIZE.sm,
//         color: COLORS.textSecondary,
//         fontWeight: FONT_WEIGHT.medium
//     },

//     categoryTextActive: {
//         color: COLORS.primaryDark,
//         fontWeight: FONT_WEIGHT.semibold
//     },
// });

import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { Badge, Card, Header } from "../../components/UIComponents";
import { COLORS } from "../../constants/colors";
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from "../../constants/theme";

import schemes from "../../data/schemes.json";

/* ---------- DATA MAPPING ---------- */

const SCHEMES = schemes.map((s, index) => ({
    id: index.toString(),
    name: s.scheme_name,
    description: s.details,
    benefits: s.benefits ? [s.benefits] : [],
    eligibility: s.eligibility,
    howToApply: s.application,
    ministry: s.level,
    level: s.level,
    category: "Health",
    coverage: "Varies",
    beneficiaries: "Citizens",
    icon: "hospital-box",
    color: s.level === "Central" ? "#388E3C" : "#66BB6A"
}));

const CATEGORIES = ["All", "Central", "State"];

export default function HealthcareSchemes({ navigation }) {

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    /* ---------- FILTER ---------- */

    const filtered = SCHEMES.filter((s) => {

        let categoryMatch = false;

        if (selectedCategory === "All") {
            categoryMatch = true;
        } else if (selectedCategory === "Central") {
            categoryMatch = s.level === "Central";
        } else if (selectedCategory === "State") {
            categoryMatch = s.level === "State";
        }

        if (!search.trim()) return categoryMatch;

        const term = search.toLowerCase();

        const searchMatch =
            s.name.toLowerCase().includes(term) ||
            s.description.toLowerCase().includes(term);

        return categoryMatch && searchMatch;

    });

    /* ---------- CARD ---------- */

    const renderScheme = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("SchemeDetail", { scheme: item })}
            activeOpacity={0.85}
        >
            <Card style={styles.schemeCard}>

                <View style={styles.cardHeader}>

                    <View style={[styles.iconWrap, { backgroundColor: item.color + "18" }]}>
                        <Icon name={item.icon} size={26} color={item.color} />
                    </View>

                    <View style={styles.cardInfo}>
                        <Text style={styles.schemeName}>{item.name}</Text>
                        <Badge label={item.level} color={item.color} />
                    </View>

                </View>

                <Text style={styles.schemeDesc} numberOfLines={2}>
                    {item.description}
                </Text>

            </Card>
        </TouchableOpacity>
    );

    return (

        <View style={styles.container}>

            <Header
                title="Government Healthcare Schemes"
                subtitle={`${filtered.length} schemes available`}
            />

            {/* SEARCH BAR */}

            <View style={styles.searchWrap}>
                <View style={styles.searchBar}>

                    <Icon name="magnify" size={20} color={COLORS.textMuted} />

                    <TextInput
                        placeholder="Search schemes..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                    />

                </View>
            </View>

            {/* CATEGORY FILTER */}

            {/* <FlatList
                data={CATEGORIES}
                horizontal
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12 }}
                renderItem={({ item }) => (

                    <TouchableOpacity
                        onPress={() => setSelectedCategory(item)}
                        style={[
                            styles.categoryChip,
                            selectedCategory === item && styles.categoryChipActive
                        ]}
                    >

                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === item && styles.categoryTextActive
                            ]}
                        >
                            {item}
                        </Text>

                    </TouchableOpacity>

                )}
            /> */}

            <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 10 }}>

                {CATEGORIES.map((item) => (

                    <TouchableOpacity
                        key={item}
                        onPress={() => setSelectedCategory(item)}
                        style={[
                            styles.categoryChip,
                            selectedCategory === item && styles.categoryChipActive
                        ]}
                    >

                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === item && styles.categoryTextActive
                            ]}
                        >
                            {item}
                        </Text>

                    </TouchableOpacity>

                ))}

            </View>

            {/* SCHEME LIST */}

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={renderScheme}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

        </View>
    );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },

    searchWrap: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md
    },

    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        backgroundColor: "#F5F5F5",
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md
    },

    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: FONT_SIZE.md
    },

    list: {
        padding: SPACING.lg
    },

    schemeCard: {
        marginBottom: SPACING.md
    },

    cardHeader: {
        flexDirection: "row",
        gap: SPACING.md
    },

    iconWrap: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.md,
        alignItems: "center",
        justifyContent: "center"
    },

    cardInfo: {
        flex: 1
    },

    schemeName: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.bold
    },

    schemeDesc: {
        fontSize: FONT_SIZE.sm,
        marginTop: 6
    },

    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        marginRight: 10,
        marginTop: 10
    },

    categoryChipActive: {
        backgroundColor: COLORS.primaryLight
    },

    categoryText: {
        fontSize: FONT_SIZE.sm,
        color: "#444"
    },

    categoryTextActive: {
        color: COLORS.primaryDark,
        fontWeight: "600"
    }

});
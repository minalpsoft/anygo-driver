import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import AppButton from '../components/AppButton';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';
import { useEffect, useState } from 'react';
import { getDriverProfileApi, updateDriverProfileApi, logoutDriverApi } from '../api/authService';


export default function Profile({ navigation }) {

    const [profile, setProfile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getDriverProfileApi();
            setProfile(res);
        } catch (e) {
            console.log('Profile load error', e);
        }
    };

    // edit / update
    const handleUpdate = async () => {
        try {
            console.log('Updating profile...', firstName, lastName);

            await updateDriverProfileApi({
                firstName,
                lastName,
            });

            setShowEditModal(false);
            loadProfile(); // refresh UI
        } catch (e) {
            console.log('Update error 👉', e);
        }
    };


    // logout
    const handleLogout = async () => {
        try {
            await logoutDriverApi();
            navigation.replace('Login');
        } catch (e) {
            console.log('Logout error', e);
        }
    };

    if (!profile) {
        return (
            <View style={styles.container}>
                <AppHeader title="Profile" navigation={navigation} />
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    Loading profile...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader title="Profile" navigation={navigation} />


            <ScrollView showsVerticalScrollIndicator={false}>

                {/* TODAY EARNINGS */}
                <TodayCard
                    title={profile?.header?.name || 'Driver'}
                    value={profile?.header?.vehicleName || 'Vehicle not assigned'}
                    centerTrips
                />

                {/* My Profile */}
                <Card>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>My Profile</Text>
                        <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={() => {
                                setFirstName(profile.profile.firstName);
                                setLastName(profile.profile.lastName);
                                setShowEditModal(true);
                            }}
                        >
                            <Text style={styles.link}>Edit</Text>
                        </TouchableOpacity>


                    </View>

                    <Divider />

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>First Name</Text>

                        {isEdit ? (
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                style={styles.input}
                            />
                        ) : (
                            <Text style={styles.amount1}>{profile?.profile?.firstName}</Text>
                        )}
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>Last Name</Text>

                        {isEdit ? (
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                style={styles.input}
                            />
                        ) : (
                            <Text style={styles.amount1}>{profile?.profile?.lastName}</Text>
                        )}
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.amount1}>Mobile Number</Text>
                        <Text style={styles.amount1}>
                            +91 {profile?.profile?.mobile}
                        </Text>
                    </View>

                </Card>


                {/* LOGOUT BUTTON OUTSIDE CARD */}
                <View style={styles.buttonWrapper}>
                    <AppButton title="Logout" onPress={handleLogout} />
                </View>

            </ScrollView>

            {/* BOTTOM TABS */}
            <BottomTabs />


            {showEditModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Profile</Text>
                            <TouchableOpacity onPress={() => setShowEditModal(false)}>
                                <Ionicons name="close" size={26} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            style={styles.modalInput}
                        />

                        <TextInput
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            style={styles.modalInput}
                        />

                        <TouchableOpacity
                            onPress={handleUpdate}
                            style={styles.saveBtn}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )}


        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    },

    link: {
        color: COLORS.primary,
        fontWeight: '600',
    },

    amount1: {
        color: '#000',
        marginVertical: 3,
        textAlign: 'start',
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    acceptBtn: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 20,
    },
    buttonWrapper: {
        marginTop: 12,
        paddingHorizontal: 16,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: 4,
        minWidth: 120,
        textAlign: 'right',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },

    modalInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },

    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    cancelBtn: {
        padding: 10,
    },

    cancelText: {
        color: COLORS.gray,
        fontSize: 16,
    },

    saveBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    saveText: {
        color: '#fff',
        fontSize: 16,
    },


});

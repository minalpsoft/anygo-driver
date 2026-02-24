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
import { updateDriverDocumentsApi, getDriverProfileApi, updateDriverProfileApi, logoutDriverApi } from '../api/authService';
import * as DocumentPicker from 'expo-document-picker';
import { Linking } from 'react-native';
const FILE_BASE_URL = process.env.EXPO_PUBLIC_FILE_BASE_URL;

export default function Profile({ navigation }) {

    const [profile, setProfile] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [docModalVisible, setDocModalVisible] = useState(false);
    const [selectedDocKey, setSelectedDocKey] = useState(null);
    const [selectedDocLabel, setSelectedDocLabel] = useState('');

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

    const pickDocument = async (docType) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['image/*', 'application/pdf'],
        });

        if (result.canceled) return;

        const file = result.assets[0];

        const formData = new FormData();
        formData.append(docType, {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
        });

        await updateDriverDocumentsApi(formData);
        loadProfile(); // refresh profile
    };

    const renderDocRow = (label, key) => {
        const uploaded = profile?.documents?.[key];

        return (
            <View style={styles.docRow}>
                <Text style={styles.amount1}>{label}</Text>

                <TouchableOpacity
                    style={[
                        styles.docStatusBtn,
                        { backgroundColor: uploaded ? '#E8F5E9' : '#FDECEA' }
                    ]}
                    onPress={() => openDocModal(label, key)}
                >
                    <Ionicons
                        name={uploaded ? 'checkmark-circle' : 'cloud-upload'}
                        size={18}
                        color={uploaded ? 'green' : 'red'}
                    />
                    <Text style={{ marginLeft: 6 }}>
                        {uploaded ? 'View / Update' : 'Upload'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };


    const openDocModal = (label, key) => {
        setSelectedDocKey(key);
        setSelectedDocLabel(label);
        setDocModalVisible(true);
    };

   const pickAndUpdateDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
    });

    if (result.canceled) return;

    const file = result.assets[0];

    const formData = new FormData();
    formData.append(selectedDocKey, {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    });

    console.log('Updating doc 👉', selectedDocKey, file.name);

    const res = await updateDriverDocumentsApi(formData);
    console.log('Update response 👉', res);

    setDocModalVisible(false);
    loadProfile();

  } catch (e) {
    console.log('❌ Document update failed', e);
  }
};


    const getFileUrl = (path) => {
        if (!path) return null;
        return `${FILE_BASE_URL}/${path}`;
    };


    const isImage = (fileName) => {
        return /\.(jpg|jpeg|png)$/i.test(fileName);
    };

    console.log(getFileUrl(profile?.documents?.aadhaar));

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

                {/* Documents */}
                <Card>
                    <Text style={styles.cardTitle}>Driver Documents</Text>
                    <Divider />

                    {renderDocRow('Aadhaar', 'aadhaar')}
                    {renderDocRow('PAN Card', 'panCard')}
                    {renderDocRow('License Front', 'licenseFront')}
                    {renderDocRow('License Back', 'licenseBack')}
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

            {docModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedDocLabel}</Text>
                            <TouchableOpacity onPress={() => setDocModalVisible(false)}>
                                <Ionicons name="close" size={26} />
                            </TouchableOpacity>
                        </View>

                        {/* Existing document info */}
                        {profile?.documents?.[selectedDocKey] ? (
                            <View style={styles.docPreview}>

                                {isImage(profile.documents[selectedDocKey]) ? (
                                    <Image
                                        source={{ uri: getFileUrl(profile.documents[selectedDocKey]) }}
                                        style={styles.docImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <TouchableOpacity
                                        style={styles.pdfBox}
                                        onPress={() =>
                                            Linking.openURL(getFileUrl(profile.documents[selectedDocKey]))
                                        }
                                    >
                                        <Ionicons name="document-text" size={40} color={COLORS.primary} />
                                        <Text style={{ marginTop: 8 }}>Open PDF</Text>
                                    </TouchableOpacity>
                                )}

                            </View>
                        ) : (
                            <Text style={{ textAlign: 'center', marginVertical: 20 }}>
                                No document uploaded yet
                            </Text>
                        )}


                        {/* Update button */}
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={pickAndUpdateDocument}
                        >
                            <Text style={styles.saveText}>
                                {profile?.documents?.[selectedDocKey] ? 'Replace Document' : 'Upload Document'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )}



        </View>
    );
}



const styles = StyleSheet.create({
    docRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    docImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },

    pdfBox: {
        alignItems: 'center',
        padding: 20,
    },


    docStatusBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    docPreview: {
        alignItems: 'center',
        marginVertical: 20,
    },

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

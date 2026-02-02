import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import BottomTabs from '../components/BottomTabs';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import TodayCard from '../components/TodayCard';
import Divider from '../components/Divider';
import { getDriverEarningsApi, requestWithdrawalApi, getWithdrawalHistoryApi } from '../api/authService';
import { COLORS } from '../theme/colors';
import { Modal } from 'react-native';
import { addBankDetailsApi } from '../api/authService';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDriverDashboardApi } from '../api/authService';
import { getDriverBankDetailsApi } from '../api/authService';

export default function Withdrawal({ navigation }) {

    const [earnings, setEarnings] = useState(null);
    const [amount, setAmount] = useState('');
    const [history, setHistory] = useState([]);
    const [hasBankDetails, setHasBankDetails] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);

    const [bankForm, setBankForm] = useState({
        bankName: '',
        accountHolderName: '',
        bankAccountNumber: '',
        ifscCode: '',
    });

    // const loadData = async () => {
    //     try {
    //         const [earnRes, historyRes] = await Promise.all([
    //             getDriverEarningsApi(),
    //             getWithdrawalHistoryApi(),
    //             getDriverDashboardApi(),
    //         ]);
    //         // console.log('EARNINGS RESPONSE 👉', JSON.stringify(earnRes.data, null, 2));

    //         setEarnings(earnRes.data);
    //         setHistory(historyRes.data || []);

    //         if (earnRes.data?.bankDetails) {
    //             setHasBankDetails(true);

    //             setBankForm({
    //                 bankName: earnRes.data.bankDetails.bankName || '',
    //                 accountHolderName: earnRes.data.bankDetails.accountHolderName || '',
    //                 bankAccountNumber: earnRes.data.bankDetails.bankAccountNumber || '',
    //                 ifscCode: earnRes.data.bankDetails.ifscCode || '',
    //             });
    //         } 

    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const loadData = async () => {
  try {
    const [
      earnRes,
      historyRes,
      bankRes
    ] = await Promise.all([
      getDriverEarningsApi(),
      getWithdrawalHistoryApi(),
      getDriverBankDetailsApi(),
    ]);

    setEarnings(earnRes.data);
    setHistory(historyRes.data || []);

    if (bankRes.hasBankDetails) {
      setHasBankDetails(true);
      setBankForm({
        bankName: bankRes.bankDetails.bankName || '',
        accountHolderName: bankRes.bankDetails.accountHolderName || '',
        bankAccountNumber: bankRes.bankDetails.bankAccountNumber || '',
        ifscCode: bankRes.bankDetails.ifscCode || '',
      });
    } else {
      setHasBankDetails(false);
    }

  } catch (err) {
    console.log('Load withdrawal data error', err);
  }
};


    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const submitWithdrawal = async () => {
        if (!bankForm.bankAccountNumber) {
            Alert.alert('Error', 'Please add bank details first');
            return;
        }

        if (!amount || Number(amount) <= 400) {
            Alert.alert('Error', 'Enter valid amount');
            return;
        }

        try {
            await requestWithdrawalApi(Number(amount));
            Alert.alert('Success', 'Withdrawal request submitted');
            setAmount('');
            loadData();
        } catch (err) {
            Alert.alert(
                'Error',
                err?.response?.data?.message || err.message
            );
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader title="Withdrawal" navigation={navigation} />

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* BALANCE */}
                <TodayCard
                    title="Wallet Balance"
                    amount={earnings?.balance || 0}
                    trips={earnings?.tripsCount || 0}
                    centerTrips
                />

                {/* WITHDRAW FORM */}
                <View style={styles.withdraw}>
                    <AppInput
                        placeholder="Enter withdrawal amount"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />


                    <View style={styles.bankWarning}>
                        <Text style={styles.helperText}>
                            {hasBankDetails
                                ? '✅ Bank details are already added'
                                : '⚠️ Bank details required before withdrawal'}
                        </Text>

                        <AppButton
                            title={hasBankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
                            onPress={() => setShowBankModal(true)}
                        />
                    </View>


                    <AppButton title="Submit" onPress={submitWithdrawal} />
                </View>

                {/* WITHDRAWAL HISTORY */}
                <Card>
                    <Text style={styles.cardTitle}>Withdrawal History</Text>
                    <Divider />

                    {history.length === 0 ? (
                        <Text style={{ textAlign: 'center', color: '#777' }}>
                            No withdrawal requests yet
                        </Text>
                    ) : (
                        history.slice(0, 5).map(w => (
                            <View key={w.id} style={styles.rowBetween}>
                                <Text>
                                    {new Date(w.requestedAt).toLocaleDateString()}
                                </Text>

                                <Text style={{
                                    color:
                                        w.status === 'PENDING' ? 'orange' :
                                            w.status === 'APPROVED' ? 'green' : 'red'
                                }}>
                                    ₹{w.amount} • {w.status}
                                </Text>

                            </View>
                        ))
                    )}
                </Card>

            </ScrollView>

            <BottomTabs />

            <Modal visible={showBankModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>

                        <Text style={styles.modalTitle}>Add Bank Details</Text>

                        <AppInput
                            placeholder="Bank Name"
                            value={bankForm.bankName}
                            onChangeText={v => setBankForm({ ...bankForm, bankName: v })}
                        />

                        <AppInput
                            placeholder="Account Holder Name"
                            value={bankForm.accountHolderName}
                            onChangeText={v => setBankForm({ ...bankForm, accountHolderName: v })}
                        />

                        <AppInput
                            placeholder="Account Number"
                            keyboardType="numeric"
                            value={bankForm.bankAccountNumber}
                            onChangeText={v => setBankForm({ ...bankForm, bankAccountNumber: v })}
                        />

                        <AppInput
                            placeholder="IFSC Code"
                            autoCapitalize="characters"
                            value={bankForm.ifscCode}
                            onChangeText={v => setBankForm({ ...bankForm, ifscCode: v })}
                        />

                        <AppButton
                            title="Save Bank Details"
                            onPress={async () => {
                                try {
                                    await addBankDetailsApi(bankForm);
                                    Alert.alert('Success', 'Bank details added');
                                    // await AsyncStorage.setItem(
                                    //     'bankDetails',
                                    //     JSON.stringify(bankForm)
                                    // );
                                    setHasBankDetails(true);
                                    setShowBankModal(false);
                                    loadData();
                                } catch (err) {
                                    Alert.alert(
                                        'Error',
                                        err?.response?.data?.message || err.message
                                    );
                                }
                            }}
                        />

                        <TouchableOpacity onPress={() => setShowBankModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </View>
    );
}




const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalCard: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },

    cancelText: {
        textAlign: 'center',
        marginTop: 12,
        color: COLORS.primary,
    },

    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },

    cardTitle: {
        fontWeight: 'bold',
        fontSize: 15,
    },

    subTitle: {
        fontSize: 12
    },

    acceptBtn: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 22,
        paddingVertical: 6,
        borderRadius: 20,
    },

    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    link: {
        color: COLORS.primary,
        fontWeight: '600',
    },

    linkSmall: {
        color: COLORS.primary,
        marginTop: 6,
        fontSize: 13,
        textAlign: 'right',
    },

    amount1: {
        color: '#000',
        marginVertical: 3,
        textAlign: 'start',
    },

    withdraw: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 14,
        // elevation: 2,
    },

    helperText: {
        fontSize: 13,
        color: '#888',
        marginBottom: 12,
        marginHorizontal: 5
    },

});

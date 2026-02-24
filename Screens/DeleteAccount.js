import { View, Text, Alert, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { deleteDriverAccountApi } from '../api/authService';

export default function DeleteAccount() {
    const navigation = useNavigation();

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'This action is permanent. Your account will be deleted forever. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: confirmDelete,
                },
            ],
        );
    };

    const confirmDelete = async () => {
        try {
            const res = await deleteDriverAccountApi();

            Alert.alert('Account Deleted', res.message);

            // 🔥 Clear storage
            await AsyncStorage.multiRemove([
                'driverToken',
                'otp_mobile',
                'token',
            ]);

            // 🔥 Reset navigation to Login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });


        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.warningText}>
                Deleting your account is permanent and cannot be undone.
            </Text>

            <AppButton
                title="Delete Account"
                onPress={handleDeleteAccount}
                style={styles.deleteBtn}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 50
    },
    warningText: {
        color: 'red',
        marginBottom: 20,
        fontSize: 14,
    },
    deleteBtn: {
        backgroundColor: '#ff3b30',
    },
});

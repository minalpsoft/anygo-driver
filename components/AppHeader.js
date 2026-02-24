// components/AppHeader.js
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

export default function AppHeader({ title, navigation }) {
    return (
        <View style={styles.header}>
            <Ionicons style={styles.headerTitleIcon} name="menu-outline" size={26} color="#FFFFFF" onPress={() => navigation.openDrawer()} />
            <Text style={styles.headerTitle}>{title}</Text>
            <Ionicons style={styles.headerTitleIcon} name="notifications-outline" size={24} color="#FFFFFF" />
        </View>
    );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 20,
    paddingVertical: 20,

    paddingTop: 40, // ✅ this replaces marginTop: 20
    backgroundColor: COLORS.primary,
    elevation: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
});



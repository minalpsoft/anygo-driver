// components/Card.js
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },

});

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function AppButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
button: {
  backgroundColor: '#FF1E1E',
  paddingVertical: 16,
  borderRadius: 30,
  alignItems: 'center',
  marginTop: 10,
  elevation: 4,
},


  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

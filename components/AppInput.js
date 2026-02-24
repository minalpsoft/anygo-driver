import { TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function AppInput({value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
 })
 {
  return (
   <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    elevation: 2,            
    shadowColor: '#000',    
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
});

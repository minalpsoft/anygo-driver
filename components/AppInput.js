import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function AppInput({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  rightIcon,
  onRightIconPress,
}) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />

      {rightIcon && (
        <TouchableOpacity
          style={styles.icon}
          onPress={onRightIconPress}
        >
          <Ionicons name={rightIcon} size={22} color="#777" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingRight: 45, // space for icon
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
});
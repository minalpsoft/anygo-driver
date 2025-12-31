import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function AppFileInput({ label, onSelect }) {
  const [selected, setSelected] = useState(false);

  const pickFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const fileObj = {
        uri: asset.uri,
        name: asset.fileName || 'document.jpg',
        type: asset.mimeType || 'image/jpeg',
      };

      onSelect(fileObj);
      setSelected(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.btn} onPress={pickFile}>
        <Ionicons name="cloud-upload-outline" size={20} />
        <Text style={styles.btnText}>
          {selected ? 'File Selected ✔' : 'Choose File'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 6, fontWeight: '600' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  btnText: { marginLeft: 8 },
});

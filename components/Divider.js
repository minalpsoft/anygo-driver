import { View, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function Divider({
  height = 1,
  color = COLORS.border,
  marginVertical = 12,
  marginHorizontal = 0,
}) {
  return (
    <View
      style={[
        styles.divider,
        {
          height,
          backgroundColor: color,
          marginVertical,
          marginHorizontal,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

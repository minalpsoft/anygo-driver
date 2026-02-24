// components/AppLogo.js
import { View, Image, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function AppLogo() {
  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Image
          source={require('../assets/ANYGO.png')}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80, 
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FF1E1E',
    // justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  logo: {
    width: '100%',
    height: '100%',
  },

});

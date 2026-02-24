import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../theme/colors';

function TabItem({ icon, label, screenName }) {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = route.name === screenName;

  return (
    <TouchableOpacity
      style={[
        styles.tabItem,
        isActive && styles.activeTab,
      ]}
      onPress={() => navigation.navigate(screenName)}
    >

      <Ionicons
        name={icon}
        size={22}
        color={isActive ? COLORS.primary : '#777'}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: isActive ? COLORS.primary : '#777' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}


export default function BottomTabs() {
  return (
    <View style={styles.bottomTabs}>
      <TabItem
        icon="home"
        label="Dashboard"
        screenName="Dashboard"
      />

      <TabItem
        icon="car"
        label="My Trips"
        screenName="History"
      />

      <TabItem
        icon="person"
        label="Profile"
        screenName="Profile"
      />
    </View>
  );
}


const styles = StyleSheet.create({
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },


  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },

  activeTab: {
    backgroundColor: '#FFF5F5',
    // paddingHorizontal: 14,
    // paddingVertical: 6,
    // borderRadius: 14,
  },

});

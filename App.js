import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  RefreshControl,
  Image,
  TouchableOpacity
} from 'react-native'; // Import APIs

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import UserAvatar from 'react-native-user-avatar';
import { FAB } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function App() {
  const [users, setUsers] = useState([]); // State to hold the user data
  const [refreshing, setRefreshing] = useState(false); // State to handle pull-to-refresh

  // This hook will Fetch 10 users when the app loads
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from API using built in fetch
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://random-data-api.com/api/v2/users?size=10'); // Fetching API call
      const data = await response.json(); // Parse the JSON from the response
      setUsers(data); // Setting fetched users in the state
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to add one more user at the top of the list using fetch
  const fetchOneMoreUser = async () => {
    try {
      const response = await fetch('https://random-data-api.com/api/v2/users?size=1'); // Fetch API call
      const data = await response.json(); // Parse the JSON from the response
      setUsers([data, ...users]); // destructuring the existing users (...) to add the new user at the top of the list
    } catch (error) {
      console.error('Error fetching one more user:', error);
    }
  };

  // Function to handle pull-to-refresh, fetching new users
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers(); // calling fetchUsers function to fetch new users when refreshing
    setRefreshing(false);
  };

  // Function to render each user item in the FlatList
  const renderUser = ({ item }) => {
    return (
      <View style={styles.userContainer}>
        {/* Conditional rendering based on platform */}
        {Platform.OS === 'android' && <UserAvatar size={50} src={item.avatar} />}
        <View style={styles.nameContainer}>
          <Text style={styles.firstName}>{item.first_name}</Text>
          <Text style={styles.lastName}>{item.last_name}</Text>
        </View>
        {Platform.OS === 'ios' && <UserAvatar size={50} src={item.avatar} />}
      </View>
    );
  };

  // Key extractor function to ensure each item in the FlatList has a unique key
  const keyExtractor = item => item.uid.toString(); // Using 'uid' as the unique key

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.textStyle}>Welcome to the User List</Text>
        </View>
        {/* FlatList for displaying user data */}
        <FlatList
          data={users} // List of users
          renderItem={renderUser} // Function to render each user
          keyExtractor={keyExtractor} // Unique key for each user
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Pull-to-refresh functionality
        />

        {/* This is my floating Action Button (FAB) TouchableOpacity using materialIcons */}
        <TouchableOpacity style={styles.fab} onPress={fetchOneMoreUser}>
          <MaterialIcons name="add" size={55} color="white" />
        </TouchableOpacity>

        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  textStyle: {
    padding: 15
  },
  userContainer: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nameContainer: {
    flex: 1,
    marginHorizontal: 10
  },
  firstName: {
    fontSize: 16
  },
  lastName: {
    fontSize: 14,
    color: '#666'
  },
  fab: {
    position: 'absolute',
    margin: 15,
    right: 15,
    bottom: 65,
    backgroundColor: '#008000',
    borderRadius: 30
  }
});

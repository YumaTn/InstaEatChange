import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Wallet = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [totalPoint, setTotalPoint] = useState(null);

  useEffect(() => {
    const fetchTotalPoint = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('User token not found');
        }

        // Fetch user data to get the UserId
        const userUrl = 'https://instaeat.azurewebsites.net/api/Account';
        const userResponse = await fetch(userUrl, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        const userId = userData.items[0].userId;

        // Fetch total points using UserId
        const walletUrl = `https://instaeat.azurewebsites.net/api/Wallet/${userId}`;
        const walletResponse = await fetch(walletUrl, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!walletResponse.ok) {
          throw new Error('Failed to fetch wallet data');
        }

        const walletData = await walletResponse.json();
        setTotalPoint(walletData.totalPoint);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalPoint();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <SimpleLineIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>
      <View>
        <Text style={styles.textTitleWallet}>Tài khoản tín dụng của bạn</Text>
        <Text style={styles.point}>{totalPoint !== null ? totalPoint : 'N/A'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'purple',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  textTitleWallet: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: '#CCCCCC',
  },
  point: {
    textAlign: 'center',
    fontSize: 40,
    color: 'green',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Wallet;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { fetchWithTokenRefresh } from '../utils/auth';
import { baseUrl } from '../baseUrl';
import { useTheme } from '@/app/context/ThemeProvider'; // Adjust import path as necessary
import { formatDecimal } from '../utils/formatDecimal';
import { useRouter } from 'expo-router';

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const { theme } = useTheme(); // Use the theme context
  const router=useRouter();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        console.log('Fetching balance...'); // Log before fetching
        const response = await fetchWithTokenRefresh('https://farmus-wallet-backend.vercel.app/api/wallet/balance', {
          method: 'GET',
        });
  
        console.log('Response Status:', response.status); // Log the response status
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('API Response:', data);
  
        setBalance(data.balance || 0);
      } catch (error) {
        console.error('Error fetching wallet details:', error);
        Alert.alert('Error', error.message || 'Failed to fetch wallet details.');
      }
    };
    fetchBalance();
  }, []);
  

  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#F5F5F5' : '#424242' }]}>
      <Text style={[styles.title, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>Wallet Balance</Text>
      <Text style={[styles.balance, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>Ksh.{formatDecimal(balance)}</Text>
      
      <Pressable
        style={[styles.button, { backgroundColor: theme === 'light' ? '#388E3C' : '#2E7D32' }]}
        onPress={() => {router.push('/wallet/deposit')}}
      >
        <Text style={[styles.buttonText, { color: theme === 'light' ? '#FFFFFF' : '#E0E0E0' }]}>Add Funds</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: theme === 'light' ? '#388E3C' : '#2E7D32' }]}
        onPress={() => { router.push('/wallet/withdraw') }}
      >
        <Text style={[styles.buttonText, { color: theme === 'light' ? '#FFFFFF' : '#E0E0E0' }]}>Withdraw Funds</Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: theme === 'light' ? '#388E3C' : '#2E7D32' }]}
        onPress={() => {  }}
      >
        <Text style={[styles.buttonText, { color: theme === 'light' ? '#FFFFFF' : '#E0E0E0' }]}>Transaction History</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { fetchWithTokenRefresh } from '../utils/auth';
import { baseUrl } from '../baseUrl';

export default function AddFundsScreen() {
  const [amount, setAmount] = useState('');

  const handleAddFunds = async () => {
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        Alert.alert('Invalid Amount', 'Amount must be a positive number.');
        return;
      }

      const response = await fetchWithTokenRefresh(`${baseUrl}api/auth/deposit-funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add funds.');
      }

      Alert.alert('Success', `Funds added successfully. New balance: $${data.balance}`);
      setAmount('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add funds.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Funds</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Pressable style={styles.button} onPress={handleAddFunds}>
        <Text style={styles.buttonText}>Add Funds</Text>
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
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#795548',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

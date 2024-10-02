import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import moment from 'moment'; // Import moment for date calculations
import { baseUrl } from '../baseUrl';

export default function ProductDetailScreen() {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/product?id=${id}`);
        if (!response.ok) throw new Error('Failed to fetch product data');
        const data = await response.json();
  
        // Convert price if it's an object with $numberDecimal
        if (data.price && typeof data.price === 'object' && data.price.$numberDecimal) {
          data.price = parseFloat(data.price.$numberDecimal).toFixed(2); // or any other formatting
        }
  
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id]);
  

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />;
  if (error) {
    Alert.alert('Error', error);
    return null;
  }
  if (!product) return <Text style={styles.errorText}>Product not found</Text>;

  // Calculate time since upload
  const timeSinceUpload = moment(product.createdAt).fromNow();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri:product.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.category}>Category: {product.category}</Text>
        <Text style={styles.timeSinceUpload}>Uploaded {timeSinceUpload}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()} // Navigate back to the previous screen
      >
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#C8E6C9', // Light Green background
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250, // Adjust height as needed
    borderRadius: 10,
    marginBottom: 20,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#388E3C', // Dark Green text
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#795548', // Brown text
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    color: '#4CAF50', // Green text
    marginBottom: 10,
  },
  timeSinceUpload: {
    fontSize: 16,
    color: '#888888', // Gray text
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333333', // Dark gray text
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#4CAF50', // Green button
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C8E6C9',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000', // Red text for errors
    textAlign: 'center',
    marginTop: 20,
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from '@/components/custom/ProductCard'; // Adjust the import path as needed
import { useAuth } from '@/app/context/AuthContext'; // Import the Auth context or hook
import { useTheme } from './context/ThemeProvider';
import { baseUrl } from './baseUrl';
import { fetchWithTokenRefresh } from './utils/auth'; 

interface Product {
  _id: string;
  name: string;
  price: string; // Assuming price is a string due to Decimal128
  imageUrl: string;
  description: string;
  createdBy: string; // User ID
}

interface User {
  _id: string;
  name: string; // Updated to 'name'
  profilePicture: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { isLoggedIn, checkAuthStatus } = useAuth(); // Use Auth context
  const { theme } = useTheme(); // Use the theme context

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleDeleteProduct = async (productId: string) => {
    try {
      const token = checkAuthStatus; // Fetch the token from auth context
      if (token) {
        const response = await fetchWithTokenRefresh(`${baseUrl}api/auth/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setProducts(products.filter(product => product._id !== productId));
          Alert.alert('Success', 'Product deleted successfully!');
        } else {
          Alert.alert('Error', data.message);
        }
      } else {
        Alert.alert('Error', 'No authentication token found.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error('Delete Product Error:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithTokenRefresh(`${baseUrl}api/auth/profile`, {
          method: 'GET',
        });

        const data = await response.json();
        if (response.ok) {
          setCurrentUserId(data.user._id); // Set currentUserId
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        setError('Failed to fetch user data. Please try again later.');
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetchWithTokenRefresh(`${baseUrl}api/auth/products`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const processedProducts = data.map((product: Product) => ({
          ...product,
          price: parseFloat(product.price),
        }));
        setProducts(processedProducts);

        // Fetch user details
        const userIds = processedProducts.map(product => product.createdBy);
        const uniqueUserIds = Array.from(new Set(userIds));

        const userResponses = await Promise.all(
          uniqueUserIds.map(userId =>
            fetchWithTokenRefresh(`${baseUrl}api/auth/users/${userId}`, {
              method: 'GET',
            })
          )
        );

        const validUserResponses = await Promise.all(
          userResponses.map(async (res) => {
            if (res.ok) {
              return await res.json();
            } else {
              console.error(`Failed to fetch user, status: ${res.status}`);
              return null;
            }
          })
        );

        const filteredUserData = validUserResponses.filter(user => user !== null);

        const userMap = filteredUserData.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {} as { [key: string]: User });

        setUsers(userMap);

      } catch (error) {
        console.error('Error fetching products:', error.message);
        setError('Failed to load products. Please try again later.');
      }
    };

    fetchUserData();
    fetchProducts();
  }, []);

  const renderItem = ({ item }: { item: Product }) => {
    const user = users[item.createdBy];

    return (
      <ProductCard
        title={item.name}
        price={item.price}
        imageUrl={item.imageUrl}
        description={item.description}
        productId={item._id} // MongoDB ObjectId
        userProfilePicture={user?.profilePicture || 'https://via.placeholder.com/150'} // Default image if not found
        username={user?.name || 'Unknown User'} // Updated to 'name'
        userId={item.createdBy} // Use createdBy for userId
        currentUserId={currentUserId} // Show 'Buy' button only if the product does not belong to the user
        category={item.category}
        createdAt={item.createdAt}
        onDelete={handleDeleteProduct}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#C8E6C9' : '#1E1E1E' }]}>
      {/* Welcome Message */}
      <Text style={[styles.welcomeText, { color: theme === 'light' ? '#388E3C' : '#FFFFFF' }]}>Welcome to Farmus!</Text>
      
      {/* Search Bar */}
      <TextInput
        style={[styles.searchInput, { borderColor: theme === 'light' ? '#795548' : '#BDBDBD', backgroundColor: theme === 'light' ? '#FFFFFF' : '#616161' }]}
        placeholder="Search for products or farms..."
        placeholderTextColor={theme === 'light' ? '#795548' : '#BDBDBD'} // Brown for placeholder text
      />

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Featured Products */}
      <Text style={[styles.sectionTitle, { color: theme === 'light' ? '#388E3C' : '#FFFFFF' }]}>Featured Products</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.productList}
      />

      {/* Navigation Options */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.viewAllButton]}
          onPress={() => router.push('/products/all-products')}
        >
          <Text style={styles.buttonText}>View All Products</Text>
        </Pressable>
        {isLoggedIn ? (
          <Pressable
            style={[styles.button, styles.createListingButton]}
            onPress={() => router.push('/new-listing')}
          >
            <Text style={styles.buttonText}>Create New Listing</Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.button, styles.signInButton]}
            onPress={() => router.push('/auth/signIn')}
          >
            <Text style={styles.buttonText}>Sign In to Create Listing</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productList: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  viewAllButton: {
    backgroundColor: '#795548', // Brown button
  },
  createListingButton: {
    backgroundColor: '#4CAF50', // Green button
  },
  signInButton: {
    backgroundColor: '#FF5722', // Orange button for sign-in
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF5722', // Orange for error message
    textAlign: 'center',
    marginBottom: 20,
  },
});

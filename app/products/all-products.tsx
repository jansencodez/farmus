import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ProductCard from '@/components/custom/ProductCard'; // Adjust path if needed
import { baseUrl } from '../baseUrl';
import { useTheme } from '../context/ThemeProvider';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithTokenRefresh } from '../utils/auth';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  createdBy: string;
}

interface User {
  _id: string;
  name: string;
  profilePicture: string;
}

export default function AllProductsScreen() {
  const { theme } = useTheme();
  const { userId } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [error, setError] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(userId);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const userResponse = await fetchWithTokenRefresh(`${baseUrl}/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setCurrentUserId(userData.user._id); // Set currentUserId
          } else {
            throw new Error('Failed to fetch user data');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/products`); // Replace with your backend URL

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Received non-JSON response");
        }

        const data: Product[] = await response.json();
        const processedProducts = data.map((product) => ({
          ...product,
          price: parseFloat(product.price.toString()), // Convert price from Decimal128 string to number
        }));

        setProducts(processedProducts);

        // Fetch user details
        const userIds = processedProducts.map(product => product.createdBy);
        const uniqueUserIds = Array.from(new Set(userIds));

        const userResponses = await Promise.all(
          uniqueUserIds.map(userId =>
            fetch(`${baseUrl}/users?id=${userId}`)
          )
        );

        const validUserResponses = await Promise.all(
          userResponses.map(async (res) => {
            if (res.ok) {
              const contentType = res.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                return await res.json();
              } else {
                console.warn(`Unexpected content-type: ${contentType}`);
                return null;
              }
            } else {
              console.error(`Failed to fetch user, status: ${res.status}`);
              return null;
            }
          })
        );

        const filteredUserData = validUserResponses.filter(user => user !== null) as User[];

        const userMap = filteredUserData.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {} as { [key: string]: User });

        setUsers(userMap);

      } catch (error) {
        console.error('Error fetching products:', error);
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
        title={item.name} // Assuming your product schema uses 'name'
        price={item.price.toFixed(2)} // Format price as currency
        imageUrl={item.imageUrl} // Construct full URL
        productId={item._id} // Assuming _id is the unique id
        description={item.description} // Assuming your product schema has 'description'
        userProfilePicture={user?.profilePicture} // Construct full URL
        username={user?.name} // Assuming your user schema has 'username'
        userId={item.createdBy}
        category={item.category}
        createdAt={item.createdAt}
        currentUserId={currentUserId}
      />
    );
  };

  return (
    <View style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, theme === 'dark' ? styles.darkTitle : styles.lightTitle]}>All Products</Text>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item._id} // Use _id as key
          contentContainerStyle={styles.productList}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212', // Dark background for dark theme
  },
  lightContainer: {
    backgroundColor: '#C8E6C9', // Light Green background for light theme
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkTitle: {
    color: '#E0E0E0', // Light text color for dark theme
  },
  lightTitle: {
    color: '#388E3C', // Dark Green text for light theme
  },
  productList: {
    flexGrow: 1,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  row:{
    justifyContent: "space-evenly",
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '@/components/custom/ProductCard'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params;
  const baseUrl = 'http://192.168.100.133:5000/'; // Replace with your actual server URL

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const userResponse = await fetch(`${baseUrl}api/auth/users/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
  
          const userData = await userResponse.json();
  
          if (userResponse.ok) {
            setUser(userData);
            setName(userData.name);
            setEmail(userData.email);
  
            // Fetch product details
            const productDetailsPromises = userData.products.map(product =>
              fetch(`${baseUrl}api/auth/products/${product}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              }).then(response => response.json())
            );
  
            const productDetails = await Promise.all(productDetailsPromises);
            console.log('Product Details:', productDetails); // Add this line
            const formattedProducts = productDetails.map(product => ({
              ...product,
              price: product.price.$numberDecimal // Ensure price is formatted correctly
            }));
            setProducts(formattedProducts);
          } else {
            Alert.alert('Error', userData.message);
          }
        } else {
          Alert.alert('Error', 'No authentication token found.');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred.');
        console.error('Fetch User Data Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(`${baseUrl}api/auth/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email }),
        });

        const data = await response.json();
        if (response.ok) {
          Alert.alert('Success', 'Profile updated successfully!');
          setUser({ ...user, name, email });
          setIsEditing(false);
        } else {
          Alert.alert('Error', data.message);
        }
      } else {
        Alert.alert('Error', 'No authentication token found.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      console.error('Update Profile Error:', error);
    }
  };

  const handleProfilePress = () => {
    if (user?._id) {
      router.push(`/profile/${user._id}`);
    } else {
      Alert.alert('Error', 'User ID not found.');
    }
  };

  const renderItem = ({ item }) => (
    <ProductCard
      title={item.name}
      price={item.price}
      imageUrl={item.imageUrl}
      description={item.description}
      productId={item._id} // MongoDB ObjectId
      userProfilePicture={user?.profilePicture || 'https://via.placeholder.com/150'} // Default image if not found
      username={user?.name || 'Unknown User'}
      userId={item.createdBy} // Use createdBy for userId
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>User not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.title}>{user.name}'s profile</Text>

        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Pressable style={styles.button} onPress={handleSaveChanges}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={styles.userInfo}>
              <Pressable onPress={handleProfilePress}>
                <Image
                  source={{ uri: `${baseUrl}${user.profilePicture}` }}
                  style={styles.profilePicture}
                />
              </Pressable>
              <View>
                <Text style={styles.detailText}>Name: {user.name}</Text>
                <Text style={styles.detailText}>Email: {user.email}</Text>
              </View>
            </View>
            <Pressable style={styles.button} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.title}>My Products</Text>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.productList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#C8E6C9', // Light Green background
  },
  profileSection: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#388E3C', // Dark Green text
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#795548', // Brown border
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF', // White input background
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50', // Green button
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 18,
    color: '#388E3C', // Dark Green text
    marginBottom: 10,
  },
  productsSection: {
    flex: 1,
  },
  productList: {
    flexGrow: 1,
  },
});

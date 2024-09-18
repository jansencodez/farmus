import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '@/components/custom/ProductCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithTokenRefresh } from './utils/auth';
import { useTheme } from './context/ThemeProvider';
import { baseUrl } from './baseUrl';
import { getGreeting } from './utils/getGreeting';
import { formatDecimal } from './utils/formatDecimal';

export default function ProfileScreen() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const router = useRouter();
    const { theme } = useTheme(); // Use the theme hook

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const userResponse = await fetchWithTokenRefresh(`${baseUrl}api/auth/profile`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const userData = await userResponse.json();

                    if (userResponse.ok) {
                        setUser(userData.user);
                        setCurrentUserId(userData.user._id);
                        setName(userData.user.name);
                        setEmail(userData.user.email);

                        const productDetailsPromises = userData.products.map(productId =>
                            fetchWithTokenRefresh(`${baseUrl}api/auth/products/${productId}`, {
                                method: 'GET',
                                headers: { 'Content-Type': 'application/json' },
                            }).then(response => response.json())
                        );

                        const productDetails = await Promise.all(productDetailsPromises);
                        const formattedProducts = productDetails.map(product => ({
                            ...product,
                            price: formatDecimal(product.price),
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
            }
        };

        fetchUserData();
    }, []);

    const handleSaveChanges = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await fetchWithTokenRefresh(`${baseUrl}api/auth/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
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

    const handleDeleteProduct = async (productId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await fetchWithTokenRefresh(`${baseUrl}api/auth/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
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

    const renderItem = ({ item }) => (
        <ProductCard
            title={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            description={item.description}
            productId={item._id}
            userProfilePicture={user?.profilePicture || 'https://via.placeholder.com/150'}
            username={user?.name || 'Unknown User'}
            userId={item.createdBy}
            category={item.category}
            currentUserId={currentUserId}
            onDelete={handleDeleteProduct}
        />
    );

    if (!user) {
        return (
            <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
                <Text style={[styles.title, theme === 'dark' ? styles.darkTitle : styles.lightTitle]}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, theme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            <View style={styles.profileSection}>
                <Text style={[styles.title, theme === 'dark' ? styles.darkTitle : styles.lightTitle]}>
                    {getGreeting()}, {user.name}
                </Text>

                {isEditing ? (
                    <>
                        <TextInput
                            style={[styles.input, theme === 'dark' ? styles.darkInput : styles.lightInput]}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={[styles.input, theme === 'dark' ? styles.darkInput : styles.lightInput]}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                        <Pressable style={[styles.button, theme === 'dark' ? styles.darkButton : styles.lightButton]} onPress={handleSaveChanges}>
                            <Text style={[styles.buttonText, theme === 'dark' ? styles.darkButtonText : styles.lightButtonText]}>
                                Save Changes
                            </Text>
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
                                <Text style={[styles.detailText, theme === 'dark' ? styles.darkDetailText : styles.lightDetailText]}>
                                    Name: {user.name}
                                </Text>
                                <Text style={[styles.detailText, theme === 'dark' ? styles.darkDetailText : styles.lightDetailText]}>
                                    Email: {user.email}
                                </Text>
                            </View>
                        </View>
                        <Pressable style={[styles.button, theme === 'dark' ? styles.darkButton : styles.lightButton]} onPress={() => setIsEditing(true)}>
                            <Text style={[styles.buttonText, theme === 'dark' ? styles.darkButtonText : styles.lightButtonText]}>
                                Edit Profile
                            </Text>
                        </Pressable>
                    </>
                )}
            </View>
            <Pressable style={[styles.button, theme === 'dark' ? styles.darkButton : styles.lightButton]} onPress={() => router.push('/new-listing')}>
                <Text style={[styles.buttonText, theme === 'dark' ? styles.darkButtonText : styles.lightButtonText]}>
                    Add product
                </Text>
            </Pressable>

            <View style={styles.productsSection}>
                <Text style={[styles.title, theme === 'dark' ? styles.darkTitle : styles.lightTitle]}>My Products</Text>
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
  },
  darkContainer: {
      backgroundColor: '#1E1E1E',
  },
  lightContainer: {
      backgroundColor: '#C8E6C9',
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
      borderColor: '#E0E0E0',
      borderWidth: 2,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  darkTitle: {
      color: '#E0E0E0',
  },
  lightTitle: {
      color: '#388E3C',
  },
  input: {
      height: 40,
      borderColor: '#795548',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
  },
  darkInput: {
      borderColor: '#E0E0E0',
      backgroundColor: '#1E1E1E',
      color: '#E0E0E0',
  },
  lightInput: {
      borderColor: '#388E3C',
      backgroundColor: '#C8E6C9',
  },
  button: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
  },
  darkButton: {
      backgroundColor: '#333333',
  },
  lightButton: {
      backgroundColor: '#388E3C',
  },
  buttonText: {
      color: '#FFFFFF',
  },
  darkButtonText: {
      color: '#E0E0E0',
  },
  lightButtonText: {
      color: '#FFFFFF',
  },
  detailText: {
      fontSize: 16,
  },
  darkDetailText: {
      color: '#E0E0E0',
  },
  lightDetailText: {
      color: '#388E3C',
  },
  productsSection: {
      flex: 1,
  },
  productList: {
      paddingBottom: 20,
  },
});

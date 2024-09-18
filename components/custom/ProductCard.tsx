import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/app/context/ThemeProvider';
import { baseUrl } from '@/app/baseUrl';
import moment from 'moment'; // Moment.js for time formatting

interface ProductCardProps {
  title: string;
  price: string;
  imageUrl: string;
  productId: string;
  description: string;
  userProfilePicture: string;
  username: string;
  userId: string;
  currentUserId: string;
  category: string;
  createdAt: string;
  onDelete: (productId: string) => void;
}

export default function ProductCard({
  title,
  price,
  imageUrl,
  productId,
  description,
  userProfilePicture,
  username,
  userId,
  currentUserId,
  category,
  createdAt,
  onDelete,
}: ProductCardProps) {
  const { theme } = useTheme(); // Get current theme
  const productImage = baseUrl + imageUrl;
  const profilePicture = baseUrl + userProfilePicture;
  const router = useRouter();
  const [timeSinceUpload, setTimeSinceUpload] = useState(moment(createdAt).fromNow());

  // Handle image loading errors
  const handleImageError = (e: any) => {
    e.target.src = 'https://via.placeholder.com/200'; // Fallback image
  };

  // Time since product was uploaded
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceUpload(moment(createdAt).fromNow());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [createdAt]);

  // Define dynamic styles based on theme
  const styles = getStyles(theme);

  return (
    <View style={styles.card}>
      {/* Product Image */}
      <Pressable
        onPress={() => router.push(`/product/${productId}`)} // Navigate to ProductDetailScreen
        accessibilityLabel={`View details of ${title}`}
      >
        <Image
          source={{ uri: productImage }}
          style={styles.productImage}
          onError={handleImageError}
          accessibilityLabel={`Image of ${title}`}
        />
      </Pressable>

      {/* Product Details */}
      <View style={styles.details}>
        <Pressable
          onPress={() => router.push(`/product/${productId}`)} // Navigate to ProductDetailScreen
          accessibilityLabel={`View details of ${title}`}
        >
          <Text style={styles.productTitle}>{title}</Text>
        </Pressable>
        <Text style={styles.productPrice}>Ksh.{price}</Text>
        <Text style={styles.productDescription}>{description}</Text>
        <Text style={styles.productCategory}>Category: {category}</Text>
        <Text style={styles.timeSinceUpload}>Uploaded {timeSinceUpload}</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Pressable
          onPress={() => router.push(`/users/${userId}`)}
          accessibilityLabel={`Go to ${username}'s profile`}
        >
          <Image
            source={{ uri: profilePicture }}
            style={styles.profileImage}
            onError={handleImageError}
            accessibilityLabel={`Profile picture of ${username}`}
          />
        </Pressable>
        <Pressable
          onPress={() => currentUserId===userId?router.push('/profile'): router.push(`/users/${userId}`)}
          accessibilityLabel={`Go to ${username}'s profile`}
        >
          <Text style={styles.username}>{username}</Text>
        </Pressable>
      </View>

      {/* Conditional Buttons */}
      {currentUserId === userId ? (
        // Show "Your Product" label for the posting user
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Your Product</Text>
          <Pressable
            style={styles.deleteButton}
            onPress={() => onDelete(productId)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      ) : (
        // Show "Buy" button for non-posting users
        <Pressable style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Buy</Text>
        </Pressable>
      )}
    </View>
  );
}

// Define styles based on the theme
const getStyles = (theme: string) => {
  const isDarkMode = theme === 'dark';

  return StyleSheet.create({
    card: {
      backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 20,
      elevation: 3,
    },
    productImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
    },
    details: {
      padding: 10,
    },
    productTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
    productPrice: {
      fontSize: 16,
      color: isDarkMode ? '#4CAF50' : '#388E3C',
    },
    productDescription: {
      fontSize: 14,
      color: isDarkMode ? '#BBBBBB' : '#666666',
      marginTop: 5,
    },
    productCategory: {
      fontSize: 14,
      color: isDarkMode ? '#AAAAAA' : '#444444',
      marginTop: 5,
    },
    timeSinceUpload: {
      fontSize: 12,
      color: isDarkMode ? '#888888' : '#999999',
      marginTop: 5,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#444444' : '#E0E0E0',
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    username: {
      fontSize: 16,
      color: isDarkMode ? '#4CAF50' : '#388E3C',
    },
    deleteButton: {
      backgroundColor: '#F44336',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    buyButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      margin: 10,
    },
    buyButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#444444' : '#E0E0E0',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#4CAF50' : '#388E3C',
    },
  });
};

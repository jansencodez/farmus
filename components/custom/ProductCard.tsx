import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/app/context/ThemeProvider";
import moment from "moment"; // Moment.js for time formatting
import { fetchWithTokenRefresh } from "@/app/utils/auth";
import { useCart } from "@/app/context/cartProvider";

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
  isDeleting: boolean;
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
  isDeleting,
}: ProductCardProps) {
  const { colors } = useTheme(); // Get current colors from theme
  const productImage = imageUrl;
  const profilePicture = userProfilePicture;
  const router = useRouter();
  const [timeSinceUpload, setTimeSinceUpload] = useState(
    moment(createdAt).fromNow()
  );
  const { cart, addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Handle image loading errors
  const handleImageError = (e: any) => {
    e.target.src = "https://via.placeholder.com/200"; // Fallback image
  };

  // Time since product was uploaded
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceUpload(moment(createdAt).fromNow());
    }, 60000); // Update every minute

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [createdAt]);

  // Function to handle buying the product
  const handleAddToCart = async (userId, productId) => {
    setIsAdding(true); // Set buying state to true
    try {
      await addToCart(userId, productId);
    } catch (e) {
    } finally {
      setIsAdding(false); // Reset buying state
    }
  };

  // Define dynamic styles based on theme
  const styles = getStyles(colors);

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
          onPress={() =>
            currentUserId === userId
              ? router.push("/profile")
              : router.push(`/users/${userId}`)
          }
          accessibilityLabel={`Go to ${username}'s profile`}
        >
          <Text style={styles.username}>{username}</Text>
        </Pressable>
      </View>

      {/* Product Details */}
      <View style={styles.details}>
        <Pressable
          onPress={() => router.push(`/product/${productId}`)} // Navigate to ProductDetailScreen
          accessibilityLabel={`View details of ${title}`}
        >
          <Text style={styles.timeSinceUpload}>Uploaded {timeSinceUpload}</Text>
          <Text style={styles.productTitle}>{title}</Text>
        </Pressable>
        <Text style={styles.productPrice}>Ksh.{price}</Text>
        <Text style={styles.productCategory}>Category: {category}</Text>
        <Text
          style={styles.productDescription}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
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
            {isDeleting && <ActivityIndicator color="#FFFFFF" />}
            {!isDeleting && <Text style={styles.deleteButtonText}>Delete</Text>}
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.buyButton}
          onPress={() => handleAddToCart(currentUserId, productId, price)}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buyButtonText}>Add to Cart</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

// Define styles based on the theme colors
const getStyles = (colors: any) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 20,
      elevation: 3,
      width: 160,
      height: 300,
    },
    productImage: {
      width: "100%",
      height: 110,
      resizeMode: "cover",
    },
    details: {
      padding: 2,
    },
    productTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    productPrice: {
      fontSize: 16,
      color: colors.primary,
    },
    productDescription: {
      fontSize: 14,
      color: colors.placeholder,
      marginTop: 1,
    },
    productCategory: {
      fontSize: 14,
      color: colors.placeholder,
      marginTop: 1,
    },
    timeSinceUpload: {
      fontSize: 12,
      color: colors.secondary,
      marginTop: 1,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      padding: 2,
      borderTopWidth: 1,
      borderTopColor: colors.secondary,
    },
    profileImage: {
      width: 25,
      height: 25,
      borderRadius: 20,
      marginRight: 10,
    },
    username: {
      fontSize: 16,
      color: colors.primary,
    },
    deleteButton: {
      backgroundColor: "#F44336",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 10,
    },
    deleteButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    buyButton: {
      backgroundColor: colors.primary,
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      margin: 10,
    },
    buyButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    labelContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: colors.secondary,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
  });
};

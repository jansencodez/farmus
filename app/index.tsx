import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { useRouter } from "expo-router";
import ProductCard from "@/components/custom/ProductCard"; // Adjust the import path as needed
import { useAuth } from "@/app/context/AuthContext"; // Import the Auth context or hook
import { useTheme } from "./context/ThemeProvider";
import { baseUrl } from "./baseUrl";
import { fetchWithTokenRefresh } from "./utils/auth";
import * as Updates from "expo-updates";
import * as SplashScreen from "expo-splash-screen";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
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
  const [isReady, setIsReady] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("Checking for updates...");

  const router = useRouter();
  const { isLoggedIn, checkAuthStatus } = useAuth();
  const { colors } = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setUpdateStatus("Updating, this may take a while...");
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          ToastAndroid.show("Updated", ToastAndroid.SHORT);
        }
      } catch (error) {
        console.log(error);
      } finally {
        SplashScreen.hideAsync();
        setIsReady(true);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetchWithTokenRefresh(`${baseUrl}/profile`, {
          method: "GET",
        });

        const data = await response.json();
        if (response.ok) {
          setCurrentUserId(data.user._id); // Set currentUserId
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {}
    };

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetchWithTokenRefresh(`${baseUrl}/products`, {
          method: "GET",
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
        setFilteredProducts(processedProducts); // Initialize filteredProducts
        setIsLoading(false);

        // Fetch user details
        const userIds = processedProducts.map(
          (product: {}) => product.createdBy
        );
        const uniqueUserIds = Array.from(new Set(userIds));

        const userResponses = await Promise.all(
          uniqueUserIds.map((userId) =>
            fetchWithTokenRefresh(`${baseUrl}/users?id=${userId}`, {
              method: "GET",
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

        const filteredUserData = validUserResponses.filter(
          (user) => user !== null
        );

        const userMap = filteredUserData.reduce((acc, user) => {
          acc[user._id] = user;
          return acc;
        }, {} as { [key: string]: User });

        setUsers(userMap);
      } catch (error) {
        setError("Failed to load products. Please try again later.");
      }
    };

    checkForUpdates();
    fetchUserData();
    fetchProducts();
  }, []);

  // Update filtered products whenever products or searchTerm changes
  useEffect(() => {
    if (searchTerm) {
      const newItems = products.filter(
        (item) =>
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.price.toString().includes(searchTerm)
      );
      setFilteredProducts(newItems);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsDeleting(true);
      const token = checkAuthStatus; // Fetch the token from auth context
      if (token) {
        const response = await fetchWithTokenRefresh(
          `${baseUrl}/delete?id=${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setProducts(products.filter((product) => product._id !== productId));
          setFilteredProducts(
            filteredProducts.filter((product) => product._id !== productId)
          ); // Update filteredProducts as well
          ToastAndroid.show("Product deleted successfully", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Deletion failed", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("Not signed in", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Deletion error", ToastAndroid.SHORT);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isReady) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 20 }}>{updateStatus}</ThemedText>
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: Product }) => {
    const user = users[item.createdBy];

    return (
      <ProductCard
        title={item.name}
        price={item.price}
        imageUrl={item.imageUrl}
        description={item.description}
        productId={item._id} // MongoDB ObjectId
        userProfilePicture={
          user?.profilePicture || "https://via.placeholder.com/40"
        } // Default image if not found
        username={user?.name || "Unknown User"} // Updated to 'name'
        userId={item.createdBy} // Use createdBy for userId
        currentUserId={currentUserId} // Show 'Buy' button only if the product does not belong to the user
        category={item.category}
        createdAt={item.createdAt}
        onDelete={handleDeleteProduct}
        isDeleting={isDeleting}
      />
    );
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Search Bar */}
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={[
          styles.searchInput,
          {
            borderColor: colors.secondary,
            backgroundColor: colors.background,
            color: colors.text,
          },
        ]}
        placeholder="Search for products or farms..."
        placeholderTextColor={colors.placeholder} // Placeholder color based on theme
      />

      {/* Error Message */}
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      {/* Featured Products */}
      <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
        Featured Products
      </ThemedText>
      {isLoading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      )}

      <FlatList
        data={filteredProducts || products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.productList}
        numColumns={2} // Number of columns in the grid
        columnWrapperStyle={styles.row}
      />

      {/* Navigation Options */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: colors.secondary }]}
          onPress={() => router.push("/products/all-products")}
        >
          <ThemedText style={styles.buttonText}>View All Products</ThemedText>
        </Pressable>

        {isLoggedIn ? (
          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/new-listing")}
          >
            <ThemedText style={styles.buttonText}>Add Item</ThemedText>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.button, { backgroundColor: "#FF5722" }]} // Orange for sign-in
            onPress={() => router.push("/auth/signIn")}
          >
            <ThemedText style={styles.buttonText}>
              Sign In to Add items
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-evenly",
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
    fontWeight: "bold",
    marginBottom: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
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
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // White text for buttons
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF5722", // Orange for error message
    textAlign: "center",
    marginBottom: 20,
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
  },
});

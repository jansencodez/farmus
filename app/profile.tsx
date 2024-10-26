import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useCurrentUser } from "./context/currentUserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "@/components/custom/ProductCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWithTokenRefresh } from "./utils/auth";
import { useTheme } from "./context/ThemeProvider";
import { baseUrl } from "./baseUrl";
import { getGreeting } from "./utils/getGreeting";
import { formatDecimal } from "./utils/formatDecimal";
import { useAuth } from "./context/AuthContext";
import { ThemedView } from "@/components/ThemedView"; // Import ThemedView
import { ThemedText } from "@/components/ThemedText";

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const { checkAuthStatus, isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const router = useRouter();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const userResponse = await fetchWithTokenRefresh(
            `${baseUrl}/profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (userResponse.ok) {
            const userText = await userResponse.text();
            const userData = JSON.parse(userText);
            setUser(userData.user);
            setCurrentUserId(userData.user._id);
            setName(userData.user.name);
            setEmail(userData.user.email);

            const productDetailsPromises = userData.products.map(
              async (productId) => {
                setIsLoading(true);
                const productResponse = await fetchWithTokenRefresh(
                  `${baseUrl}/product?id=${productId}`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (!productResponse.ok) {
                  const productErrorText = await productResponse.text();
                  throw new Error(
                    `Failed to fetch product: ${productErrorText}`
                  );
                }

                const productText = await productResponse.text();
                const productData = JSON.parse(productText);
                return productData;
              }
            );

            const productDetails = await Promise.all(productDetailsPromises);
            const formattedProducts = productDetails.map((product) => ({
              ...product,
              price: formatDecimal(product.price),
            }));
            setIsLoading(false);
            setProducts(formattedProducts);
          } else {
            const userErrorText = await userResponse.text();
            throw new Error(`Failed to fetch user profile: ${userErrorText}`);
          }
        } else {
          throw new Error("Token not available");
        }
      } catch (error) {
        ToastAndroid.show(
          error.message || "Failed to load profile",
          ToastAndroid.SHORT
        );
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await fetchWithTokenRefresh(`${baseUrl}/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });

        const data = await response.json();
        if (response.ok) {
          ToastAndroid.show("Successfully updated", ToastAndroid.SHORT);
          setUser({ ...user, name, email });
          setIsEditing(false);
        } else {
          ToastAndroid.show("Error occurred", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("Error occurred", ToastAndroid.SHORT);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
      console.error("Update Profile Error:", error);
    }
  };

  const handleProfilePress = () => {
    if (user?._id) {
      router.push(`/profile/${user._id}`);
    } else {
      Alert.alert("Error", "User ID not found.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsDeleting(true);
      const token = checkAuthStatus;
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
          ToastAndroid.show("Successful", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Not successful", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("Not signed in", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Failed", ToastAndroid.SHORT);
    }
  };

  const renderItem = ({ item }) => (
    <ProductCard
      title={item.name}
      price={item.price}
      imageUrl={item.imageUrl}
      description={item.description}
      productId={item._id}
      userProfilePicture={
        user?.profilePicture || "https://via.placeholder.com/150"
      }
      username={user?.name || "Unknown User"}
      userId={item.createdBy}
      category={item.category}
      currentUserId={currentUserId}
      onDelete={handleDeleteProduct}
    />
  );

  if (!isLoggedIn || !user) {
    return (
      <ThemedView
        style={[styles.loader, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator
          size="large"
          color={colors.tex}
          style={[{ borderColor: colors.background }]}
        />
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.profileSection}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            {getGreeting()}, {user.name}
          </ThemedText>

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
                    source={{ uri: user.profilePicture }}
                    style={styles.profilePicture}
                  />
                </Pressable>
                <View>
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    Name: {user.name}
                  </Text>
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    Email: {user.email}
                  </Text>
                </View>
              </View>
              <Pressable
                style={[styles.button, { backgroundColor: colors.secondary }]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </Pressable>
            </>
          )}
        </View>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/new-listing")}
        >
          <Text style={styles.buttonText}>Add Product</Text>
        </Pressable>
        <ThemedView style={[{ backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            My Products
          </Text>
        </ThemedView>
        {products && (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productList}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    margin: 0,
    marginTop: -35,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  profileSection: {
    marginBottom: 20,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
  },
  productsSection: {
    marginTop: 10,
  },
  productList: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-evenly",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});

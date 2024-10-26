import React, { useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeProvider";
import { useCart } from "../context/cartProvider";
import { useCurrentUser } from "../context/currentUserContext";

const CartScreen = () => {
  const { colors } = useTheme();
  const { cart = [], fetchCart, removeFromCart } = useCart();
  const { currentUser } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      console.log("Current User:", currentUser);
      fetchCart(currentUser.user.id) // Fetch cart items if user is available
        .then((data) => {
          console.log("Cart fetched:", data); // Log fetched data for debugging
        })
        .catch((error) => console.error("Error fetching cart:", error));
    }
  }, [currentUser]);

  const handleRemoveItem = (itemId) => {
    removeFromCart(currentUser.user.id, itemId);
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView style={[styles.top, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.title}>Your cart</ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/cart/checkout")}
          style={styles.processButton}
        >
          <ThemedText style={[styles.processBtnText, { color: colors.text }]}>
            Process
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ScrollView>
        {cart.length === 0 ? (
          <ThemedText>
            No items in cart (items added to cart will appear here)
          </ThemedText>
        ) : (
          cart.map((item) => {
            // Convert Decimal128 price to number
            const price = item.price ? parseFloat(item.price.toString()) : 0;

            return (
              <ThemedView key={item.productId.id} style={styles.cartItem}>
                <ThemedText>{item.productId.name}</ThemedText>
                <ThemedText
                  style={{ color: "green", fontSize: 16, padding: 2 }}
                >
                  Ksh {price.toFixed(2)} {/* Display formatted price */}
                </ThemedText>
                <Pressable
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.rBtn}
                >
                  <ThemedText style={styles.removeButton}>Remove</ThemedText>
                </Pressable>
              </ThemedView>
            );
          })
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  processButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingStart: 20,
    paddingEnd: 20,
    backgroundColor: "rgba(40,200,20,.4)",
    borderEndWidth: 1,
    borderStartWidth: 1,
  },
  processBtnText: {
    fontWeight: "700",
  },
  cartItem: {
    position: "relative",
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
  },
  rBtn: {
    position: "absolute",
    right: 6,
    top: 15,
    backgroundColor: "rgba(200,40,40,.4)",
    borderRadius: 8,
    padding: 6,
    width: 60,
  },
  removeButton: {
    color: "red",
    textAlign: "center",
  },
});

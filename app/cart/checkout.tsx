import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { useCart } from "../context/cartProvider";
import { useCurrentUser } from "../context/currentUserContext";
import { useTheme } from "../context/ThemeProvider";
useTheme;

const CheckoutScreen = () => {
  const { cart, fetchCart, removeFromCart } = useCart();
  const { currentUser } = useCurrentUser();
  const { colors } = useTheme();

  // Calculate total price and handle Decimal128
  const totalPrice = cart
    ? cart.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      )
    : 0;

  useEffect(() => {
    if (currentUser) {
      fetchCart(currentUser.user.id); // Fetch cart items when the screen loads
    }
  }, [currentUser]);

  const handleRemoveItem = (itemId) => {
    removeFromCart(currentUser.user.id, itemId);
  };

  const handlePayment = () => {
    // Add payment handling logic here (e.g., M-Pesa integration)
    alert("Payment completed successfully!");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Checkout</ThemedText>
      <ThemedText style={styles.totalText}>
        Total Amount: Ksh {totalPrice.toFixed(2)}
      </ThemedText>

      <ScrollView>
        {cart &&
          cart.map((item) => (
            <ThemedView key={item._id} style={styles.cartItem}>
              <ThemedText style={[styles.itemText, { color: colors.text }]}>
                {item.productId.name} - Ksh {parseFloat(item.price)}
              </ThemedText>
              <ThemedText style={[{ color: colors.text }]}>
                {item.quantity}
              </ThemedText>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item._id)}
                style={styles.removeButton}
              >
                <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ))}
      </ScrollView>

      <TouchableOpacity onPress={handlePayment} style={styles.paymentButton}>
        <ThemedText style={styles.paymentText}>Pay Now</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  totalText: {
    fontSize: 20,
    marginBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    backgroundColor: "#d9534f",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  paymentButton: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#388E3C",
    borderRadius: 8,
    alignItems: "center",
  },
  paymentText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

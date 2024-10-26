import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { useCart } from "../context/cartProvider";
import { useCurrentUser } from "../context/currentUserContext";

const CheckoutScreen = () => {
  const { cartItems, fetchCart } = useCart();
  const { currentUser } = useCurrentUser();
  const totalPrice =
    cartItems && cartItems.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    if (currentUser) {
      fetchCart(currentUser._id); // Fetch the cart items when the screen loads
    }
  }, [currentUser]);

  const handleRemoveItem = (itemId) => {
    removeFromCart(currentUser._id, itemId);
  };
  const handlePayment = () => {
    // Add payment handling logic here (e.g., M-Pesa integration)
    alert("Payment completed successfully!");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Checkout</ThemedText>
      <ThemedText style={styles.totalText}>
        Total Amount: Ksh {totalPrice}
      </ThemedText>

      {/* Display cart items */}
      {cartItems &&
        cartItems.map((item) => (
          <ThemedText key={item.id} style={styles.cartItem}>
            {item.name} - Ksh {item.price}
          </ThemedText>
        ))}

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
    fontSize: 16,
    marginVertical: 4,
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

import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "../context/ThemeProvider";

const CartScreen = () => {
  const { colors } = useTheme();
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "product 1", price: 100 },
    { id: 2, name: "product 2", price: 390 },
    { id: 3, name: "product 2", price: 390 },
    { id: 4, name: "product 2", price: 30 },
    { id: 5, name: "product 2", price: 390 },
    { id: 6, name: "product 2", price: 390 },
    { id: 7, name: "product 2", price: 900 },
    { id: 8, name: "product 2", price: 390 },
    { id: 9, name: "product 2", price: 390 },
    { id: 10, name: "product 2", price: 390 },
  ]);

  const router = useRouter();
  const removeItem = (itemId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView style={[styles.top, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.title}>Your cart</ThemedText>
        <TouchableOpacity style={styles.processButton}>
          <ThemedText style={[styles.processBtnText, { color: colors.text }]}>
            process
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ScrollView>
        {cartItems.length === 0 && (
          <ThemedText>
            No items in cart (items added to cart will appear here)
          </ThemedText>
        )}
        {cartItems.length !== 0 &&
          cartItems.map((item) => (
            <ThemedView key={item.id} style={styles.cartItem}>
              <ThemedText>{item.name}</ThemedText>
              <ThemedText style={{ color: "green", fontSize: 16, padding: 2 }}>
                Ksh{item.price}
              </ThemedText>
              <Pressable
                onPress={() => removeItem(item.id)}
                style={styles.rBtn}
              >
                <ThemedText style={styles.removeButton}>Remove</ThemedText>
              </Pressable>
            </ThemedView>
          ))}
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
    fontWeight: 700,
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
    display: "flex",
  },
  checkoutButton: {
    padding: 16,
    backgroundColor: "#388E3C",
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

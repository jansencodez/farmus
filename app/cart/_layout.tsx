import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Stack } from "expo-router";
import CustomHeader from "@/components/custom/CustomHeader";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeProvider";
import CartScreen from ".";
import CheckoutScreen from "./checkout";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createMaterialBottomTabNavigator();

function LayoutContent() {
  return (
    <Tab.Navigator
      initialRouteName="Cart"
      shifting={true} // Enable shifting for tab bar style change
      sceneAnimationEnabled={false} // Disable animation if unnecessary
      barStyle={{ backgroundColor: "#388E3C" }} // Customize the tab bar color
    >
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: "Cart",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="shopping-cart" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          tabBarLabel: "Checkout",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="payment" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

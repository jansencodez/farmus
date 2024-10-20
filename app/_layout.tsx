import { Stack } from 'expo-router';
import CustomHeader from '@/components/custom/CustomHeader'; // Adjust path as needed
import { AuthProvider } from './context/AuthContext'; // Adjust path as needed
import { ThemeProvider } from './context/ThemeProvider';
// Adjust path as needed

function LayoutContent() {
  return (
    <Stack
      screenOptions={{
        header: ({ navigation, route, options }) => (
          <CustomHeader />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="products/all-products" options={{ title: 'All Products' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="auth/signIn" options={{ title: 'Sign In' }} />
      <Stack.Screen name="auth/signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="new-listing" options={{ title: 'New Listing' }} />
      <Stack.Screen name="users/[id]" options={{ title: 'Profile' }} />
      <Stack.Screen name='product/[id]' options={{title: "Product" }} />
      <Stack.Screen name='settings/theme' options={{title:'theme'}}/>
      <Stack.Screen name="wallet" options={{ title:'wallet'}}/>
      <Stack.Screen name='settings/reset-password' options={{title:'reset password'}}/>
      <Stack.Screen name="cart" options={{title:'my cart'}}/>
    </Stack>
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

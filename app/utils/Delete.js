import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";



const handleDeleteProduct = async (productId: string) => {
  const { isLoggedIn, checkAuthStatus } = useAuth();
  try {
    const token = checkAuthStatus; // Fetch the token from auth context
    if (token) {
      const response = await fetchWithTokenRefresh(`${baseUrl}api/auth/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
        Alert.alert('Success', 'Product deleted successfully!');
      } else {
        Alert.alert('Error', data.message);
      }
    } else {
      Alert.alert('Error', 'No authentication token found.');
    }
  } catch (error) {
    Alert.alert('Error', 'An unexpected error occurred.');
    console.error('Delete Product Error:', error);
  }
};

export default handleDeleteProduct;
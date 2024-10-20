import { Stack } from 'expo-router';
import CustomHeader from '@/components/custom/CustomHeader'; // Adjust path as needed
import { AuthProvider } from '../context/AuthContext'; 
import { ThemeProvider } from '../context/ThemeProvider';
// Adjust path as needed

function LayoutContent() {
  return (
    <Stack
    >
      <Stack.Screen name='index' options={{title:"wallet"}}/>
      <Stack.Screen name='withdraw' options={{title:"withdraw"}}/>
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
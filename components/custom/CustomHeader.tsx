import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/context/ThemeProvider';

export default function CustomHeader() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { isLoggedIn, signOut, checkAuthStatus } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleSignOut = async () => {
    try {
      await signOut();
      setMenuVisible(false);
      router.push('/auth/signIn');
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme === 'light' ? '#388E3C' : '#2E7D32' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme === 'light' ? '#FFFFFF' : '#E0E0E0' }]}>Farmus</Text>

        <View style={styles.rightSection}>
          <TouchableOpacity onPress={toggleMenu} style={styles.profileButton}>
            <Ionicons name="menu-outline" size={30} color={theme === 'light' ? '#FFFFFF' : '#E0E0E0'} />
          </TouchableOpacity>

          {menuVisible && (
            <View style={[styles.dropdownMenu, { backgroundColor: theme === 'light' ? '#FFFFFF' : '#424242' }]}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/');
                }}
              >
                <Ionicons name="home-outline" size={20} color={theme === 'light' ? '#388E3C' : '#B9FBC0'} style={styles.menuIcon} />
                <Text style={[styles.menuText, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>Home</Text>
              </Pressable>

              {isLoggedIn ? (
                <>
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      router.push('/profile');
                    }}
                  >
                    <Ionicons name="person-outline" size={20} color={theme === 'light' ? '#388E3C' : '#B9FBC0'} style={styles.menuIcon} />
                    <Text style={[styles.menuText, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>My Profile</Text>
                  </Pressable>
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      router.push('/settings');
                    }}
                  >
                    <Ionicons name="settings-outline" size={20} color={theme === 'light' ? '#388E3C' : '#B9FBC0'} style={styles.menuIcon} />
                    <Text style={[styles.menuText, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>Settings</Text>
                  </Pressable>
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      router.push('/wallet');
                    }}
                  >
                    <Ionicons name="wallet-outline" size={20} color={theme === 'light' ? '#388E3C' : '#B9FBC0'} style={styles.menuIcon} />
                    <Text style={[styles.menuText, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>Wallet</Text>
                  </Pressable>
                  <Pressable
                    style={styles.menuItem}
                    onPress={handleSignOut}
                  >
                    <Ionicons name="log-out-outline" size={20} color={theme === 'light' ? '#388E3C' : '#B9FBC0'} style={styles.menuIcon} />
                    <Text style={[styles.menuText, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>Sign Out</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      router.push('/auth/signIn');
                    }}
                  >
                    <Ionicons name="log-in-outline" size={20} color={theme === 'light' ? '#388E3C' : '#B9FBC0'} style={styles.menuIcon} />
                    <Text style={[styles.menuText, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>Sign In</Text>
                  </Pressable>
                  <Pressable
                    style={styles.menuItem}
                    onPress={() => {
                      setMenuVisible(false);
                      router.push('/auth/signup');
                    }}
                  >
                    <Ionicons name="person-add-outline" size={20} color={theme === 'light' ? '#388E3C' : '#B9FBC0'} style={styles.menuIcon} />
                    <Text style={[styles.menuText, { color: theme === 'light' ? '#388E3C' : '#B9FBC0' }]}>Sign Up</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // Background color will be dynamically set via the theme
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 5,
  },
  dropdownMenu: {
    flex: 1,
    width: 160,
    position: 'absolute',
    top: 60,
    right: 0,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet,ScrollView, TextInput, Pressable, Alert, Image, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { fetchWithTokenRefresh } from './utils/auth'; 
import { baseUrl } from './baseUrl';
import {Picker} from "@react-native-picker/picker";

export default function NewListingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const { uri } = result.assets[0];
      setImageUri(uri);
    }
  };

  const handleCreateListing = async () => {
    try {
        // Validate and format price
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            Alert.alert('Invalid Price', 'Price must be a non-negative number.');
            return;
        }

        const formattedPrice = numericPrice.toFixed(2).toString(); // Ensure it's in string format
        console.log(category, imageUri,name)
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'User not authenticated. Please sign in.');
            return;
        }

        const formData = new FormData();
        if (imageUri) {
            formData.append('productImage', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'product.jpg',
            });
        }
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', formattedPrice);
        formData.append('category', category);

        // Fetch request
        const response = await fetchWithTokenRefresh(`${baseUrl}/create-listing`, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        // Log response status and raw response
        const responseText = await response.text(); // Get raw response text
        console.log('Response Status:', response.status);
        console.log('Raw Response:', responseText); // Log raw response

        const responseData = JSON.parse(responseText);

        if (!response.ok) {
            throw new Error(responseData.message || 'Network response was not ok');
        }

        ToastAndroid.show('Successfully added', ToastAndroid.SHORT);
        router.push('/');
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setImageUri(null);
    } catch (error) {
        Alert.alert('Error', error.message || 'Failed. Please try again.');
        console.log('Fetch Error:', error);
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
};




  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, {minHeight:40,height:'auto'}]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
       <View style={styles.picker}>
        <Text style={{paddingTop:10, color:"white"}}>Select Category: </Text>
        <Picker
        selectedValue={category}
        style={{height:20, width:150, padding:0, backgroundColor:"#4CAF50", color:"white"}}
        onValueChange={setCategory}
      >
          <Picker.Item label='Vegetables' value="Vegetables"/>
          <Picker.Item label='Fruits' value='Fruits'/>
          <Picker.Item label='Grains' value='Grains'/>
          <Picker.Item label='Dairy' value='Dairy'/>
          <Picker.Item label='Meat' value='Meat'/>
          <Picker.Item label='Poultry' value='Poultry'/>
          <Picker.Item label='Others' value='Others'/>
      </Picker>
       </View>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>No image selected</Text>
      )}
      <Pressable style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleCreateListing}>
        <Text style={styles.buttonText}>Create</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height:'auto',
    padding: 10,
    backgroundColor: '#C8E6C9'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#795548',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  button: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker:{
    backgroundColor:'#4CAF50',
    margin:10,
    height:80,
    borderRadius: 10,
    paddingLeft:10,
  },
  image: {
    width: 300,
    height: 350,
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  noImageText: {
    textAlign: 'center',
    color: '#388E3C',
    marginTop: 10,
  },
});

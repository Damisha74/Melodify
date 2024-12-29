import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image,
  ActivityIndicator 
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid }, 
    watch 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  // Watch form values for real-time validation
  const formValues = watch();

  useEffect(() => {
     // Check if user is already logged in
     const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          navigation.replace('Home', { username: user.username });
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
    return () => {
      // Cleanup if needed
    };
  }, []);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";
    return true;
  };

  const handleLogin = async (data) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      

      // Get stored user data
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) {
        Alert.alert('Error', 'No registered user found. Please register first.');
        return;
      }

      const userData = JSON.parse(storedData);
      
     // Check if credentials match
     if (userData.email === data.email && userData.password === data.password) {
      // Store login status
      await AsyncStorage.setItem('isLoggedIn', 'true');
      Alert.alert(
        'Login Successful',
        `Welcome ${userData.username}!`,
        [
          {
            text: 'Continue',
            onPress: () => navigation.replace('Home', { username: userData.username })
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Invalid credentials. Please try again.');
    }
  } catch (error) {
    Alert.alert('Error', 'Login failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/headphones.jpg')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome Back!</Text>

      {/* Username Input */}
      <Controller
        control={control}
        name="username"
        rules={{
          required: 'Username is required',
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters long'
          }
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.username && styles.errorInput]}
            placeholder="Enter your username"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        )}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username.message}</Text>
      )}

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Enter your email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters long'
          },
          validate: validatePassword
        }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, errors.password && styles.errorInput]}
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Text>{passwordVisible ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit(handleLogin)}
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>
          Don't have an account? <Text style={styles.registerLink}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};



export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 100,
    color: '#f8f9fa',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#d3d3d3',
  },
  errorInput: {
    borderColor: 'red',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 20,
  },
  registerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  visibilityToggle: {
    position: 'absolute',
    right: 10,
    height: 35,
    // justifyContent: 'center',
  },
  });
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AISupport from '@/components/AISupport';
import { loginService } from '@/services/loginService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'admin' | 'student'>('student');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const { token, profile } = await loginService(email, password, userType);
      if (Platform.OS === 'web') {
        localStorage.setItem('sessionToken', token);
      } else {
        await AsyncStorage.setItem('sessionToken', token);
      }

      if (profile === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/student-dashboard');
      }
    } catch {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#000000', '#000033', '#000066']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>🌊</Text>
            </View>
            <Text style={styles.title}>JUSTDIVE</Text>
            <Text style={styles.subtitle}>Academy</Text>
          </View>

          {/* User Type Selector */}
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'student' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('student')}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'student' && styles.userTypeTextActive,
                ]}
              >
                Estudante
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'admin' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('admin')}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === 'admin' && styles.userTypeTextActive,
                ]}
              >
                Administrador
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Palavra-passe"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Entrar</Text>
            </TouchableOpacity>
          </View>

          {/* Demo Credentials */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Credenciais de Demonstração:</Text>
            <Text style={styles.demoText}>
              Estudante: student@justdive.com / student
            </Text>
            <Text style={styles.demoText}>
              Admin: admin@justdive.com / admin
            </Text>
          </View>
        </View>
      </LinearGradient>
      
      {/* AI Support Button */}
      <AISupport visible={true} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent', // Fundo transparente para a logo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 4,
  },
  userTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    backgroundColor: 'white',
  },
  userTypeText: {
    color: 'white',
    fontWeight: '600',
  },
  userTypeTextActive: {
    color: '#0EA5E9',
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: 'white',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: '#0EA5E9',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoContainer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  demoTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Phone, Linkedin } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, verifyOTP, signInWithLinkedIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');
    
    // Only return the first 10 digits
    return cleaned.slice(0, 10);
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
    setError(null);
  };

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await login(phoneNumber);
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await verifyOTP(phoneNumber, otp);
      // After successful verification, navigate to the appropriate screen
      if (user) {
        router.replace('/');
      } else {
        router.replace('/auth/complete-profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
      setIsLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithLinkedIn();
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with LinkedIn');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={styles.logoText}>MBA</Text>
          </View>
          <Text style={[styles.logoTitle, { color: colors.text }]}>MBA Alumni Network</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {otpSent ? 'Verify OTP' : 'Sign In'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {otpSent 
              ? 'Enter the verification code sent to your phone'
              : 'Enter your phone number to receive a verification code'
            }
          </Text>
          
          {error && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          )}
          
          {!otpSent ? (
            <View style={styles.inputContainer}>
              <View 
                style={[
                  styles.inputWrapper, 
                  { 
                    borderColor: colors.border,
                    backgroundColor: colors.inputBackground 
                  }
                ]}
              >
                <Phone size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="9876543210"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  maxLength={10}
                />
              </View>
              
              <Button
                title="Send OTP"
                onPress={handleSendOTP}
                disabled={phoneNumber.length < 10 || isLoading}
                loading={isLoading}
                style={styles.button}
              />

              <View style={styles.dividerContainer}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </View>

              <Button
                title="Sign in with LinkedIn"
                onPress={handleLinkedInSignIn}
                variant="outline"
                icon={<Linkedin size={20} color={colors.primary} />}
                style={styles.linkedinButton}
                disabled={isLoading}
              />
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <View 
                style={[
                  styles.otpInputContainer, 
                  { 
                    borderColor: colors.border,
                    backgroundColor: colors.inputBackground 
                  }
                ]}
              >
                <TextInput
                  style={[styles.otpInput, { color: colors.text }]}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                />
              </View>
              
              <Button
                title="Verify & Sign In"
                onPress={handleVerifyOTP}
                disabled={otp.length < 6 || isLoading}
                loading={isLoading}
                style={styles.button}
              />
              
              <TouchableOpacity 
                style={styles.resendLink}
                onPress={() => setOtpSent(false)}
              >
                <Text style={[styles.resendText, { color: colors.primary }]}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          By continuing, you agree to our
        </Text>
        <View style={styles.linksContainer}>
          <TouchableOpacity>
            <Text style={[styles.link, { color: colors.primary }]}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}> & </Text>
          <TouchableOpacity>
            <Text style={[styles.link, { color: colors.primary }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    padding: 0,
  },
  otpInputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  otpInput: {
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 8,
    padding: 0,
  },
  button: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  linkedinButton: {
    marginTop: 8,
  },
  resendLink: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
});

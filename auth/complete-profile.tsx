import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Shield, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Consulting',
  'Marketing',
  'Manufacturing',
  'Education',
  'Retail',
];

const DEFAULT_PROFILE_IMAGE = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, refreshUser } = useAuth();
  
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState('');
  const [industry, setIndustry] = useState('');
  const [photo, setPhoto] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [offering, setOffering] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIndustries, setShowIndustries] = useState(false);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        setError('Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        setError(null);
        
        try {
          const fileExt = result.assets[0].uri.split('.').pop()?.toLowerCase() || 'jpg';
          const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
          const contentType = `image/${fileExt}`;

          if (Platform.OS === 'web') {
            // For web, fetch the image and convert to blob
            const response = await fetch(result.assets[0].uri);
            if (!response.ok) throw new Error('Failed to fetch image');
            
            const blob = await response.blob();
            
            const { data, error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(fileName, blob, {
                contentType,
                cacheControl: '3600',
                upsert: true
              });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);

            setPhoto(publicUrl);
          } else {
            // For native platforms
            const response = await fetch(result.assets[0].uri);
            if (!response.ok) throw new Error('Failed to fetch image');
            
            const blob = await response.blob();

            const { data, error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(fileName, blob, {
                contentType,
                cacheControl: '3600',
                upsert: true
              });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);

            setPhoto(publicUrl);
          }
        } catch (error) {
          console.error('Upload error:', error);
          setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setError(error instanceof Error ? error.message : 'Failed to pick image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name || !company || !title || !batch || !industry) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Authentication error: ${sessionError.message}`);
      }

      if (!session) {
        throw new Error('No active session found. Please log in again.');
      }

      // Ensure we have a valid user ID
      if (!user?.id) {
        throw new Error('User ID not found. Please log in again.');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          name,
          company,
          title,
          batch,
          industry,
          photo: photo || DEFAULT_PROFILE_IMAGE,
          looking_for: lookingFor,
          offering,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      await refreshUser();
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Shield size={32} color="#fff" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Complete Your Profile</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Tell us about yourself to connect with other alumni
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.photoContainer} 
        onPress={pickImage}
        disabled={loading}
      >
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={styles.photoPlaceholder}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={[styles.photoPlaceholder, { backgroundColor: colors.card }]}>
            <Upload size={32} color={colors.primary} />
            <Text style={[styles.photoText, { color: colors.textSecondary }]}>
              {loading ? 'Uploading...' : 'Upload Profile Photo'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text,
              }
            ]}
            placeholder="John Doe"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Company *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text,
              }
            ]}
            placeholder="Company Name"
            placeholderTextColor={colors.textSecondary}
            value={company}
            onChangeText={setCompany}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text,
              }
            ]}
            placeholder="Job Title"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Graduation Batch/Year *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text,
              }
            ]}
            placeholder="2020"
            placeholderTextColor={colors.textSecondary}
            value={batch}
            onChangeText={setBatch}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={[
          styles.inputGroup,
          showIndustries && { marginBottom: 350 }
        ]}>
          <Text style={[styles.label, { color: colors.text }]}>Industry *</Text>
          <TouchableOpacity
            style={[
              styles.input,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
              }
            ]}
            onPress={() => setShowIndustries(!showIndustries)}
          >
            <Text style={{ color: industry ? colors.text : colors.textSecondary }}>
              {industry || 'Select Industry'}
            </Text>
          </TouchableOpacity>
          
          {showIndustries && (
            <View 
              style={[
                styles.dropdown,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }
              ]}
            >
              {INDUSTRIES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setIndustry(item);
                    setShowIndustries(false);
                  }}
                >
                  <Text 
                    style={[
                      styles.dropdownText,
                      { color: colors.text }
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>What are you looking for?</Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text,
              }
            ]}
            placeholder="E.g., Mentorship, job opportunities, connections in specific industries..."
            placeholderTextColor={colors.textSecondary}
            value={lookingFor}
            onChangeText={setLookingFor}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>What can you offer?</Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text,
              }
            ]}
            placeholder="E.g., Industry insights, mentorship, networking opportunities..."
            placeholderTextColor={colors.textSecondary}
            value={offering}
            onChangeText={setOffering}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        )}

        <Button
          title="Complete Profile"
          onPress={handleUpdateProfile}
          loading={loading}
          disabled={loading}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    marginTop: 8,
    fontSize: 14,
  },
  form: {
    gap: 20,
    position: 'relative',
    zIndex: 1,
  },
  inputGroup: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 3000,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    justifyContent: 'center',
  },
  textArea: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 3000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 8,
  },
});
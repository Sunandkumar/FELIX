import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Scan } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

interface Connection {
  id: string;
  name: string;
  photo: string;
  title: string;
  company: string;
  batch: string;
  industry: string;
  looking: string;
  offering: string;
}

export default function QuestModeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { userId } = useLocalSearchParams();
  const [user, setUser] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    if (!userId) {
      setError('No user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('all_connections')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('User not found');

      setUser(data);
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuest = () => {
    router.push({
      pathname: '/(modals)/connection-quest',
      params: { userId }
    });
  };

  const handleScanQR = () => {
    router.push({
      pathname: '/(modals)/connection-quest',
      params: { mode: 'scanner' }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Loading...
          </Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading user details...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Error
          </Text>
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error || 'Failed to load user details'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Start Quest
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image
            source={{ uri: user.photo }}
            style={styles.profileImage}
            contentFit="cover"
          />
          
          <Text style={[styles.name, { color: colors.text }]}>
            {user.name}
          </Text>
          
          <Text style={[styles.role, { color: colors.textSecondary }]}>
            {user.title} at {user.company}
          </Text>

          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>
                {user.batch}
              </Text>
            </View>
            
            <View style={[styles.tag, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.tagText, { color: colors.accent }]}>
                {user.industry}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Looking For
          </Text>
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
            {user.looking || 'Not specified'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Offering
          </Text>
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
            {user.offering || 'Not specified'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: colors.accentLight }]}
          onPress={handleScanQR}
        >
          <Scan size={20} color={colors.accent} style={styles.scanIcon} />
          <Text style={[styles.scanButtonText, { color: colors.accent }]}>
            Scan QR Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={handleStartQuest}
        >
          <Text style={styles.startButtonText}>
            Start Connection Quest
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  startButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scanIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});



import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { UserPlus, MessageSquare, Users, Activity, Trophy } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
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

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [groupChallenge, setGroupChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('all_connections')
        .select('*')
        .limit(5); // Limit to 5 recommended connections

      if (fetchError) throw fetchError;

      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      setError('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  // Simulate a group challenge assignment
  useEffect(() => {
    const timer = setTimeout(() => {
      setGroupChallenge({
        id: '1',
        name: 'Team Alpha',
        members: 5,
        challenge: 'Take a group photo at the main entrance',
        expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
      });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatExpiryTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const handleStartQuest = (userId: string) => {
    if (!userId) {
      console.error('No user ID provided for quest');
      return;
    }
    
    router.push({
      pathname: '/(modals)/quest-mode',
      params: { userId }
    });
  };

  // Get first name for welcome message
  const firstName = user?.name ? user.name.split(' ')[0] : '';

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header 
          title="MBA Alumni Network" 
          subtitle={`Welcome back, ${firstName}!`} 
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <Button 
            title="Retry" 
            onPress={fetchConnections}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="MBA Alumni Network" 
        subtitle={`Welcome back, ${firstName}!`} 
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {groupChallenge && (
          <Card style={styles.alertCard}>
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <Users size={24} color={colors.primary} />
                <Text style={[styles.alertTitle, { color: colors.text }]}>
                  New Group Challenge!
                </Text>
              </View>
              <Text style={[styles.alertDesc, { color: colors.textSecondary }]}>
                You've been assigned to {groupChallenge.name} for a special challenge
              </Text>
              <Button 
                title="View Challenge" 
                onPress={() => router.push('/(modals)/group-challenge')}
              />
            </View>
          </Card>
        )}

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <UserPlus size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Connections</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Activity size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>{user?.points || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <Trophy size={24} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rank</Text>
          </Card>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recommended Connections
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            People you might want to meet based on your interests
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading connections...
              </Text>
            </View>
          ) : connections.length > 0 ? (
            connections.map((person) => (
              <Card key={person.id} style={styles.connectionCard}>
                <View style={styles.connectionContent}>
                  <ExpoImage
                    source={{ uri: person.photo }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  
                  <View style={styles.connectionInfo}>
                    <Text style={[styles.personName, { color: colors.text }]}>
                      {person.name}
                    </Text>
                    <Text style={[styles.personRole, { color: colors.textSecondary }]}>
                      {person.title} at {person.company}
                    </Text>
                    <View style={styles.tagContainer}>
                      <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[styles.tagText, { color: colors.primary }]}>
                          {person.batch}
                        </Text>
                      </View>
                      <View style={[styles.tag, { backgroundColor: colors.accentLight }]}>
                        <Text style={[styles.tagText, { color: colors.accent }]}>
                          {person.industry}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { borderColor: colors.border }]}
                    onPress={() => router.push(`/directory/${person.id}`)}
                  >
                    <MessageSquare size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.actionButton, 
                      styles.primaryButton, 
                      { backgroundColor: colors.primary }
                    ]}
                    onPress={() => handleStartQuest(person.id)}
                  >
                    <UserPlus size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No connections available
              </Text>
            </View>
          )}
          
          <Button 
            title="View All Recommendations" 
            variant="outline"
            onPress={() => router.push('/directory')}
            style={styles.viewAllButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  alertCard: {
    marginTop: 16,
    padding: 16,
  },
  alertContent: {
    gap: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  alertDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  connectionCard: {
    marginBottom: 12,
    padding: 16,
  },
  connectionContent: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  connectionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
  },
  personRole: {
    fontSize: 14,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    borderWidth: 0,
  },
  viewAllButton: {
    marginTop: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    width: 120,
  },
});
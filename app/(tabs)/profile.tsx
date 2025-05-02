import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { LogOut, CreditCard as Edit2, Check, X, Settings, Award } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [looking, setLooking] = useState(user?.looking_for || '');
  const [offering, setOffering] = useState(user?.offering || '');
  
  const achievements = [
    {
      id: '1',
      title: 'Network Maven',
      description: 'Connected with 10+ alumni',
      icon: '🌟',
      earned: true,
    },
    {
      id: '2',
      title: 'Cross-Industry Connector',
      description: 'Connected with alumni from 5 different industries',
      icon: '🔗',
      earned: true,
    },
    {
      id: '3',
      title: 'Group Challenge Champion',
      description: 'Completed 3 group challenges',
      icon: '🏆',
      earned: false,
    },
  ];

  const toggleEdit = () => {
    if (isEditing) {
      // Save changes
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    // Reset to original values
    setIsEditing(false);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.card }]}
          onPress={logout}
        >
          <LogOut size={20} color={colors.error} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingsButton, { backgroundColor: colors.card }]}
        >
          <Settings size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileHeader}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={{ uri: user?.photo || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg' }}
            style={styles.profileImage}
            contentFit="cover"
            transition={300}
          />
        </View>
        
        <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Loading...'}</Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>
          {user?.title || 'Loading...'} at {user?.company || ''}
        </Text>
        
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.tagText, { color: colors.primary }]}>MBA {user?.batch}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: colors.accentLight }]}>
            <Text style={[styles.tagText, { color: colors.accent }]}>{user?.industry}</Text>
          </View>
        </View>
        
        <View style={[styles.statsContainer, { borderColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Connections
            </Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Quests
            </Text>
          </View>
          
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{user?.points || 0}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Points
            </Text>
          </View>
        </View>
      </View>
      
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What I'm Looking For
          </Text>
          
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
              <Edit2 size={18} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <X size={18} color={colors.error} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={toggleEdit}>
                <Check size={18} color={colors.success} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {!isEditing ? (
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
            {looking}
          </Text>
        ) : (
          <TextInput
            style={[
              styles.inputField,
              { 
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.inputBackground
              }
            ]}
            value={looking}
            onChangeText={setLooking}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        )}
      </Card>
      
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What I'm Offering
          </Text>
          
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
              <Edit2 size={18} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                <X size={18} color={colors.error} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={toggleEdit}>
                <Check size={18} color={colors.success} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {!isEditing ? (
          <Text style={[styles.sectionContent, { color: colors.textSecondary }]}>
            {offering}
          </Text>
        ) : (
          <TextInput
            style={[
              styles.inputField,
              { 
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.inputBackground
              }
            ]}
            value={offering}
            onChangeText={setOffering}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        )}
      </Card>
      
      <Card style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Achievements
          </Text>
          <Award size={20} color={colors.accent} />
        </View>
        
        {achievements.map((achievement) => (
          <View 
            key={achievement.id}
            style={[
              styles.achievementItem,
              { borderBottomColor: colors.border }
            ]}
          >
            <View style={styles.achievementIcon}>
              <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
            </View>
            
            <View style={styles.achievementInfo}>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>
                {achievement.title}
              </Text>
              <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>
                {achievement.description}
              </Text>
            </View>
            
            {achievement.earned ? (
              <View style={[styles.achievementBadge, { backgroundColor: colors.successLight }]}>
                <Text style={[styles.achievementBadgeText, { color: colors.success }]}>
                  Earned
                </Text>
              </View>
            ) : (
              <View style={[styles.achievementBadge, { backgroundColor: colors.borderLight }]}>
                <Text style={[styles.achievementBadgeText, { color: colors.textSecondary }]}>
                  Locked
                </Text>
              </View>
            )}
          </View>
        ))}
      </Card>
      
      <Button
        title="View LinkedIn Profile"
        variant="outline"
        onPress={() => {}}
        style={styles.linkedinButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 24,
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
  statsContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: '80%',
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  inputField: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 13,
  },
  achievementBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  linkedinButton: {
    marginTop: 8,
  },
});
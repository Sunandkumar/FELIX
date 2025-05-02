import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Target, Check, Users, Trophy, Clock } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { quests, groupChallenges } from '@/data/mockData';

export default function QuestsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('quests');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Networking Quests" />
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'quests' && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('quests')}
        >
          <Target 
            size={20} 
            color={activeTab === 'quests' ? colors.primary : colors.textSecondary} 
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'quests' ? colors.primary : colors.textSecondary },
            ]}
          >
            Individual Quests
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'groups' && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('groups')}
        >
          <Users 
            size={20}
            color={activeTab === 'groups' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'groups' ? colors.primary : colors.textSecondary },
            ]}
          >
            Group Challenges
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'quests' ? (
        <ScrollView
          style={styles.questsContainer}
          contentContainerStyle={styles.questsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: colors.primaryLight }]}>
                  <Check size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.statValue, { color: colors.text }]}>8</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Completed
                  </Text>
                </View>
              </View>
            </Card>
            
            <Card style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: colors.accentLight }]}>
                  <Trophy size={20} color={colors.accent} />
                </View>
                <View>
                  <Text style={[styles.statValue, { color: colors.text }]}>580</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                    Points
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Networking Bingo
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
              Connect with diverse alumni to complete the challenges
            </Text>
            
            <View style={styles.bingoGrid}>
              {quests.map((quest, index) => (
                <TouchableOpacity
                  key={quest.id}
                  style={[
                    styles.bingoCard,
                    quest.completed && { 
                      backgroundColor: colors.primaryLight,
                      borderColor: colors.primary 
                    },
                  ]}
                  onPress={() => router.push('/directory')}
                >
                  {quest.completed ? (
                    <Check size={24} color={colors.primary} />
                  ) : (
                    <Text 
                      style={[
                        styles.bingoValue, 
                        { color: quest.completed ? colors.primary : colors.text }
                      ]}
                    >
                      {quest.points}
                    </Text>
                  )}
                  <Text 
                    style={[
                      styles.bingoDesc, 
                      { color: quest.completed ? colors.primary : colors.text }
                    ]}
                  >
                    {quest.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <Text style={[styles.rewardsTitle, { color: colors.text }]}>
            Rewards Available
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.rewardsContainer}
            contentContainerStyle={styles.rewardsContent}
          >
            <Card style={styles.rewardCard}>
              <View style={[styles.rewardBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.rewardPoints}>500 pts</Text>
              </View>
              <Text style={[styles.rewardTitle, { color: colors.text }]}>
                Coffee Chat with CEO
              </Text>
              <Text style={[styles.rewardDesc, { color: colors.textSecondary }]}>
                30-minute coffee chat with the CEO of a leading company
              </Text>
            </Card>
            
            <Card style={styles.rewardCard}>
              <View style={[styles.rewardBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.rewardPoints}>750 pts</Text>
              </View>
              <Text style={[styles.rewardTitle, { color: colors.text }]}>
                Mentorship Session
              </Text>
              <Text style={[styles.rewardDesc, { color: colors.textSecondary }]}>
                One-hour mentorship with an industry leader
              </Text>
            </Card>
            
            <Card style={styles.rewardCard}>
              <View style={[styles.rewardBadge, { backgroundColor: colors.error }]}>
                <Text style={styles.rewardPoints}>1000 pts</Text>
              </View>
              <Text style={[styles.rewardTitle, { color: colors.text }]}>
                VIP Dinner Invite
              </Text>
              <Text style={[styles.rewardDesc, { color: colors.textSecondary }]}>
                Exclusive dinner with the alumni board
              </Text>
            </Card>
          </ScrollView>
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.groupsContainer}
          contentContainerStyle={styles.groupsContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Active Group Challenges
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Complete group challenges to earn bonus points
          </Text>
          
          {groupChallenges.filter(challenge => !challenge.completed).map((challenge) => (
            <Card key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeContent}>
                <View style={styles.challengeHeader}>
                  <View style={[styles.challengeIcon, { backgroundColor: colors.primaryLight }]}>
                    <Users size={20} color={colors.primary} />
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={[styles.challengeTitle, { color: colors.text }]}>
                      {challenge.title}
                    </Text>
                    <Text style={[styles.challengeTeam, { color: colors.primary }]}>
                      Team: {challenge.team}
                    </Text>
                  </View>
                  <View style={[styles.challengePoints, { backgroundColor: colors.accentLight }]}>
                    <Text style={[styles.challengePointsText, { color: colors.accent }]}>
                      {challenge.points} pts
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>
                  {challenge.description}
                </Text>
                
                <View style={styles.challengeFooter}>
                  <View style={[styles.timeRemaining, { backgroundColor: colors.errorLight }]}>
                    <Clock size={16} color={colors.error} />
                    <Text style={[styles.timeText, { color: colors.error }]}>
                      Expires in {challenge.timeRemaining}
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.viewButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push('/(modals)/group-challenge')}
                  >
                    <Text style={styles.viewButtonText}>View Challenge</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
          
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
            Completed Challenges
          </Text>
          
          {groupChallenges.filter(challenge => challenge.completed).map((challenge) => (
            <Card key={challenge.id} style={[styles.challengeCard, styles.completedCard]}>
              <View style={styles.challengeContent}>
                <View style={styles.challengeHeader}>
                  <View style={[styles.challengeIcon, { backgroundColor: colors.successLight }]}>
                    <Check size={20} color={colors.success} />
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={[styles.challengeTitle, { color: colors.text }]}>
                      {challenge.title}
                    </Text>
                    <Text style={[styles.challengeTeam, { color: colors.success }]}>
                      Completed with Team {challenge.team}
                    </Text>
                  </View>
                  <View style={[styles.challengePoints, { backgroundColor: colors.successLight }]}>
                    <Text style={[styles.challengePointsText, { color: colors.success }]}>
                      {challenge.points} pts
                    </Text>
                  </View>
                </View>
                
                <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>
                  {challenge.description}
                </Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  questsContainer: {
    flex: 1,
  },
  questsContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 24,
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
  bingoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bingoCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  bingoValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  bingoDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  rewardsContainer: {
    marginBottom: 24,
  },
  rewardsContent: {
    paddingRight: 16,
  },
  rewardCard: {
    width: 200,
    padding: 16,
    marginRight: 12,
  },
  rewardBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  rewardPoints: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  rewardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  groupsContainer: {
    flex: 1,
  },
  groupsContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  challengeCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  completedCard: {
    opacity: 0.8,
  },
  challengeContent: {
    padding: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  challengeTeam: {
    fontSize: 14,
    fontWeight: '500',
  },
  challengePoints: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  challengePointsText: {
    fontWeight: '600',
    fontSize: 14,
  },
  challengeDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  challengeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRemaining: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
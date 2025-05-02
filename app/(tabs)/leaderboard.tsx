import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Trophy, Medal, Users, Filter } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { leaderboard } from '@/data/mockData';

export default function LeaderboardScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('overall');
  const [topUsers, ...restUsers] = leaderboard;

  const getLeaderboardData = () => {
    if (filter === 'overall') {
      return leaderboard;
    } else if (filter === 'batch') {
      return leaderboard.filter(user => user.batch === '2020');
    } else {
      return leaderboard.filter(user => user.industry === filter);
    }
  };

  const filteredUsers = getLeaderboardData();
  const topThree = filteredUsers.slice(0, 3);
  const remainingUsers = filteredUsers.slice(3);

  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return colors.textSecondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Leaderboard" />
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'overall' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('overall')}
        >
          <Trophy size={16} color={filter === 'overall' ? '#fff' : colors.textSecondary} />
          <Text
            style={[
              styles.filterChipText,
              { color: filter === 'overall' ? '#fff' : colors.textSecondary },
            ]}
          >
            Overall
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'batch' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('batch')}
        >
          <Users size={16} color={filter === 'batch' ? '#fff' : colors.textSecondary} />
          <Text
            style={[
              styles.filterChipText,
              { color: filter === 'batch' ? '#fff' : colors.textSecondary },
            ]}
          >
            My Batch
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'Finance' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('Finance')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filter === 'Finance' ? '#fff' : colors.textSecondary },
            ]}
          >
            Finance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'Technology' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('Technology')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filter === 'Technology' ? '#fff' : colors.textSecondary },
            ]}
          >
            Technology
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            filter === 'Consulting' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilter('Consulting')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filter === 'Consulting' ? '#fff' : colors.textSecondary },
            ]}
          >
            Consulting
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <View style={[styles.topThreeContainer, { backgroundColor: colors.card }]}>
        {topThree.map((user, index) => (
          <View 
            key={user.id} 
            style={[
              styles.podiumItem,
              index === 0 ? styles.firstPlace : null,
              index === 0 ? { top: 0 } : null,
              index === 1 ? { right: 10 } : null,
              index === 2 ? { left: 10 } : null,
            ]}
          >
            <View 
              style={[
                styles.podiumRank, 
                { 
                  backgroundColor: getMedalColor(index + 1),
                  borderColor: colors.card 
                }
              ]}
            >
              <Text style={styles.podiumRankText}>{index + 1}</Text>
            </View>
            
            <Image
              source={{ uri: user.photo }}
              style={styles.podiumAvatar}
              contentFit="cover"
            />
            
            <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
              {user.name}
            </Text>
            
            <View style={[styles.podiumPoints, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.podiumPointsText, { color: colors.primary }]}>
                {user.points} pts
              </Text>
            </View>
          </View>
        ))}
        
        <View style={styles.podiumBase}>
          <View style={[styles.podiumSecond, { backgroundColor: colors.primaryLight }]} />
          <View style={[styles.podiumFirst, { backgroundColor: colors.primary }]} />
          <View style={[styles.podiumThird, { backgroundColor: colors.primaryLight }]} />
        </View>
      </View>
      
      <ScrollView
        style={styles.rankingsList}
        contentContainerStyle={styles.rankingsContent}
        showsVerticalScrollIndicator={false}
      >
        {remainingUsers.map((user, index) => (
          <Card key={user.id} style={styles.rankingCard}>
            <View style={styles.rankingContent}>
              <View style={styles.rankingLeft}>
                <View 
                  style={[
                    styles.rankingNumber, 
                    { backgroundColor: colors.primaryLight }
                  ]}
                >
                  <Text style={[styles.rankingNumberText, { color: colors.primary }]}>
                    {index + 4}
                  </Text>
                </View>
                
                <Image
                  source={{ uri: user.photo }}
                  style={styles.rankingAvatar}
                  contentFit="cover"
                />
                
                <View style={styles.rankingInfo}>
                  <Text style={[styles.rankingName, { color: colors.text }]}>
                    {user.name}
                  </Text>
                  <View style={styles.rankingTags}>
                    <View style={[styles.rankingTag, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[styles.rankingTagText, { color: colors.primary }]}>
                        {user.batch}
                      </Text>
                    </View>
                    <View style={[styles.rankingTag, { backgroundColor: colors.accentLight }]}>
                      <Text style={[styles.rankingTagText, { color: colors.accent }]}>
                        {user.industry}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.rankingPoints, { color: colors.text }]}>
                {user.points}
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}> pts</Text>
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    gap: 6,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  topThreeContainer: {
    height: 200,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  podiumItem: {
    position: 'absolute',
    alignItems: 'center',
    width: 90,
    bottom: 60,
  },
  firstPlace: {
    alignSelf: 'center',
    bottom: 90,
  },
  podiumRank: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
  },
  podiumRankText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    width: 80,
    textAlign: 'center',
  },
  podiumPoints: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  podiumPointsText: {
    fontSize: 12,
    fontWeight: '600',
  },
  podiumBase: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 20,
  },
  podiumFirst: {
    width: 100,
    height: 50,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  podiumSecond: {
    width: 80,
    height: 35,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginRight: 8,
  },
  podiumThird: {
    width: 80,
    height: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginLeft: 8,
  },
  rankingsList: {
    flex: 1,
  },
  rankingsContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  rankingCard: {
    marginBottom: 8,
    padding: 0,
  },
  rankingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankingNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankingNumberText: {
    fontWeight: '600',
    fontSize: 14,
  },
  rankingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  rankingTags: {
    flexDirection: 'row',
    gap: 6,
  },
  rankingTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rankingTagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rankingPoints: {
    fontSize: 16,
    fontWeight: '700',
  },
});
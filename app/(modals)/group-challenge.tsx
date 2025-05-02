import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Users, Camera, Clock, CircleCheck as CheckCircle, X, Upload, Award } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/Button';

const GROUP_CHALLENGE_STAGES = {
  DETAILS: 'details',
  UPLOAD: 'upload',
  VERIFICATION: 'verification',
  COMPLETED: 'completed',
};

// Mock group challenge data
const groupChallenge = {
  id: '1',
  name: 'Team Alpha',
  challenge: 'Take a group photo at the main entrance',
  description: 'Gather all team members at the main entrance and take a photo together to complete this challenge.',
  points: 200,
  members: [
    {
      id: '1',
      name: 'Joshua Wilson',
      photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      isCurrentUser: true,
    },
    {
      id: '2',
      name: 'Emily Johnson',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      id: '3',
      name: 'Michael Smith',
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    {
      id: '4',
      name: 'Sarah Brown',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
    {
      id: '5',
      name: 'David Lee',
      photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
  ],
  expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
};

export default function GroupChallengeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [stage, setStage] = useState(GROUP_CHALLENGE_STAGES.DETAILS);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [verifiedMembers, setVerifiedMembers] = useState([groupChallenge.members[0].id]);
  
  const formatTimeRemaining = () => {
    const now = new Date();
    const diff = groupChallenge.expiresAt - now;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };
  
  const handleUploadPhoto = () => {
    // In a real app, this would open the camera or photo picker
    // For this demo, we'll just simulate an uploaded photo
    setUploadedPhoto('https://images.pexels.com/photos/1157940/pexels-photo-1157940.jpeg');
    setStage(GROUP_CHALLENGE_STAGES.UPLOAD);
  };
  
  const handleVerify = () => {
    setStage(GROUP_CHALLENGE_STAGES.VERIFICATION);
  };
  
  // Mock verification function
  const verifyMember = (memberId) => {
    if (!verifiedMembers.includes(memberId)) {
      const updatedVerified = [...verifiedMembers, memberId];
      setVerifiedMembers(updatedVerified);
      
      // Check if all members have verified
      if (updatedVerified.length === groupChallenge.members.length) {
        setTimeout(() => {
          setStage(GROUP_CHALLENGE_STAGES.COMPLETED);
        }, 500);
      }
    }
  };
  
  const closeModal = () => {
    router.back();
  };
  
  const renderStageContent = () => {
    switch (stage) {
      case GROUP_CHALLENGE_STAGES.DETAILS:
        return (
          <View style={styles.stageContainer}>
            <View style={styles.challengeHeader}>
              <View style={[styles.teamBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.teamBadgeText}>{groupChallenge.name}</Text>
              </View>
              
              <Text style={[styles.challengeTitle, { color: colors.text }]}>
                {groupChallenge.challenge}
              </Text>
              
              <Text style={[styles.challengeDescription, { color: colors.textSecondary }]}>
                {groupChallenge.description}
              </Text>
              
              <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Clock size={20} color={colors.error} />
                    <Text style={[styles.infoText, { color: colors.text }]}>
                      {formatTimeRemaining()} left
                    </Text>
                  </View>
                  
                  <View style={styles.infoItem}>
                    <Award size={20} color={colors.accent} />
                    <Text style={[styles.infoText, { color: colors.text }]}>
                      {groupChallenge.points} points
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.teamSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Team Members
              </Text>
              
              <View style={styles.membersList}>
                {groupChallenge.members.map((member) => (
                  <View key={member.id} style={styles.memberItem}>
                    <Image
                      source={{ uri: member.photo }}
                      style={styles.memberAvatar}
                      contentFit="cover"
                    />
                    <Text 
                      style={[
                        styles.memberName, 
                        { color: colors.text },
                        member.isCurrentUser && { fontWeight: '700' },
                      ]}
                    >
                      {member.name}
                      {member.isCurrentUser && ' (You)'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <Button
              title="Take Group Photo"
              onPress={handleUploadPhoto}
              icon={<Camera size={20} color="#fff" />}
              style={styles.actionButton}
            />
          </View>
        );
        
      case GROUP_CHALLENGE_STAGES.UPLOAD:
        return (
          <View style={styles.stageContainer}>
            <Text style={[styles.uploadTitle, { color: colors.text }]}>
              Group Photo
            </Text>
            
            <View style={[styles.photoContainer, { backgroundColor: colors.card }]}>
              {uploadedPhoto ? (
                <Image
                  source={{ uri: uploadedPhoto }}
                  style={styles.uploadedPhoto}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Upload size={40} color={colors.primary} />
                  <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                    Tap to upload a photo
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.photoInstructions, { color: colors.textSecondary }]}>
              Make sure all {groupChallenge.members.length} team members are visible in the photo
            </Text>
            
            {uploadedPhoto && (
              <Button
                title="Verify with Team Members"
                onPress={handleVerify}
                style={styles.actionButton}
              />
            )}
            
            {!uploadedPhoto && (
              <Button
                title="Take Another Photo"
                onPress={handleUploadPhoto}
                variant="outline"
                style={styles.actionButton}
              />
            )}
          </View>
        );
        
      case GROUP_CHALLENGE_STAGES.VERIFICATION:
        return (
          <View style={styles.stageContainer}>
            <Text style={[styles.verificationTitle, { color: colors.text }]}>
              Team Verification
            </Text>
            <Text style={[styles.verificationSubtitle, { color: colors.textSecondary }]}>
              Each team member needs to confirm their participation
            </Text>
            
            <View style={[styles.photoContainer, { backgroundColor: colors.card, height: 180 }]}>
              <Image
                source={{ uri: uploadedPhoto }}
                style={styles.verificationPhoto}
                contentFit="cover"
              />
            </View>
            
            <Text style={[styles.verificationStatus, { color: colors.text }]}>
              {verifiedMembers.length} of {groupChallenge.members.length} verified
            </Text>
            
            <View style={styles.verificationList}>
              {groupChallenge.members.map((member) => {
                const isVerified = verifiedMembers.includes(member.id);
                return (
                  <View 
                    key={member.id} 
                    style={[
                      styles.verificationItem,
                      { backgroundColor: colors.card }
                    ]}
                  >
                    <View style={styles.verificationMember}>
                      <Image
                        source={{ uri: member.photo }}
                        style={styles.verificationAvatar}
                        contentFit="cover"
                      />
                      <Text style={[styles.verificationName, { color: colors.text }]}>
                        {member.name}
                        {member.isCurrentUser && ' (You)'}
                      </Text>
                    </View>
                    
                    {isVerified ? (
                      <View 
                        style={[
                          styles.verifiedBadge, 
                          { backgroundColor: colors.successLight }
                        ]}
                      >
                        <CheckCircle size={16} color={colors.success} />
                        <Text style={[styles.verifiedText, { color: colors.success }]}>
                          Verified
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.verifyButton,
                          { backgroundColor: colors.primary }
                        ]}
                        onPress={() => verifyMember(member.id)}
                        disabled={member.isCurrentUser}
                      >
                        <Text style={styles.verifyButtonText}>
                          Verify
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
            
            <Text style={[styles.verificationNote, { color: colors.textSecondary }]}>
              In a real app, each member would verify using their own device
            </Text>
          </View>
        );
        
      case GROUP_CHALLENGE_STAGES.COMPLETED:
        return (
          <View style={styles.stageContainer}>
            <View style={styles.completedContainer}>
              <View 
                style={[
                  styles.completedIcon, 
                  { backgroundColor: colors.primaryLight }
                ]}
              >
                <CheckCircle size={40} color={colors.primary} />
              </View>
              
              <Text style={[styles.completedTitle, { color: colors.text }]}>
                Challenge Complete!
              </Text>
              
              <Text style={[styles.completedSubtitle, { color: colors.textSecondary }]}>
                Your team has successfully completed the challenge
              </Text>
              
              <View 
                style={[
                  styles.photoContainer, 
                  { backgroundColor: colors.card, height: 180, marginVertical: 24 }
                ]}
              >
                <Image
                  source={{ uri: uploadedPhoto }}
                  style={styles.verificationPhoto}
                  contentFit="cover"
                />
              </View>
              
              <View 
                style={[
                  styles.pointsCard, 
                  { backgroundColor: colors.card }
                ]}
              >
                <Award size={24} color={colors.accent} />
                <Text style={[styles.pointsEarned, { color: colors.text }]}>
                  +{groupChallenge.points} points
                </Text>
                <Text style={[styles.pointsDetails, { color: colors.textSecondary }]}>
                  Each team member receives the same points
                </Text>
              </View>
            </View>
            
            <Button
              title="Return to Quests"
              onPress={closeModal}
              style={styles.actionButton}
            />
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={closeModal}
        >
          {stage === GROUP_CHALLENGE_STAGES.COMPLETED ? (
            <X size={24} color={colors.text} />
          ) : (
            <ArrowLeft size={24} color={colors.text} />
          )}
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {stage === GROUP_CHALLENGE_STAGES.DETAILS 
            ? 'Group Challenge' 
            : stage === GROUP_CHALLENGE_STAGES.UPLOAD
              ? 'Upload Photo'
              : stage === GROUP_CHALLENGE_STAGES.VERIFICATION
                ? 'Verification'
                : 'Success'}
        </Text>
        
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderStageContent()}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
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
  },
  headerRight: {
    width: 40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  stageContainer: {
    flex: 1,
    minHeight: 500,
  },
  challengeHeader: {
    marginBottom: 24,
  },
  teamBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  teamBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  challengeTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  teamSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  memberItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberName: {
    fontSize: 14,
    flex: 1,
  },
  actionButton: {
    marginTop: 'auto',
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  photoContainer: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 16,
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
  },
  photoInstructions: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  verificationSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  verificationPhoto: {
    width: '100%',
    height: '100%',
  },
  verificationStatus: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
  },
  verificationList: {
    gap: 8,
    marginBottom: 24,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  verificationMember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  verificationName: {
    fontSize: 14,
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  verifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  verificationNote: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
  completedContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  completedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  pointsCard: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  pointsEarned: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  pointsDetails: {
    fontSize: 14,
    textAlign: 'center',
  },
});
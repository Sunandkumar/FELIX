import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Search, Filter, UserPlus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { supabase } from '@/lib/supabase';

interface Connection {
  id: string;
  name: string;
  photo: string;
  title: string;
  company: string;
  batch: string;
  industry: string;
}

export default function DirectoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
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
        .select('id, name, photo, title, company, batch, industry');

      if (fetchError) throw fetchError;

      setConnections(data || []);
      setFilteredConnections(data || []);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredConnections(connections);
    } else {
      const filtered = connections.filter(
        person => 
          person.name.toLowerCase().includes(text.toLowerCase()) ||
          person.title?.toLowerCase().includes(text.toLowerCase()) ||
          person.company?.toLowerCase().includes(text.toLowerCase()) ||
          person.batch?.toLowerCase().includes(text.toLowerCase()) ||
          person.industry?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredConnections(filtered);
    }
  };

  const filterByCategory = (category: string) => {
    setActiveFilter(category);
    let filtered = [...connections];

    switch (category) {
      case 'all':
        setFilteredConnections(connections);
        break;
      case 'recommended':
        // You can implement recommendation logic here
        setFilteredConnections(filtered.slice(0, 5));
        break;
      case 'recentlyMet':
        // You can implement recently met logic here
        setFilteredConnections(filtered.slice(0, 3));
        break;
      case 'sameIndustry':
        // You can implement same industry logic here
        filtered = connections.filter(person => person.industry === 'Technology');
        setFilteredConnections(filtered);
        break;
      default:
        setFilteredConnections(connections);
    }
  };

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Alumni Directory" />
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
      <Header title="Alumni Directory" />
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name, title, or batch..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => filterByCategory('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: activeFilter === 'all' ? colors.white : colors.textSecondary },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'recommended' && { backgroundColor: colors.primary },
          ]}
          onPress={() => filterByCategory('recommended')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: activeFilter === 'recommended' ? colors.white : colors.textSecondary },
            ]}
          >
            Recommended
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'recentlyMet' && { backgroundColor: colors.primary },
          ]}
          onPress={() => filterByCategory('recentlyMet')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: activeFilter === 'recentlyMet' ? colors.white : colors.textSecondary },
            ]}
          >
            Recently Met
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'sameIndustry' && { backgroundColor: colors.primary },
          ]}
          onPress={() => filterByCategory('sameIndustry')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: activeFilter === 'sameIndustry' ? colors.white : colors.textSecondary },
            ]}
          >
            Same Industry
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <ScrollView
        style={styles.directoryList}
        contentContainerStyle={styles.directoryContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading connections...
            </Text>
          </View>
        ) : filteredConnections.length > 0 ? (
          filteredConnections.map((person) => (
            <Card key={person.id} style={styles.alumniCard}>
              <View style={styles.alumniCardContent}>
                <TouchableOpacity
                  style={styles.alumniInfo}
                  onPress={() => router.push(`/directory/${person.id}`)}
                >
                  <Image
                    source={{ uri: person.photo }}
                    style={styles.alumniAvatar}
                    contentFit="cover"
                  />
                  
                  <View style={styles.alumniDetails}>
                    <Text style={[styles.alumniName, { color: colors.text }]}>
                      {person.name}
                    </Text>
                    <Text style={[styles.alumniRole, { color: colors.textSecondary }]}>
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
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.connectButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.push({
                    pathname: '/(modals)/quest-mode',
                    params: { userId: person.id }
                  })}
                >
                  <UserPlus size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.noResults}>
            <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
              {searchQuery ? `No results found for "${searchQuery}"` : 'No connections available'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  directoryList: {
    flex: 1,
  },
  directoryContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  alumniCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
  },
  alumniCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  alumniInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  alumniAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  alumniDetails: {
    flex: 1,
  },
  alumniName: {
    fontSize: 16,
    fontWeight: '600',
  },
  alumniRole: {
    fontSize: 14,
    marginBottom: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  connectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  noResults: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noResultsText: {
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
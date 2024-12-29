import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useClickCount } from '../contexts/ClickCountContext';

export default function HomePage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { username } = route.params || { username: 'User' };
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { clickCount, incrementClickCount , resetClickCount } = useClickCount();

  // Add logout handler
  const handleLogout = async () => {
    try {
      // Stop playing music if any is playing
      if (sound) {
        await sound.unloadAsync();
      }
      // Clear user data
      await AsyncStorage.clear();
      // Reset click count
    resetClickCount();
      // Navigate to Login
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // Fetch data from Deezer API
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('https://api.deezer.com/chart?limit=30&@offset=30&api_version=2.0');

        const data = await response.json();
        if (data.tracks && data.tracks.data) {
          setTracks(data.tracks.data);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Function to handle playing audio
  const handlePlayPause = async (track) => {
    // If the same track is being played, toggle play/pause
    if (currentTrackId === track.id) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
      return;
    }

    // If a different track is selected
    try {
      // Unload the current sound if it exists
      if (sound) {
        await sound.unloadAsync();
      }

      // Load and play the new track
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.preview },
        { shouldPlay: true }
      );

      // Set up status update callback
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          // Track finished playing
          setIsPlaying(false);
          await newSound.unloadAsync();
          setSound(null);
          setCurrentTrackId(null);
        }
      });

      setSound(newSound);
      setCurrentTrackId(track.id);
      setIsPlaying(true);

      // Increment the play count only when a song is started
    incrementClickCount();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  // Render individual track item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: item.album.cover_medium }} 
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{item.artist.name}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.statusTag}>
            {item.rank ? `Rank #${item.rank}` : 'Popular'}
          </Text>
          <TouchableOpacity 
            style={[
              styles.playButton,
              currentTrackId === item.id && isPlaying && styles.playButtonActive
            ]}
            onPress={() => handlePlayPause(item)}
          >
            <Text style={styles.playButtonText}>
              {currentTrackId === item.id && isPlaying ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.headerContent}>
  
        <View style={styles.headerContent}>
        <TouchableOpacity 
            onPress={() => navigation.navigate('Welcome')} 
            style={styles.arrowContainer}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          {/* <Text>Home</Text>
          <Text style={styles.welcomeText}>Hi {username}</Text> */}
          <Text style={styles.usernameText}>Hi {username}</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>


      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading tracks...</Text>
        </View>
      ) : (
        <FlatList
          data={tracks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tracks available</Text>
          }
        />
      )}

      {/* Floating button */}
      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>{clickCount}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007BFF',
  },
  // welcomeText: {
  //   fontSize: 16,
  //   color: '#fff',
  //   opacity: 0.9,
  // },
  usernameText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'space-between',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusTag: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#8B008B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  playButton: {
    backgroundColor: '#8B008B',
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 20,
  },
  playButtonActive: {
    backgroundColor: '#0056b3',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  header: {
    paddingTop: 60,
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 10,
    backgroundColor: '#8B008B',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: '#8B008B',
    fontSize: 14,
    fontWeight: '600',
  },
  arrowContainer: {
    paddingRight: 10,
    paddingLeft: 0,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8B008B',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
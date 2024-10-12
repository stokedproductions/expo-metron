import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [noteGrouping, setNoteGrouping] = useState(4);
  const [sound, setSound] = useState();
  const [accentSound, setAccentSound] = useState();
  const [currentBeat, setCurrentBeat] = useState(0);

  useEffect(() => {
    loadSounds();
    return () => {
      if (sound) sound.unloadAsync();
      if (accentSound) accentSound.unloadAsync();
    };
  }, []);

  async function loadSounds() {
    const { sound: clickSound } = await Audio.Sound.createAsync(
      require('./assets/click.mp3')
    );
    setSound(clickSound);

    const { sound: accentClickSound } = await Audio.Sound.createAsync(
      require('./assets/accent-click.mp3')
    );
    setAccentSound(accentClickSound);
  }

  useEffect(() => {
    let interval;
    if (isPlaying) {
      const beatDuration = 60000 / tempo;
      interval = setInterval(() => {
        setCurrentBeat((prevBeat) => (prevBeat + 1) % noteGrouping);
        playClick();
      }, beatDuration);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, tempo, noteGrouping]);

  async function playClick() {
    if (currentBeat === 0) {
      await accentSound.replayAsync();
    } else {
      await sound.replayAsync();
    }
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const noteGroupings = [2, 3, 4, 6, 8];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metronome</Text>
      <View style={styles.tempoContainer}>
        <Text style={styles.tempoText}>{tempo} BPM</Text>
        <Slider
          style={styles.slider}
          minimumValue={40}
          maximumValue={240}
          value={tempo}
          onValueChange={setTempo}
          step={1}
        />
      </View>
      <View style={styles.groupingContainer}>
        <Text style={styles.groupingText}>Note Grouping:</Text>
        <View style={styles.groupingButtons}>
          {noteGroupings.map((group) => (
            <TouchableOpacity
              key={group}
              style={[
                styles.groupButton,
                noteGrouping === group && styles.activeGroupButton,
              ]}
              onPress={() => setNoteGrouping(group)}
            >
              <Text style={styles.groupButtonText}>{group}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
        <Text style={styles.playButtonText}>
          {isPlaying ? 'Stop' : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
  },
  tempoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  tempoText: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  groupingContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  groupingText: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
  groupingButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  groupButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeGroupButton: {
    backgroundColor: '#4CAF50',
  },
  groupButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
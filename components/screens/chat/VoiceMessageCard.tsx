import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
  } from 'react-native';
import { BorderRadius, Spacing, Typography } from '@/constants';
import { Colors } from '@/constants/Colors';
import { VoiceMessage } from '@/src/domain/entities/ChatMessage';


interface VoiceMessageCardProps {
  message: VoiceMessage;
  colors: any;
  animationValue?: Animated.Value;
  onPlay: () => void;
  onStop: () => void;
  onRetry: () => void;
}

const VoiceMessageCard: React.FC<VoiceMessageCardProps> = ({ 
  message, 
  colors, 
  animationValue, 
  onPlay, 
  onStop, 
  onRetry 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformAnimation] = useState(new Animated.Value(0));

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveformAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(waveformAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleStop = () => {
    setIsPlaying(false);
    onStop();
    waveformAnimation.stopAnimation();
    waveformAnimation.setValue(0);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        animationValue && {
          opacity: animationValue,
          transform: [{
            translateY: animationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.icon}>🎤</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>
            {message.isUser ? 'Your Voice Message' : 'AI Voice Response'}
          </Text>
          {message.duration && (
            <Text style={[styles.duration, { color: colors.textSecondary }]}>
              {formatDuration(message.duration)}
            </Text>
          )}
        </View>
      </View>

      {message.isRecording && (
        <View style={styles.recordingContainer}>
          <View style={[styles.recordingIndicator, { backgroundColor: colors.error }]} />
          <Text style={[styles.recordingText, { color: colors.error }]}>Recording...</Text>
        </View>
      )}

      {message.transcript && (
        <View style={styles.transcriptContainer}>
          <Text style={[styles.transcriptLabel, { color: colors.textSecondary }]}>Transcript:</Text>
          <Text style={[styles.transcriptText, { color: colors.text }]}>{message.transcript}</Text>
        </View>
      )}

      <View style={styles.controlsContainer}>
        {message.audioUrl ? (
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: colors.primary }]}
              onPress={isPlaying ? handleStop : handlePlay}
              activeOpacity={0.8}
            >
              <Text style={[styles.controlButtonText, { color: colors.surface }]}>
                {isPlaying ? '⏹️' : '▶️'}
              </Text>
            </TouchableOpacity>

            {isPlaying && (
              <View style={styles.waveformContainer}>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <Animated.View
                    key={`waveform-${index}`}
                    style={[
                      styles.waveformBar,
                      {
                        backgroundColor: colors.primary,
                        height: waveformAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [4, 20],
                        }),
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.retryContainer}>
            <Text style={[styles.retryText, { color: colors.textSecondary }]}>
              Audio processing failed
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.background }]}
              onPress={onRetry}
              activeOpacity={0.8}
            >
              <Text style={[styles.retryButtonText, { color: colors.text }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    ...Colors.Elevation.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.body,
    fontWeight: '600',
  },
  duration: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  recordingText: {
    ...Typography.caption,
    fontWeight: '500',
  },
  transcriptContainer: {
    marginBottom: Spacing.md,
  },
  transcriptLabel: {
    ...Typography.caption,
    marginBottom: Spacing.xs,
  },
  transcriptText: {
    ...Typography.body,
    fontStyle: 'italic',
  },
  controlsContainer: {
    alignItems: 'center',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 20,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveformBar: {
    width: 3,
    borderRadius: 1.5,
  },
  retryContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  retryText: {
    ...Typography.caption,
  },
  retryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    ...Typography.body,
    fontWeight: '600',
  },
});

export default VoiceMessageCard;

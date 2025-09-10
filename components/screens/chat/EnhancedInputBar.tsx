import { BorderRadius, Spacing, Typography } from '@/constants';
import { Elevation } from '@/constants/Colors';
import * as DocumentPicker from 'expo-document-picker';
import React, { useRef, useState } from 'react';

import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// import * as ImagePicker from 'expo-image-picker';

interface EnhancedInputBarProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: () => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  onImageUpload: (imageUri: string) => void;
  onFileUpload: (fileUri: string) => void;
  colors: any;
  isLoading: boolean;
}

const EnhancedInputBar: React.FC<EnhancedInputBarProps> = ({
  inputText,
  setInputText,
  onSend,
  onVoiceStart,
  onVoiceStop,
  onImageUpload,
  onFileUpload,
  colors,
  isLoading,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const attachmentAnimation = useRef(new Animated.Value(0)).current;

  const toggleAttachments = () => {
    const toValue = showAttachments ? 0 : 1;
    Animated.timing(attachmentAnimation, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setShowAttachments(!showAttachments);
  };

  const handleVoicePress = () => {
    if (isRecording) {
      setIsRecording(false);
      onVoiceStop();
    } else {
      setIsRecording(true);
      onVoiceStart();
    }
  };

  const handleImagePicker = async () => {
    // Temporarily disabled due to native module issues
    Alert.alert(
      'Coming Soon',
      'Image picker functionality will be available soon.'
    );
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (status !== 'granted') {
    //   Alert.alert(
    //     'Permission required',
    //     'Please grant camera roll permissions to upload images.'
    //   );
    //   return;
    // }

    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 3],
    //   quality: 0.8,
    // });

    // if (!result.canceled && result.assets[0]) {
    //   onImageUpload(result.assets[0].uri);
    // }
  };

  const handleDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      onFileUpload(result.assets[0].uri);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderTopColor: colors.background },
      ]}
    >
      {showAttachments && (
        <Animated.View
          style={[
            styles.attachmentPanel,
            { backgroundColor: colors.background },
            {
              opacity: attachmentAnimation,
              transform: [
                {
                  translateY: attachmentAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.attachmentButton,
              { backgroundColor: colors.surface },
            ]}
            onPress={handleImagePicker}
            activeOpacity={0.7}
          >
            <Text style={styles.attachmentIcon}>📷</Text>
            <Text style={[styles.attachmentText, { color: colors.text }]}>
              Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.attachmentButton,
              { backgroundColor: colors.surface },
            ]}
            onPress={handleDocumentPicker}
            activeOpacity={0.7}
          >
            <Text style={styles.attachmentIcon}>📄</Text>
            <Text style={[styles.attachmentText, { color: colors.text }]}>
              Document
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.attachmentButton,
              { backgroundColor: colors.surface },
            ]}
            onPress={handleVoicePress}
            activeOpacity={0.7}
          >
            <Text style={styles.attachmentIcon}>🎤</Text>
            <Text style={[styles.attachmentText, { color: colors.text }]}>
              Voice
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={styles.inputWrapper}>
        <TouchableOpacity
          style={[
            styles.attachmentToggle,
            { backgroundColor: colors.background },
          ]}
          onPress={toggleAttachments}
          activeOpacity={0.7}
        >
          <Text style={styles.attachmentToggleIcon}>+</Text>
        </TouchableOpacity>

        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: colors.background,
              backgroundColor: colors.background,
              color: colors.text,
            },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={1000}
          editable={!isLoading}
          onSubmitEditing={onSend}
          blurOnSubmit={false}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: colors.primary },
            (!inputText.trim() || isLoading) && [
              styles.sendButtonDisabled,
              { backgroundColor: colors.textSecondary },
            ],
          ]}
          onPress={onSend}
          disabled={!inputText.trim() || isLoading}
          activeOpacity={0.7}
        >
          <Text style={[styles.sendButtonText, { color: colors.surface }]}>
            →
          </Text>
        </TouchableOpacity>
      </View>

      {isRecording && (
        <View
          style={[styles.recordingIndicator, { backgroundColor: colors.error }]}
        >
          <View style={styles.recordingDot} />
          <Text style={[styles.recordingText, { color: colors.surface }]}>
            Recording...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
  },
  attachmentPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  attachmentButton: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 80,
  },
  attachmentIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  attachmentText: {
    ...Typography.caption,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachmentToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  attachmentToggleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    maxHeight: 120,
    marginRight: Spacing.md,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.card,
  },
  sendButtonDisabled: {
    ...Elevation.card,
  },
  sendButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: Spacing.sm,
  },
  recordingText: {
    ...Typography.caption,
    fontWeight: '500',
  },
});

export default EnhancedInputBar;

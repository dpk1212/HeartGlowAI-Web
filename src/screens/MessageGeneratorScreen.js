import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
  Clipboard,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateMessage, isApiKeyAvailable } from '../services/openai';
import { auth } from '../services/firebase';
import { saveMessage } from '../services/messageHistory';
import TemplatesSection from '../components/TemplatesSection';
import { COLORS, RELATIONSHIP_TYPES } from '../config/constants';
import FeedbackModal from '../components/FeedbackModal';

const MessageGeneratorScreen = ({ user }) => {
  const [scenario, setScenario] = useState('');
  const [relationshipType, setRelationshipType] = useState(RELATIONSHIP_TYPES[0]);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [apiKeyAvailable, setApiKeyAvailable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // Check if OpenAI API key is available
  useEffect(() => {
    const checkApiKey = async () => {
      const hasApiKey = await isApiKeyAvailable();
      setApiKeyAvailable(hasApiKey);
      
      if (!hasApiKey) {
        Alert.alert(
          'API Key Required',
          'You need to add your OpenAI API key in settings before generating messages.',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ]
        );
      }
    };
    
    checkApiKey();
  }, []);

  const handleGenerateMessage = async () => {
    if (!scenario) {
      Alert.alert('Error', 'Please enter a communication scenario');
      return;
    }

    if (!apiKeyAvailable) {
      Alert.alert(
        'API Key Required',
        'You need to add your OpenAI API key in settings before generating messages.'
      );
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const message = await generateMessage(scenario, relationshipType);
      setGeneratedMessage(message);
      
      // Increment message count and check if we should show feedback
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      
      if (newCount === 3) {
        setShowFeedback(true);
      }
      
      // Save message to history
      try {
        setIsSaving(true);
        await saveMessage(scenario, relationshipType, message);
        setSavedSuccess(true);
      } catch (saveError) {
        console.error('Error saving message to history:', saveError);
      } finally {
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Message generation error:', error);
      let errorMessage = 'Failed to generate message.';
      
      if (error.response && error.response.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please check your API key in settings.';
      } else if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `OpenAI error: ${error.response.data.error.message}`;
      } else if (error.message.includes('API key not found')) {
        errorMessage = 'OpenAI API key not found. Please add it in settings.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = () => {
    if (generatedMessage) {
      Clipboard.setString(generatedMessage);
      Alert.alert('Success', 'Message copied to clipboard');
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleTemplateSelect = (templateScenario) => {
    setScenario(templateScenario);
    setShowInput(true);
  };

  const handleStartConversation = () => {
    setShowInput(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/heart-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>HeartGlowAI</Text>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {!showInput && !generatedMessage ? (
          <>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartConversation}
            >
              <Text style={styles.startButtonText}>Start a New Conversation</Text>
            </TouchableOpacity>
            
            <TemplatesSection onSelectTemplate={handleTemplateSelect} />
          </>
        ) : (
          <>
            <Text style={styles.label}>Communication Scenario</Text>
            <TextInput
              style={styles.input}
              placeholder="Describe your communication needs..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
              value={scenario}
              onChangeText={setScenario}
            />

            <Text style={styles.label}>Relationship Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={relationshipType}
                onValueChange={(itemValue) => setRelationshipType(itemValue)}
                style={styles.picker}
                dropdownIconColor={COLORS.text}
              >
                {RELATIONSHIP_TYPES.map((type) => (
                  <Picker.Item key={type} label={type} value={type} color={COLORS.text} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={[
                styles.generateButton,
                (!apiKeyAvailable || loading) && styles.disabledButton
              ]}
              onPress={handleGenerateMessage}
              disabled={!apiKeyAvailable || loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <Text style={styles.generateButtonText}>Generate Message</Text>
              )}
            </TouchableOpacity>
            
            {!apiKeyAvailable && (
              <Text style={styles.apiKeyWarning}>
                OpenAI API key required. Please add it in your settings.
              </Text>
            )}
          </>
        )}

        {generatedMessage ? (
          <View style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageLabel}>Your Generated Message:</Text>
              {isSaving && <ActivityIndicator size="small" color={COLORS.primary} />}
              {savedSuccess && (
                <View style={styles.savedBadge}>
                  <Text style={styles.savedText}>Saved</Text>
                </View>
              )}
            </View>
            <Text style={styles.messageText}>{generatedMessage}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyMessage}>
              <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <FeedbackModal
        visible={showFeedback}
        onClose={handleCloseFeedback}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBackground,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  signOutButton: {
    padding: 5,
  },
  signOutText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  startButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    color: COLORS.text,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  pickerContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    color: COLORS.text,
    height: 50,
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: `${COLORS.primary}66`, // Add opacity
  },
  generateButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  apiKeyWarning: {
    color: COLORS.accent1,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  messageContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  savedBadge: {
    backgroundColor: COLORS.accent2 + '33',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  savedText: {
    color: COLORS.accent2,
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  copyButton: {
    backgroundColor: `${COLORS.primary}33`, // Add transparency
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  copyButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MessageGeneratorScreen; 
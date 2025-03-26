import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMessageHistory, deleteMessage } from '../services/messageHistory';
import { COLORS } from '../config/constants';
import { Icon } from 'react-native-elements';

const HistoryScreen = ({ onBack, onSelectMessage }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const history = await getMessageHistory(20);
      setMessages(history);
    } catch (error) {
      console.error('Error loading message history:', error);
      Alert.alert('Error', 'Failed to load message history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMessages();
  };

  const handleSelectMessage = (message) => {
    if (onSelectMessage) {
      onSelectMessage(message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    // Ask for confirmation
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(messageId);
              await deleteMessage(messageId);
              // Remove from local state
              setMessages(prevMessages => 
                prevMessages.filter(msg => msg.id !== messageId)
              );
            } catch (error) {
              console.error('Error deleting message:', error);
              Alert.alert('Error', 'Failed to delete message');
            } finally {
              setDeleting(null);
            }
          }
        }
      ]
    );
  };

  const formatDate = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = now - date;
    const day = 24 * 60 * 60 * 1000;
    
    if (diff < day) {
      return 'Today';
    } else if (diff < 2 * day) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageCard}
      onPress={() => handleSelectMessage(item)}
    >
      <View style={styles.messageHeader}>
        <Text style={styles.relationshipType}>{item.relationshipType}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
      
      <Text style={styles.scenario} numberOfLines={1}>
        {item.scenario}
      </Text>
      
      <Text style={styles.message} numberOfLines={2}>
        {item.message}
      </Text>
      
      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteMessage(item.id)}
          disabled={deleting === item.id}
        >
          {deleting === item.id ? (
            <ActivityIndicator size="small" color={COLORS.accent1} />
          ) : (
            <Icon name="delete-outline" type="material" size={20} color={COLORS.accent1} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" type="material" color={COLORS.text} size={24} />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/heart-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Message History</Text>
        </View>
        
        <View style={{ width: 40 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="history" type="material" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No message history yet</Text>
          <Text style={styles.emptySubtext}>
            Generate messages to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
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
  backButton: {
    width: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.text,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  messageCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  relationshipType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scenario: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  deleteButton: {
    padding: 5,
  },
});

export default HistoryScreen; 
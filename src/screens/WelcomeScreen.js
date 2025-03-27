import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import FeaturesSection from '../components/FeaturesSection';
import { COLORS, APP_INFO } from '../config/constants';

const WelcomeScreen = ({ onStartConversation, onPressAuth }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/heart-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{APP_INFO.name}</Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>
            Say what you feel, the way they'll hear it.
          </Text>
          
          <FeaturesSection />

          <View style={styles.phonePreview}>
            <Image
              source={require('../../assets/heart-logo.png')}
              style={styles.previewLogo}
              resizeMode="contain"
            />
            <View style={styles.progressBar}>
              <View style={styles.progress} />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.authButton}
          onPress={onPressAuth}
        >
          <Text style={styles.authButtonText}>Log in or sign up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  messageContainer: {
    marginBottom: 40,
  },
  messageTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 30,
  },
  phonePreview: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  previewLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  progressBar: {
    width: '50%',
    height: 4,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
  },
  progress: {
    width: '70%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  authButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  authButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 
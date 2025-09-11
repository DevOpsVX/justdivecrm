import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function StudentDashboardScreen() {
  const weatherStatus = 'GREEN'; // Mock data
  const nextClass = '14:30 - Mergulho Avançado';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GREEN': return '#10B981';
      case 'YELLOW': return '#F59E0B';
      case 'RED': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'GREEN': return 'Excelente para mergulho';
      case 'YELLOW': return 'Condições moderadas';
      case 'RED': return 'Mergulho não recomendado';
      default: return 'Status desconhecido';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#0EA5E9', '#0284C7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Bem-vindo à</Text>
          <Text style={styles.titleText}>JUSTDIVE Academy</Text>
          <Text style={styles.subtitleText}>Dashboard do Estudante</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Install App Banner */}
        <View style={styles.installBanner}>
          <Text style={styles.bannerTitle}>📱 Instale o App Mobile</Text>
          <Text style={styles.bannerText}>
            Receba notificações push, widget meteorológico na tela inicial e funcionalidades nativas no seu Android
          </Text>
          <TouchableOpacity style={styles.installButton}>
            <Text style={styles.installButtonText}>Baixar APK</Text>
          </TouchableOpacity>
        </View>

        {/* Weather Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado Meteorológico</Text>
          <View style={styles.weatherContainer}>
            <View 
              style={[
                styles.statusIndicator, 
                { backgroundColor: getStatusColor(weatherStatus) }
              ]} 
            />
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherStatus}>
                {getStatusText(weatherStatus)}
              </Text>
              <Text style={styles.weatherDetails}>
                Temperatura: 22°C • Ondas: 1.2m • Vento: 15km/h
              </Text>
            </View>
          </View>
        </View>

        {/* Next Class Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Próxima Aula</Text>
          <View style={styles.classContainer}>
            <Text style={styles.classTime}>{nextClass}</Text>
            <Text style={styles.classLocation}>Local: Marina da Praia</Text>
            <TouchableOpacity style={styles.classButton}>
              <Text style={styles.classButtonText}>Ver Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Checklist Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Checklist de Equipamentos</Text>
          <View style={styles.checklistContainer}>
            <TouchableOpacity style={styles.checklistItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>Máscara e Snorkel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checklistItem}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.checkText}>Barbatanas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checklistItem}>
              <Text style={styles.checkIcon}>⬜</Text>
              <Text style={styles.checkText}>Roupa de Mergulho</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checklistItem}>
              <Text style={styles.checkIcon}>⬜</Text>
              <Text style={styles.checkText}>Regulador</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checklistItem}>
              <Text style={styles.checkIcon}>⬜</Text>
              <Text style={styles.checkText}>BCD (Colete)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ações Rápidas</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>Agendar Aula</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>Meu Progresso</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📜</Text>
              <Text style={styles.actionText}>Certificações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📚</Text>
              <Text style={styles.actionText}>Material</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Minhas Estatísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Aulas Concluídas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Certificações</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>25h</Text>
              <Text style={styles.statLabel}>Tempo Submerso</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  installBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 16,
    lineHeight: 20,
  },
  installButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  installButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  weatherDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  classContainer: {
    alignItems: 'flex-start',
  },
  classTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 8,
  },
  classLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  classButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  classButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  checklistContainer: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  checkText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 80) / 2,
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0EA5E9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});


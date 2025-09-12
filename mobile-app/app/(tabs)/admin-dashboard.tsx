import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { fetchCurrentWeather, WeatherData } from '../../services/weatherService';

const { width } = Dimensions.get('window');

interface AdminStats {
  totalStudents: number;
  activeClasses: number;
  pendingCertifications: number;
  monthlyRevenue: number;
}

export default function AdminDashboardScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [adminStats] = useState<AdminStats>({
    totalStudents: 156,
    activeClasses: 8,
    pendingCertifications: 12,
    monthlyRevenue: 15420,
  });

  const loadWeather = async () => {
    try {
      const data = await fetchCurrentWeather('lagos');
      setWeatherData({
        ...data,
        lastUpdate: new Date().toLocaleTimeString('pt-PT', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWeather(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeather();
    setRefreshing(false);
  };

  useEffect(() => {
    loadWeather();
    const interval = setInterval(loadWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
      case 'GREEN': return 'Condições Excelentes';
      case 'YELLOW': return 'Condições Moderadas';
      case 'RED': return 'Condições Perigosas';
      default: return 'Status Desconhecido';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <LinearGradient colors={['#000000', '#000033', '#000066']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Painel do</Text>
          <Text style={styles.titleText}>Administrador</Text>
          <Text style={styles.subtitleText}>JUSTDIVE Academy</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Install App Banner */}
        <ImageBackground
          source={require('../../assets/images/wave-banner.png')}
          style={styles.installBanner}
          imageStyle={{ borderRadius: 16, opacity: 0.3 }}
        >
          <Text style={styles.bannerTitle}>📱 Instale o App Mobile</Text>
          <Text style={styles.bannerText}>
            Tenha acesso completo às funcionalidades nativas, widget meteorológico e notificações push no seu dispositivo Android
          </Text>
          <TouchableOpacity
            style={styles.installButton}
            onPress={() => {
              alert('Iniciando download do JUSTDIVE.apk...');
            }}
          >
            <Text style={styles.installButtonText}>📱 Baixar APK</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* Admin Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminStats.totalStudents}</Text>
            <Text style={styles.statLabel}>Estudantes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminStats.activeClasses}</Text>
            <Text style={styles.statLabel}>Aulas Ativas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{adminStats.pendingCertifications}</Text>
            <Text style={styles.statLabel}>Certificações</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>€{adminStats.monthlyRevenue}</Text>
            <Text style={styles.statLabel}>Receita Mensal</Text>
          </View>
        </View>

        {/* Weather Simulator - Admin Only */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌊 Simulador Meteorológico</Text>
          <Text style={styles.cardSubtitle}>Controle o estado das condições para testes</Text>

          <View style={styles.simulatorContainer}>
            <TouchableOpacity
              style={[styles.simulatorButton, { backgroundColor: '#10B981' }]}
              onPress={() => setWeatherData(prev => ({ ...prev!, status: 'GREEN' }))}
            >
              <Text style={styles.simulatorButtonText}>🟢 Verde</Text>
              <Text style={styles.simulatorButtonSubtext}>Excelente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simulatorButton, { backgroundColor: '#F59E0B' }]}
              onPress={() => setWeatherData(prev => ({ ...prev!, status: 'YELLOW' }))}
            >
              <Text style={styles.simulatorButtonText}>🟡 Amarelo</Text>
              <Text style={styles.simulatorButtonSubtext}>Moderado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.simulatorButton, { backgroundColor: '#EF4444' }]}
              onPress={() => setWeatherData(prev => ({ ...prev!, status: 'RED' }))}
            >
              <Text style={styles.simulatorButtonText}>🔴 Vermelho</Text>
              <Text style={styles.simulatorButtonSubtext}>Perigoso</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado Meteorológico Atual</Text>
          {loadingWeather || !weatherData ? (
            <Text style={{ color: 'white' }}>Carregando...</Text>
          ) : (
            <>
              <View
                style={[
                  styles.weatherHeader,
                  { backgroundColor: getStatusColor(weatherData.status) + '20' },
                ]}
              >
                <View style={styles.weatherStatusContainer}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(weatherData.status) },
                    ]}
                  />
                  <Text style={styles.weatherStatusText}>
                    {getStatusText(weatherData.status)}
                  </Text>
                </View>
                <Text style={styles.lastUpdate}>Atualizado: {weatherData.lastUpdate}</Text>
              </View>

              <View style={styles.weatherMetrics}>
                <View style={styles.weatherMetric}>
                  <Text style={styles.metricIcon}>🌡️</Text>
                  <Text style={styles.metricValue}>{weatherData.temperature}°C</Text>
                  <Text style={styles.metricLabel}>Temperatura</Text>
                </View>

                <View style={styles.weatherMetric}>
                  <Text style={styles.metricIcon}>🌊</Text>
                  <Text style={styles.metricValue}>{weatherData.waveHeight}m</Text>
                  <Text style={styles.metricLabel}>Ondas</Text>
                </View>

                <View style={styles.weatherMetric}>
                  <Text style={styles.metricIcon}>💨</Text>
                  <Text style={styles.metricValue}>{weatherData.windSpeed}km/h</Text>
                  <Text style={styles.metricLabel}>Vento</Text>
                </View>

                <View style={styles.weatherMetric}>
                  <Text style={styles.metricIcon}>👁️</Text>
                  <Text style={styles.metricValue}>{weatherData.visibility}km</Text>
                  <Text style={styles.metricLabel}>Visibilidade</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Admin Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ações Administrativas</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/students')}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Gerir Estudantes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/classes')}>
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionText}>Gerir Aulas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/certifications')}>
              <Text style={styles.actionIcon}>📜</Text>
              <Text style={styles.actionText}>Certificações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/reports')}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Relatórios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/finance')}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Financeiro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/admin/notifications')}>
              <Text style={styles.actionIcon}>📲</Text>
              <Text style={styles.actionText}>Notificações</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Atividade Recente</Text>
          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>14:30</Text>
              <Text style={styles.activityText}>Nova inscrição: João Silva</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>13:15</Text>
              <Text style={styles.activityText}>
                Estado alterado para: {weatherData ? getStatusText(weatherData.status) : '--'}
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityTime}>12:00</Text>
              <Text style={styles.activityText}>Certificação aprovada: Maria Santos</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  headerContent: { alignItems: 'center' },
  welcomeText: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  titleText: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  subtitleText: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  content: { padding: 20, paddingTop: 10 },
  installBanner: {
    backgroundColor: 'rgba(0, 0, 51, 0.7)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00FFFF',
    overflow: 'hidden',
  },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#00FFFF', marginBottom: 8 },
  bannerText: { fontSize: 14, color: '#00FFFF', marginBottom: 16, lineHeight: 20 },
  installButton: {
    backgroundColor: '#000066',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  installButtonText: { color: '#00FFFF', fontWeight: 'bold', fontSize: 16 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(0, 0, 51, 0.7)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#00FFFF',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#00FFFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#A0AEC0', textAlign: 'center' },
  card: {
    backgroundColor: 'rgba(0, 0, 51, 0.7)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00FFFF',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 16 },
  cardSubtitle: { fontSize: 14, color: '#A0AEC0', marginBottom: 16 },
  simulatorContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  simulatorButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', minWidth: 80 },
  simulatorButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  simulatorButtonSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  weatherHeader: { borderRadius: 12, padding: 16, marginBottom: 16 },
  weatherStatusContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusIndicator: { width: 20, height: 20, borderRadius: 10, marginRight: 12 },
  weatherStatusText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  lastUpdate: { fontSize: 12, color: '#A0AEC0' },
  weatherMetrics: { flexDirection: 'row', justifyContent: 'space-around' },
  weatherMetric: { alignItems: 'center' },
  metricIcon: { fontSize: 20, marginBottom: 4 },
  metricValue: { fontSize: 16, fontWeight: 'bold', color: '#00FFFF', marginBottom: 2 },
  metricLabel: { fontSize: 10, color: '#A0AEC0', textAlign: 'center' },
  actionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionButton: { width: (width - 80) / 3, backgroundColor: 'rgba(0, 0, 51, 0.7)', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: '600', color: 'white', textAlign: 'center' },
  activityContainer: { gap: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  activityTime: { fontSize: 14, fontWeight: 'bold', color: '#00FFFF', width: 60 },
  activityText: { fontSize: 14, color: 'white', flex: 1, marginLeft: 12 },
});

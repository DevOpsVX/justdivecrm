import { View, Text, StyleSheet } from 'react-native';

export default function CertificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Certificações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  text: { color: '#fff', fontSize: 20 },
});

import { View, Text, StyleSheet } from 'react-native';

export default function ScheduleClassScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Agendar Aula</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  text: { color: '#fff', fontSize: 20 },
});

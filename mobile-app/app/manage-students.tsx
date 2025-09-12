import { View, Text, StyleSheet } from 'react-native';

export default function ManageStudentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gestão de Estudantes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  text: { color: '#fff', fontSize: 20 },
});

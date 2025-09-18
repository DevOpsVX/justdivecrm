// Expo configuration for JustDive Mobile
// This config enables home screen widgets and sets custom icons and splash screens.
module.exports = {
  name: 'justdive-mobile',
  slug: 'justdive-mobile',
  version: '1.0.0',
  plugins: [
    [
      'expo-widget',
      {
        // Widget name visible to the OS
        name: 'JustDiveWeather',
        // Path to the widget source code (relative to the project root)
        codePath: './widgets/weather',
        android: {
          // Interval for the OS to refresh the widget (30 minutes)
          updatePeriodMillis: 30 * 60 * 1000
        },
        ios: {
          supportsWidgetStacks: true
        }
      }
    ]
  ],
  // Use the high‑resolution logo provided by the client for the app icon
  icon: './assets/justdive.logo.png',
  // Configure the splash screen to use the logo on a dark blue background
  splash: {
    image: './assets/justdive.logo.png',
    resizeMode: 'contain',
    backgroundColor: '#0a192f'
  }
};
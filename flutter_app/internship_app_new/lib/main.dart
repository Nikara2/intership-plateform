import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/application_provider.dart';
import 'providers/offers_provider.dart';
import 'providers/notifications_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/evaluations_provider.dart';
import 'features/auth/onboarding_screen.dart';
import 'features/home/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AuthProvider>(
          create: (_) => AuthProvider()..initialize(), // Initialize on startup
        ),
        ChangeNotifierProvider<ApplicationsProvider>(
          create: (_) => ApplicationsProvider(),
        ),
        ChangeNotifierProvider<OffersProvider>(
          create: (_) => OffersProvider(),
        ),
        ChangeNotifierProvider<NotificationsProvider>(
          create: (_) => NotificationsProvider(),
        ),
        ChangeNotifierProvider<ThemeProvider>(
          create: (_) => ThemeProvider(),
        ),
        ChangeNotifierProvider<EvaluationsProvider>(
          create: (_) => EvaluationsProvider(),
        ),
      ],
      child: Consumer2<AuthProvider, ThemeProvider>(
        builder: (context, auth, themeProvider, _) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'StageConnect',

            // 🎨 Thème global (dynamique selon le mode sombre/clair)
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: themeProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,

            // Page d'accueil selon l'authentification
            home: auth.isAuthenticated
                ? const HomeScreen()
                : const OnboardingScreen(),
          );
        },
      ),
    );
  }
}

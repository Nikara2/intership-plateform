import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/application_provider.dart'; // ✅ import correct
import 'features/auth/login_screen.dart';
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
          create: (_) => AuthProvider(),
        ),
        ChangeNotifierProvider<ApplicationsProvider>(
          create: (_) => ApplicationsProvider(),
        ),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Internship App',

            // 🎨 Thème global
            theme: AppTheme.lightTheme,

            // Page d'accueil selon l'authentification
            home: auth.isAuthenticated
                ? const HomeScreen()
                : LoginScreen(),
          );
        },
      ),
    );
  }
}

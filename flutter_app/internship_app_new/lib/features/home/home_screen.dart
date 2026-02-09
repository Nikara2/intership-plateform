import 'package:flutter/material.dart';
import '../profile/profile_screen.dart';
import '../internships/internship_list_screen.dart';
import '../applications/applications_screen.dart';
import '../evaluations/evaluation_screen.dart';
import '../history/history_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    InternshipListScreen(),
    ApplicationsScreen(),
    ProfileScreen(),
    EvaluationScreen(),
    HistoryScreen(),
  ];

  final List<String> _titles = const [
    'Stages',
    'Candidatures',
    'Profil',
    'Évaluation',
    'Historique',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_currentIndex]),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: KeyedSubtree(
          key: ValueKey(_currentIndex),
          child: _screens[_currentIndex],
        ),
      ),
      bottomNavigationBar: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          type: BottomNavigationBarType.fixed,
          onTap: (index) {
            setState(() => _currentIndex = index);
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.work_outline),
              label: 'Stages',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.assignment_outlined),
              label: 'Candidatures',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              label: 'Profil',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.star_outline),
              label: 'Évaluation',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.history),
              label: 'Historique',
            ),
          ],
        ),
      ),
    );
  }
}

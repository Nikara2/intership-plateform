import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Theme Provider - Manages app theme (light/dark mode)
class ThemeProvider extends ChangeNotifier {
  bool _isDarkMode = false;
  static const String _themeKey = 'theme_mode';

  bool get isDarkMode => _isDarkMode;

  ThemeProvider() {
    _loadThemePreference();
  }

  /// Load theme preference from storage
  Future<void> _loadThemePreference() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _isDarkMode = prefs.getBool(_themeKey) ?? false;
      notifyListeners();
    } catch (e) {
      debugPrint('❌ Error loading theme preference: $e');
    }
  }

  /// Toggle theme mode
  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_themeKey, _isDarkMode);
      debugPrint('💡 Theme changed to: ${_isDarkMode ? "Dark" : "Light"}');
    } catch (e) {
      debugPrint('❌ Error saving theme preference: $e');
    }
  }

  /// Set theme mode explicitly
  Future<void> setTheme(bool isDark) async {
    if (_isDarkMode == isDark) return;

    _isDarkMode = isDark;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_themeKey, _isDarkMode);
    } catch (e) {
      debugPrint('❌ Error saving theme preference: $e');
    }
  }
}

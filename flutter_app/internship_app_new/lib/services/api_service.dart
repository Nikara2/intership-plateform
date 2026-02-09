import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/student_profile.dart';

class AuthProvider extends ChangeNotifier {
  StudentProfile? _studentProfile;
  String? _accessToken;

  StudentProfile? get studentProfile => _studentProfile;
  bool get isAuthenticated => _accessToken != null;

  final String baseUrl = "";

  // ================================
  // LOGIN
  // ================================
  Future<bool> login(String email, String password) async {
    try {
      final url = Uri.parse("$baseUrl/auth/login");

      final response = await http
          .post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
      )
          .timeout(const Duration(seconds: 8));

      if (response.statusCode != 200) return false;

      final data = jsonDecode(response.body);
      _accessToken = data["accessToken"];

      // Récupération du profil
      final success = await fetchStudentProfile();
      if (!success) {
        logout();
        return false;
      }

      notifyListeners();
      return true;
    } catch (e) {
      debugPrint("❌ Login failed: $e");
      return false;
    }
  }

  // ================================
  // LOGOUT
  // ================================
  void logout() {
    _studentProfile = null;
    _accessToken = null;
    notifyListeners();
  }

  // ================================
  // FETCH PROFIL ETUDIANT
  // ================================
  Future<bool> fetchStudentProfile() async {
    if (_accessToken == null) return false;

    try {
      final url = Uri.parse("$baseUrl/students/me");

      final response = await http
          .get(
        url,
        headers: {
          "Authorization": "Bearer $_accessToken",
          "Content-Type": "application/json",
        },
      )
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 401) {
        logout();
        return false;
      }

      if (response.statusCode != 200) return false;

      final data = jsonDecode(response.body);

      _studentProfile = StudentProfile(
        firstName: data["firstName"],
        lastName: data["lastName"],
        school: data["school"],
        program: data["program"],
        level: data["level"],
        phone: data["phone"],
      );

      notifyListeners();
      return true;
    } catch (e) {
      debugPrint("❌ Fetch profile failed: $e");
      return false;
    }
  }

  // ================================
  // UPDATE PROFIL
  // ================================
  Future<bool> updateProfile({
    required String firstName,
    required String lastName,
    required String phone,
  }) async {
    if (_accessToken == null) return false;

    try {
      final url = Uri.parse("$baseUrl/students/me");

      final response = await http
          .put(
        url,
        headers: {
          "Authorization": "Bearer $_accessToken",
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "firstName": firstName,
          "lastName": lastName,
          "phone": phone,
        }),
      )
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 401) {
        logout();
        return false;
      }

      if (response.statusCode != 200) return false;

      _studentProfile = _studentProfile?.copyWith(
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      );

      notifyListeners();
      return true;
    } catch (e) {
      debugPrint("❌ Update profile failed: $e");
      return false;
    }
  }
}

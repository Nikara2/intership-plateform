import 'package:flutter/material.dart';
import '../models/user.dart';
import '../models/student_profile.dart';

class AuthProvider extends ChangeNotifier {
  Student? _student;
  StudentProfile? _studentProfile;

  Student? get student => _student;
  StudentProfile? get studentProfile => _studentProfile;

  bool get isAuthenticated => _student != null;

  void login(String email, String password) {
    _student = Student(
      id: "1",
      name: "Corentin Ouedraogo",
      email: email,
      school: "Université",
    );

    // 🔹 Profil étudiant fictif (temporaire)
    _studentProfile = StudentProfile(
      firstName: "Corentin",
      lastName: "Ouedraogo",
      school: "Université Joseph Ki-Zerbo",
      program: "Génie Logiciel",
      level: "Licence 3",
      phone: "+226 70 00 00 00",
    );

    notifyListeners();
  }

  /// ✅ Mise à jour partielle du profil
  void updateProfile({
    required String firstName,
    required String lastName,
    required String phone,
  }) {
    if (_studentProfile == null) return;

    _studentProfile = _studentProfile!.copyWith(
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    );

    notifyListeners();
  }

  void logout() {
    _student = null;
    _studentProfile = null;
    notifyListeners();
  }
}

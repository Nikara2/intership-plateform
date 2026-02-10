import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/student_profile.dart';
import '../constants/api_constants.dart';

/// Authentication Provider - Manages user authentication state
/// Connects to the Node.js backend API
class AuthProvider extends ChangeNotifier {
  // ==================== State ====================

  Student? _student;
  StudentProfile? _studentProfile;
  String? _accessToken;
  bool _isLoading = false;
  String? _error;

  // ==================== Getters ====================

  Student? get student => _student;
  StudentProfile? get studentProfile => _studentProfile;
  String? get accessToken => _accessToken;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _accessToken != null && _student != null;

  /// Calculate profile completion percentage (0-100)
  int get profileCompletionPercentage {
    if (_studentProfile == null) return 0;

    int completedFields = 0;
    const int totalFields = 9;

    // Required fields (always counted as complete if profile exists)
    completedFields += 6; // firstName, lastName, school, program, level, phone

    // Optional fields
    if (_studentProfile!.about != null && _studentProfile!.about!.isNotEmpty) {
      completedFields++;
    }
    if (_studentProfile!.skills != null && _studentProfile!.skills!.isNotEmpty) {
      completedFields++;
    }
    if (_studentProfile!.cvUrl != null && _studentProfile!.cvUrl!.isNotEmpty) {
      completedFields++;
    }

    return ((completedFields / totalFields) * 100).round();
  }

  /// Get list of missing profile fields
  List<String> get missingProfileFields {
    if (_studentProfile == null) return ['Profil complet'];

    final List<String> missing = [];

    if (_studentProfile!.about == null || _studentProfile!.about!.isEmpty) {
      missing.add('Bio');
    }
    if (_studentProfile!.skills == null || _studentProfile!.skills!.isEmpty) {
      missing.add('Compétences');
    }
    if (_studentProfile!.cvUrl == null || _studentProfile!.cvUrl!.isEmpty) {
      missing.add('CV');
    }

    return missing.isEmpty ? [] : missing;
  }

  // ==================== Initialization ====================

  /// Initialize auth state from stored token
  Future<void> initialize() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('access_token');
      final userId = prefs.getString('user_id');
      final userEmail = prefs.getString('user_email');

      if (token != null && userId != null && userEmail != null) {
        _accessToken = token;
        _student = Student(
          id: userId,
          name: userEmail.split('@')[0], // Temporary name
          email: userEmail,
          school: '', // Will be loaded from profile
        );

        // Load student profile
        await fetchStudentProfile();
      }
    } catch (e) {
      debugPrint('❌ Initialize auth failed: $e');
    }
    notifyListeners();
  }

  // ==================== LOGIN ====================

  /// Login with email and password
  /// Returns true if login successful, false otherwise
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl(ApiConstants.authLogin));

      debugPrint('🔑 Logging in to: $url');
      debugPrint('📧 Email: $email');

      final response = await http
          .post(
            url,
            headers: ApiConstants.publicHeaders,
            body: jsonEncode({
              'email': email,
              'password': password,
            }),
          )
          .timeout(const Duration(seconds: 10));

      debugPrint('📡 Response status: ${response.statusCode}');
      debugPrint('📄 Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        // Backend returns: { access_token: "..." }
        _accessToken = data['access_token'];

        if (_accessToken == null) {
          _error = 'Token manquant dans la réponse';
          _isLoading = false;
          notifyListeners();
          return false;
        }

        // Decode JWT to extract user data
        final parts = _accessToken!.split('.');
        if (parts.length != 3) {
          _error = 'Token invalide';
          _isLoading = false;
          notifyListeners();
          return false;
        }

        // Decode payload (base64url)
        final payload = parts[1];
        final normalized = base64Url.normalize(payload);
        final decoded = utf8.decode(base64Url.decode(normalized));
        final payloadMap = jsonDecode(decoded);

        debugPrint('📄 JWT Payload: $payloadMap');

        // Extract user data from JWT
        final userId = payloadMap['sub'] ?? payloadMap['id'];
        final userEmail = payloadMap['email'];
        final userRole = payloadMap['role'];

        // Store token and user data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('access_token', _accessToken!);
        await prefs.setString('user_id', userId.toString());
        await prefs.setString('user_email', userEmail);
        await prefs.setString('user_role', userRole);

        // Create student object
        _student = Student(
          id: userId.toString(),
          name: userEmail.split('@')[0],
          email: userEmail,
          school: '', // Will be loaded from profile
        );

        // Fetch student profile
        final profileSuccess = await fetchStudentProfile();
        if (!profileSuccess) {
          debugPrint('⚠️ Login successful but profile fetch failed');
          // Don't fail login if profile fetch fails
        }

        _isLoading = false;
        notifyListeners();
        return true;
      } else if (response.statusCode == 401) {
        _error = 'Email ou mot de passe incorrect';
      } else if (response.statusCode == 404) {
        _error = 'Utilisateur non trouvé';
      } else {
        final data = jsonDecode(response.body);
        _error = data['message'] ?? 'Erreur de connexion';
      }
    } catch (e) {
      debugPrint('❌ Login error: $e');
      if (e.toString().contains('SocketException') ||
          e.toString().contains('Connection')) {
        _error = 'Impossible de se connecter au serveur';
      } else if (e.toString().contains('TimeoutException')) {
        _error = 'Délai de connexion dépassé';
      } else {
        _error = 'Erreur inattendue: ${e.toString()}';
      }
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  // ==================== REGISTER ====================

  /// Register a new student account
  Future<bool> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String school,
    required String level,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl(ApiConstants.authRegister));

      debugPrint('📝 Registering to: $url');

      final response = await http
          .post(
            url,
            headers: ApiConstants.publicHeaders,
            body: jsonEncode({
              'email': email,
              'password': password,
              'role': 'STUDENT',
              'first_name': firstName,
              'last_name': lastName,
              'school': school,
              'level': level,
            }),
          )
          .timeout(const Duration(seconds: 10));

      debugPrint('📡 Response status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Registration successful, user should login manually
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        final data = jsonDecode(response.body);
        _error = data['message'] ?? 'Erreur d\'inscription';
      }
    } catch (e) {
      debugPrint('❌ Register error: $e');
      if (e.toString().contains('SocketException')) {
        _error = 'Impossible de se connecter au serveur';
      } else {
        _error = 'Erreur inattendue: ${e.toString()}';
      }
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  // ==================== FETCH STUDENT PROFILE ====================

  /// Fetch student profile from backend
  Future<bool> fetchStudentProfile() async {
    if (_accessToken == null) {
      debugPrint('⚠️ No access token, cannot fetch profile');
      return false;
    }

    try {
      final url = Uri.parse(ApiConstants.getFullUrl(ApiConstants.studentsMe));

      debugPrint('👤 Fetching profile from: $url');

      final response = await http.get(
        url,
        headers: ApiConstants.getAuthHeaders(_accessToken!),
      ).timeout(const Duration(seconds: 10));

      debugPrint('📡 Profile response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        _studentProfile = StudentProfile(
          firstName: data['first_name'] ?? '',
          lastName: data['last_name'] ?? '',
          school: data['school'] ?? '',
          program: data['program'] ?? '',
          level: data['level'] ?? '',
          phone: data['phone'] ?? '',
          about: data['about'],
          skills: data['skills'] != null ? List<String>.from(data['skills']) : null,
          cvUrl: data['cv_url'],
        );

        // Update student with full name
        if (_student != null) {
          _student = Student(
            id: _student!.id,
            name: '${_studentProfile!.firstName} ${_studentProfile!.lastName}',
            email: _student!.email,
            school: _studentProfile!.school,
          );
        }

        notifyListeners();
        return true;
      } else if (response.statusCode == 401) {
        // Token expired or invalid
        debugPrint('🔐 Token invalid, logging out');
        await logout();
        return false;
      }
    } catch (e) {
      debugPrint('❌ Fetch profile error: $e');
    }

    return false;
  }

  // ==================== UPDATE PROFILE ====================

  /// Update student profile
  Future<bool> updateProfile({
    required String firstName,
    required String lastName,
    required String phone,
    String? school,
    String? program,
    String? level,
    String? about,
  }) async {
    if (_accessToken == null) return false;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl(ApiConstants.studentsUpdate));

      final response = await http
          .patch(
            url,
            headers: ApiConstants.getAuthHeaders(_accessToken!),
            body: jsonEncode({
              'first_name': firstName,
              'last_name': lastName,
              'phone': phone,
              if (school != null) 'school': school,
              if (program != null) 'program': program,
              if (level != null) 'level': level,
              if (about != null) 'about': about,
            }),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        // Refresh profile from backend
        await fetchStudentProfile();

        _isLoading = false;
        notifyListeners();
        return true;
      } else if (response.statusCode == 401) {
        await logout();
      } else {
        final data = jsonDecode(response.body);
        _error = data['message'] ?? 'Erreur de mise à jour';
      }
    } catch (e) {
      debugPrint('❌ Update profile error: $e');
      _error = 'Erreur de mise à jour du profil';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  // ==================== SKILLS MANAGEMENT ====================

  /// Add a skill to the student profile
  Future<bool> addSkill(String skill) async {
    if (_accessToken == null) return false;

    try {
      final url = Uri.parse(ApiConstants.getFullUrl('${ApiConstants.studentsMe}/skills'));

      debugPrint('➕ Adding skill: $skill');

      final response = await http
          .post(
            url,
            headers: ApiConstants.getAuthHeaders(_accessToken!),
            body: jsonEncode({'skill': skill}),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Refresh profile to get updated skills
        await fetchStudentProfile();
        return true;
      } else if (response.statusCode == 401) {
        await logout();
      }
    } catch (e) {
      debugPrint('❌ Add skill error: $e');
      _error = 'Erreur lors de l\'ajout de la compétence';
    }

    notifyListeners();
    return false;
  }

  /// Remove a skill from the student profile
  Future<bool> removeSkill(String skill) async {
    if (_accessToken == null) return false;

    try {
      final encodedSkill = Uri.encodeComponent(skill);
      final url = Uri.parse(ApiConstants.getFullUrl('${ApiConstants.studentsMe}/skills/$encodedSkill'));

      debugPrint('➖ Removing skill: $skill');

      final response = await http
          .delete(
            url,
            headers: ApiConstants.getAuthHeaders(_accessToken!),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        // Refresh profile to get updated skills
        await fetchStudentProfile();
        return true;
      } else if (response.statusCode == 401) {
        await logout();
      }
    } catch (e) {
      debugPrint('❌ Remove skill error: $e');
      _error = 'Erreur lors de la suppression de la compétence';
    }

    notifyListeners();
    return false;
  }

  // ==================== CV MANAGEMENT ====================

  /// Upload CV file
  Future<bool> uploadCv(String filePath) async {
    if (_accessToken == null) return false;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl('${ApiConstants.studentsMe}/cv'));

      debugPrint('📤 Uploading CV from: $filePath');

      // Create multipart request
      final request = http.MultipartRequest('POST', url);

      // Only add Authorization header for multipart requests (no Content-Type)
      request.headers['Authorization'] = 'Bearer $_accessToken';

      // Add file to request
      request.files.add(await http.MultipartFile.fromPath('cv', filePath));

      debugPrint('📤 Sending multipart request...');
      final streamedResponse = await request.send().timeout(const Duration(seconds: 30));
      final response = await http.Response.fromStream(streamedResponse);

      debugPrint('📡 Upload response status: ${response.statusCode}');
      debugPrint('📄 Upload response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('✅ CV uploaded successfully');

        // Refresh profile to get updated CV URL
        await fetchStudentProfile();

        _isLoading = false;
        notifyListeners();
        return true;
      } else if (response.statusCode == 401) {
        debugPrint('❌ Unauthorized - logging out');
        await logout();
      } else {
        _error = 'Erreur lors de l\'upload du CV (${response.statusCode})';
        debugPrint('❌ Upload failed with status: ${response.statusCode}');
        debugPrint('❌ Error: ${response.body}');
      }
    } catch (e) {
      debugPrint('❌ Upload CV error: $e');
      _error = 'Erreur lors de l\'upload du CV: $e';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  /// Upload CV from bytes (for web)
  Future<bool> uploadCvFromBytes(List<int> bytes, String filename) async {
    if (_accessToken == null) return false;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl('${ApiConstants.studentsMe}/cv'));

      debugPrint('📤 Uploading CV from bytes: $filename');

      // Create multipart request
      final request = http.MultipartRequest('POST', url);

      // Only add Authorization header for multipart requests (no Content-Type)
      request.headers['Authorization'] = 'Bearer $_accessToken';

      // Add file from bytes
      request.files.add(
        http.MultipartFile.fromBytes(
          'cv',
          bytes,
          filename: filename,
        ),
      );

      debugPrint('📤 Sending multipart request...');
      final streamedResponse = await request.send().timeout(const Duration(seconds: 30));
      final response = await http.Response.fromStream(streamedResponse);

      debugPrint('📡 Upload response status: ${response.statusCode}');
      debugPrint('📄 Upload response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('✅ CV uploaded successfully');

        // Refresh profile to get updated CV URL
        await fetchStudentProfile();

        _isLoading = false;
        notifyListeners();
        return true;
      } else if (response.statusCode == 401) {
        debugPrint('❌ Unauthorized - logging out');
        await logout();
      } else {
        _error = 'Erreur lors de l\'upload du CV (${response.statusCode})';
        debugPrint('❌ Upload failed with status: ${response.statusCode}');
        debugPrint('❌ Error: ${response.body}');
      }
    } catch (e) {
      debugPrint('❌ Upload CV error: $e');
      _error = 'Erreur lors de l\'upload du CV: $e';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  /// Download CV file
  Future<String?> downloadCv() async {
    if (_accessToken == null) return null;

    try {
      final url = Uri.parse(ApiConstants.getFullUrl('${ApiConstants.studentsMe}/cv'));

      debugPrint('📥 Downloading CV from: $url');

      final response = await http
          .get(
            url,
            headers: ApiConstants.getAuthHeaders(_accessToken!),
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        return url.toString();
      } else if (response.statusCode == 404) {
        _error = 'Aucun CV trouvé';
      } else if (response.statusCode == 401) {
        await logout();
      }
    } catch (e) {
      debugPrint('❌ Download CV error: $e');
      _error = 'Erreur lors du téléchargement du CV';
    }

    notifyListeners();
    return null;
  }

  /// Delete CV file
  Future<bool> deleteCv() async {
    if (_accessToken == null) return false;

    try {
      final url = Uri.parse(ApiConstants.getFullUrl('${ApiConstants.studentsMe}/cv'));

      debugPrint('🗑️ Deleting CV');

      final response = await http
          .delete(
            url,
            headers: ApiConstants.getAuthHeaders(_accessToken!),
          )
          .timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        // Refresh profile to clear CV URL
        await fetchStudentProfile();
        return true;
      } else if (response.statusCode == 401) {
        await logout();
      }
    } catch (e) {
      debugPrint('❌ Delete CV error: $e');
      _error = 'Erreur lors de la suppression du CV';
    }

    notifyListeners();
    return false;
  }

  // ==================== LOGOUT ====================

  /// Logout and clear all auth data
  Future<void> logout() async {
    _student = null;
    _studentProfile = null;
    _accessToken = null;
    _error = null;

    // Clear stored data
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('user_id');
    await prefs.remove('user_email');
    await prefs.remove('user_role');

    notifyListeners();
  }

  // ==================== CLEAR ERROR ====================

  /// Clear error message
  void clearError() {
    _error = null;
    notifyListeners();
  }
}

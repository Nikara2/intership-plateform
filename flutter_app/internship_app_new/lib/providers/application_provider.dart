import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/application.dart';
import '../constants/api_constants.dart';

/// Applications Provider - Manages student applications
/// Connects to the Node.js backend API
class ApplicationsProvider extends ChangeNotifier {
  // ==================== State ====================

  List<Application> _applications = [];
  bool _isLoading = false;
  String? _error;
  bool _isApplying = false;
  String _searchQuery = '';

  // ==================== Getters ====================

  List<Application> get applications {
    var filtered = _applications;

    // Apply search filter
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((app) {
        final searchLower = _searchQuery.toLowerCase();
        return (app.companyName?.toLowerCase().contains(searchLower) ?? false) ||
            (app.offerTitle?.toLowerCase().contains(searchLower) ?? false);
      }).toList();
    }

    return filtered;
  }

  List<Application> get allApplications => _applications;
  String get searchQuery => _searchQuery;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isApplying => _isApplying;

  // Get applications by status
  List<Application> get pendingApplications =>
      _applications.where((app) => app.status == 'PENDING').toList();

  List<Application> get acceptedApplications =>
      _applications.where((app) => app.status == 'ACCEPTED').toList();

  List<Application> get rejectedApplications =>
      _applications.where((app) => app.status == 'REJECTED').toList();

  List<Application> get completedApplications =>
      _applications.where((app) => app.status == 'COMPLETED').toList();

  // ==================== FETCH APPLICATIONS ====================

  /// Fetch all applications for the current student
  Future<bool> fetchApplications(String accessToken) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Use /applications/me endpoint to get student's applications
      final url = Uri.parse(
        ApiConstants.getFullUrl('/applications/me'),
      );

      debugPrint('📋 Fetching applications from: $url');

      final response = await http.get(
        url,
        headers: ApiConstants.getAuthHeaders(accessToken),
      ).timeout(const Duration(seconds: 10));

      debugPrint('📡 Applications response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);

        _applications = data.map((json) => Application.fromJson(json)).toList();

        // Sort by applied date (newest first)
        _applications.sort((a, b) => b.appliedAt.compareTo(a.appliedAt));

        debugPrint('✅ Loaded ${_applications.length} applications');

        _isLoading = false;
        notifyListeners();
        return true;
      } else if (response.statusCode == 401) {
        _error = 'Session expirée, veuillez vous reconnecter';
        debugPrint('🔐 Token invalid');
      } else {
        _error = 'Erreur lors du chargement des candidatures';
        debugPrint('❌ Error: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('❌ Fetch applications error: $e');
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

  // ==================== APPLY TO OFFER ====================

  /// Apply to an internship offer
  Future<bool> applyToOffer(String offerId, String accessToken) async {
    _isApplying = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl(ApiConstants.applications));

      debugPrint('✉️ Applying to offer: $offerId');

      final response = await http.post(
        url,
        headers: ApiConstants.getAuthHeaders(accessToken),
        body: jsonEncode({
          'offer_id': offerId,
        }),
      ).timeout(const Duration(seconds: 10));

      debugPrint('📡 Application response status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);

        // Add new application to local list
        final newApplication = Application.fromJson(data);
        _applications.insert(0, newApplication); // Add to beginning

        debugPrint('✅ Application submitted successfully');

        _isApplying = false;
        notifyListeners();
        return true;
      } else if (response.statusCode == 400) {
        final data = jsonDecode(response.body);
        _error = data['message'] ?? 'Vous avez déjà postulé à cette offre';
      } else if (response.statusCode == 401) {
        _error = 'Session expirée';
      } else if (response.statusCode == 404) {
        _error = 'Offre non trouvée';
      } else {
        _error = 'Erreur lors de la candidature';
      }
    } catch (e) {
      debugPrint('❌ Apply to offer error: $e');
      if (e.toString().contains('SocketException') ||
          e.toString().contains('Connection')) {
        _error = 'Impossible de se connecter au serveur';
      } else if (e.toString().contains('TimeoutException')) {
        _error = 'Délai de connexion dépassé';
      } else {
        _error = 'Erreur inattendue: ${e.toString()}';
      }
    }

    _isApplying = false;
    notifyListeners();
    return false;
  }

  // ==================== SEARCH & FILTERS ====================

  /// Set search query
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  /// Clear search
  void clearSearch() {
    _searchQuery = '';
    notifyListeners();
  }

  // ==================== UTILITIES ====================

  /// Check if already applied to an offer
  bool hasApplied(String offerId) {
    return _applications.any((app) => app.offerId == offerId);
  }

  /// Get application by offer ID
  Application? getApplicationByOfferId(String offerId) {
    try {
      return _applications.firstWhere((app) => app.offerId == offerId);
    } catch (e) {
      return null;
    }
  }

  /// Clear error message
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Clear all applications (used on logout)
  void clear() {
    _applications = [];
    _error = null;
    _isLoading = false;
    _isApplying = false;
    notifyListeners();
  }
}

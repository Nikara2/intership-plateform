import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/evaluation.dart';
import '../constants/api_constants.dart';

/// Evaluations Provider - Manages student evaluations
/// Fetches evaluations from the backend API
class EvaluationsProvider extends ChangeNotifier {
  // ==================== State ====================

  List<Evaluation> _evaluations = [];
  bool _isLoading = false;
  String? _error;

  // ==================== Getters ====================

  List<Evaluation> get evaluations => _evaluations;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasEvaluations => _evaluations.isNotEmpty;

  /// Calculate average score across all evaluations
  double get averageScore {
    if (_evaluations.isEmpty) return 0.0;
    final total = _evaluations.fold<int>(0, (sum, eval) => sum + eval.score);
    return total / _evaluations.length;
  }

  // ==================== FETCH EVALUATIONS ====================

  /// Fetch student's evaluations from backend
  Future<void> fetchEvaluations(String accessToken) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl('${ApiConstants.evaluations}/me'));

      debugPrint('📊 Fetching evaluations from: $url');

      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $accessToken',
        },
      ).timeout(const Duration(seconds: 10));

      debugPrint('📡 Response status: ${response.statusCode}');
      debugPrint('📄 Response body: ${response.body}');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        _evaluations = data.map((json) => Evaluation.fromJson(json)).toList();
        debugPrint('✅ Loaded ${_evaluations.length} evaluations');
        _error = null;
      } else {
        _error = 'Erreur ${response.statusCode}';
        debugPrint('❌ Failed to fetch evaluations: ${response.statusCode}');
      }
    } catch (e) {
      _error = 'Erreur de connexion';
      debugPrint('❌ Fetch evaluations error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Clear evaluations (on logout)
  void clear() {
    _evaluations = [];
    _error = null;
    _isLoading = false;
    notifyListeners();
  }
}

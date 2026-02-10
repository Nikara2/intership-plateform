import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/offer.dart';
import '../constants/api_constants.dart';

/// Offers Provider - Manages internship offers from companies
/// Connects to the Node.js backend API
class OffersProvider extends ChangeNotifier {
  // ==================== State ====================

  List<Offer> _offers = [];
  Offer? _selectedOffer;
  bool _isLoading = false;
  String? _error;

  // Filters
  String _searchQuery = '';
  String? _locationFilter;
  String? _durationFilter;

  // ==================== Getters ====================

  List<Offer> get offers {
    // Only show OPEN offers
    var filtered = _offers.where((offer) => offer.status == 'OPEN').toList();

    // Apply search filter
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((offer) {
        final searchLower = _searchQuery.toLowerCase();
        return offer.title.toLowerCase().contains(searchLower) ||
            offer.description.toLowerCase().contains(searchLower) ||
            (offer.companyName?.toLowerCase().contains(searchLower) ?? false);
      }).toList();
    }

    // Apply location filter
    if (_locationFilter != null && _locationFilter!.isNotEmpty) {
      filtered = filtered.where((offer) {
        return offer.location?.toLowerCase().contains(_locationFilter!.toLowerCase()) ?? false;
      }).toList();
    }

    // Apply duration filter
    if (_durationFilter != null && _durationFilter!.isNotEmpty) {
      filtered = filtered.where((offer) {
        return offer.duration?.toLowerCase().contains(_durationFilter!.toLowerCase()) ?? false;
      }).toList();
    }

    return filtered;
  }

  List<Offer> get allOffers => _offers;
  Offer? get selectedOffer => _selectedOffer;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get searchQuery => _searchQuery;
  String? get locationFilter => _locationFilter;
  String? get durationFilter => _durationFilter;

  // ==================== FETCH OFFERS ====================

  /// Fetch all offers from backend
  Future<bool> fetchOffers(String accessToken) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl(ApiConstants.offers));

      debugPrint('📋 Fetching offers from: $url');

      final response = await http.get(
        url,
        headers: ApiConstants.getAuthHeaders(accessToken),
      ).timeout(const Duration(seconds: 10));

      debugPrint('📡 Offers response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);

        _offers = data.map((json) => Offer.fromJson(json)).toList();

        // Sort by creation date (newest first)
        _offers.sort((a, b) => b.createdAt.compareTo(a.createdAt));

        debugPrint('✅ Loaded ${_offers.length} offers');

        _isLoading = false;
        notifyListeners();
        return true;
      } else if (response.statusCode == 401) {
        _error = 'Session expirée, veuillez vous reconnecter';
        debugPrint('🔐 Token invalid');
      } else {
        _error = 'Erreur lors du chargement des offres';
        debugPrint('❌ Error: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('❌ Fetch offers error: $e');
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

  // ==================== FETCH OFFER BY ID ====================

  /// Fetch a specific offer by ID
  Future<bool> fetchOfferById(String id, String accessToken) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final url = Uri.parse(ApiConstants.getFullUrl(ApiConstants.offerById(id)));

      debugPrint('📋 Fetching offer $id from: $url');

      final response = await http.get(
        url,
        headers: ApiConstants.getAuthHeaders(accessToken),
      ).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _selectedOffer = Offer.fromJson(data);

        _isLoading = false;
        notifyListeners();
        return true;
      } else if (response.statusCode == 404) {
        _error = 'Offre non trouvée';
      } else if (response.statusCode == 401) {
        _error = 'Session expirée';
      } else {
        _error = 'Erreur lors du chargement de l\'offre';
      }
    } catch (e) {
      debugPrint('❌ Fetch offer error: $e');
      _error = 'Erreur de connexion';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  // ==================== FILTERS ====================

  /// Set search query
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  /// Set location filter
  void setLocationFilter(String? location) {
    _locationFilter = location;
    notifyListeners();
  }

  /// Set duration filter
  void setDurationFilter(String? duration) {
    _durationFilter = duration;
    notifyListeners();
  }

  /// Clear all filters
  void clearFilters() {
    _searchQuery = '';
    _locationFilter = null;
    _durationFilter = null;
    notifyListeners();
  }

  // ==================== UTILITIES ====================

  /// Clear error message
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Select an offer
  void selectOffer(Offer offer) {
    _selectedOffer = offer;
    notifyListeners();
  }

  /// Clear selected offer
  void clearSelectedOffer() {
    _selectedOffer = null;
    notifyListeners();
  }

  /// Get offer by ID from local cache
  Offer? getOfferById(String id) {
    try {
      return _offers.firstWhere((offer) => offer.id == id);
    } catch (e) {
      return null;
    }
  }
}

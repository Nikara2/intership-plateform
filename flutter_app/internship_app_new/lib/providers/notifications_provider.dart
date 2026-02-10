import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notification.dart';

/// Notifications Provider - Manages user notifications with persistence
/// Stores notifications locally using SharedPreferences
/// Can be extended to fetch from backend API
class NotificationsProvider extends ChangeNotifier {
  // ==================== State ====================

  final List<AppNotification> _notifications = [];
  static const String _notificationsKey = 'notifications_list';
  static const String _initKey = 'notifications_initialized';
  bool _isInitialized = false;
  bool _isLoading = true;

  NotificationsProvider() {
    _loadNotifications();
  }

  // ==================== Getters ====================

  List<AppNotification> get notifications => _notifications;

  List<AppNotification> get unreadNotifications =>
      _notifications.where((n) => !n.isRead).toList();

  int get unreadCount => unreadNotifications.length;

  bool get hasUnread => unreadCount > 0;

  bool get isInitialized => _isInitialized;

  bool get isLoading => _isLoading;

  // ==================== PERSISTENCE ====================

  /// Load notifications from SharedPreferences
  Future<void> _loadNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _isInitialized = prefs.getBool(_initKey) ?? false;

      final notificationsJson = prefs.getString(_notificationsKey);
      if (notificationsJson != null) {
        final List<dynamic> decoded = json.decode(notificationsJson);
        _notifications.clear();
        _notifications.addAll(
          decoded.map((item) => AppNotification.fromJson(item)).toList(),
        );
        debugPrint('✅ Loaded ${_notifications.length} notifications from storage');
      }

      debugPrint('🔔 Notifications initialized: $_isInitialized');
    } catch (e) {
      debugPrint('❌ Error loading notifications: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Save notifications to SharedPreferences
  Future<void> _saveNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final notificationsJson = json.encode(
        _notifications.map((n) => n.toJson()).toList(),
      );
      await prefs.setString(_notificationsKey, notificationsJson);
      await prefs.setBool(_initKey, _isInitialized);
      debugPrint('💾 Saved ${_notifications.length} notifications to storage');
    } catch (e) {
      debugPrint('❌ Error saving notifications: $e');
    }
  }

  /// Mark notifications as initialized (called when generating initial notifications)
  Future<void> markAsInitialized() async {
    if (_isInitialized) return; // Already initialized

    _isInitialized = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_initKey, true);
      debugPrint('✅ Notifications marked as initialized');
    } catch (e) {
      debugPrint('❌ Error marking as initialized: $e');
    }
  }

  // ==================== ADD NOTIFICATION ====================

  /// Add a new notification
  void addNotification({
    required String title,
    required String message,
    required String type,
    String? relatedId,
    String? actionUrl,
  }) {
    final notification = AppNotification(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      message: message,
      type: type,
      createdAt: DateTime.now(),
      isRead: false,
      relatedId: relatedId,
      actionUrl: actionUrl,
    );

    _notifications.insert(0, notification); // Add to beginning
    notifyListeners();
    _saveNotifications(); // Persist changes
  }

  // ==================== MARK AS READ ====================

  /// Mark a notification as read
  void markAsRead(String notificationId) {
    final index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      notifyListeners();
      _saveNotifications(); // Persist changes
    }
  }

  /// Mark all notifications as read
  void markAllAsRead() {
    for (int i = 0; i < _notifications.length; i++) {
      if (!_notifications[i].isRead) {
        _notifications[i] = _notifications[i].copyWith(isRead: true);
      }
    }
    notifyListeners();
    _saveNotifications(); // Persist changes
  }

  // ==================== DELETE NOTIFICATION ====================

  /// Delete a notification
  void deleteNotification(String notificationId) {
    _notifications.removeWhere((n) => n.id == notificationId);
    notifyListeners();
    _saveNotifications(); // Persist changes
  }

  /// Clear all notifications
  void clearAll() {
    _notifications.clear();
    notifyListeners();
    _saveNotifications(); // Persist changes
  }

  // ==================== GENERATE NOTIFICATIONS ====================

  /// Generate notification for application status change
  void notifyApplicationStatusChange({
    required String companyName,
    required String status,
    required String applicationId,
  }) {
    String title = '';
    String message = '';

    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        title = '🎉 Candidature acceptée!';
        message = 'Votre candidature chez $companyName a été acceptée!';
        break;
      case 'REJECTED':
        title = '❌ Candidature refusée';
        message = 'Votre candidature chez $companyName a été refusée.';
        break;
      case 'PENDING':
        title = '📝 Candidature en cours';
        message = 'Votre candidature chez $companyName est en cours d\'examen.';
        break;
      default:
        return;
    }

    addNotification(
      title: title,
      message: message,
      type: 'APPLICATION_STATUS',
      relatedId: applicationId,
      actionUrl: '/applications',
    );
  }

  /// Generate notification for new offer matching user profile
  void notifyNewOffer({
    required String offerTitle,
    required String companyName,
    required String offerId,
  }) {
    addNotification(
      title: '💼 Nouvelle offre disponible',
      message: '$offerTitle chez $companyName pourrait vous intéresser!',
      type: 'NEW_OFFER',
      relatedId: offerId,
      actionUrl: '/offers',
    );
  }

  /// Generate welcome notification
  void notifyWelcome(String userName) {
    addNotification(
      title: '👋 Bienvenue $userName!',
      message: 'Découvrez les offres de stage et commencez à postuler.',
      type: 'SYSTEM',
    );
  }

  /// Generate notification for profile completion
  void notifyProfileIncomplete() {
    addNotification(
      title: '📋 Complétez votre profil',
      message: 'Un profil complet augmente vos chances d\'être remarqué!',
      type: 'SYSTEM',
      actionUrl: '/profile',
    );
  }
}

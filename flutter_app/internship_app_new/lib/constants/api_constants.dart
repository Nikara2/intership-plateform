/// API Constants for StageConnect Backend
class ApiConstants {
  // ==================== Base URL ====================

  /// Backend base URL
  /// Change this to your backend URL
  /// - Local development: http://10.0.2.2:3001 (Android emulator)
  /// - Local development: http://localhost:3001 (iOS simulator / Web)
  /// - Production: https://your-backend-url.com
  static const String baseUrl = 'http://localhost:3001';

  // ==================== Auth Endpoints ====================

  static const String authLogin = '/auth/login';
  static const String authRegister = '/auth/register';

  // ==================== Student Endpoints ====================

  static const String studentsMe = '/students/me';
  static const String studentsUpdate = '/students/me';

  // ==================== Offers Endpoints ====================

  static const String offers = '/offers';
  static String offerById(String id) => '/offers/$id';

  // ==================== Applications Endpoints ====================

  static const String applications = '/applications';
  static const String applicationsStudent = '/applications/student';
  static const String applicationsCompany = '/applications/company';

  // ==================== Evaluations Endpoints ====================

  static const String evaluations = '/evaluations';
  static String evaluationByApplicationId(String applicationId) =>
      '/evaluations/$applicationId';

  // ==================== Reports Endpoints ====================

  static const String reportsDashboard = '/reports/dashboard';

  // ==================== Helper Methods ====================

  /// Get full URL for an endpoint
  static String getFullUrl(String endpoint) {
    return '$baseUrl$endpoint';
  }

  /// Headers for authenticated requests
  static Map<String, String> getAuthHeaders(String token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  /// Headers for public requests
  static Map<String, String> get publicHeaders {
    return {
      'Content-Type': 'application/json',
    };
  }
}

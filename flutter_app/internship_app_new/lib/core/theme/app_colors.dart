import 'package:flutter/material.dart';

/// StageConnect Design System - Color Palette
/// Matches the web version for brand consistency
class AppColors {
  // ==================== Primary Colors ====================

  /// Primary Blue - Main brand color, headers, primary actions
  static const Color primaryBlue = Color(0xFF1E40AF);

  /// Secondary Teal - Secondary elements
  static const Color secondaryTeal = Color(0xFF0F766E);

  /// Accent Amber - CTAs, highlights, success states
  static const Color accentAmber = Color(0xFFF59E0B);

  // ==================== Functional Colors ====================

  /// Success Green - Success states, confirmations
  static const Color successGreen = Color(0xFF16A34A);

  /// Error Red - Errors, destructive actions
  static const Color errorRed = Color(0xFFDC2626);

  /// Warning Amber - Warnings, important notices
  static const Color warningAmber = Color(0xFFF59E0B);

  // ==================== Neutral Colors ====================

  /// Background - App background (Slate 50)
  static const Color background = Color(0xFFF8FAFC);

  /// Card White - Cards, surfaces
  static const Color cardWhite = Color(0xFFFFFFFF);

  /// Text Primary - Primary text (Slate 900)
  static const Color textPrimary = Color(0xFF0F172A);

  /// Text Secondary - Secondary text (Slate 600)
  static const Color textSecondary = Color(0xFF475569);

  /// Text Muted - Placeholders, disabled text (Slate 400)
  static const Color textMuted = Color(0xFF94A3B8);

  /// Border Color - Default borders (Slate 200)
  static const Color borderColor = Color(0xFFE2E8F0);

  /// Divider Color - Dividers and separators (Slate 300)
  static const Color dividerColor = Color(0xFFCBD5E1);

  // ==================== Grayscale (Tailwind Slate) ====================

  static const Color slate50 = Color(0xFFF8FAFC);
  static const Color slate100 = Color(0xFFF1F5F9);
  static const Color slate200 = Color(0xFFE2E8F0);
  static const Color slate300 = Color(0xFFCBD5E1);
  static const Color slate400 = Color(0xFF94A3B8);
  static const Color slate500 = Color(0xFF64748B);
  static const Color slate600 = Color(0xFF475569);
  static const Color slate700 = Color(0xFF334155);
  static const Color slate800 = Color(0xFF1E293B);
  static const Color slate900 = Color(0xFF0F172A);

  // ==================== Status Colors with Opacity ====================

  /// Pending status background (amber with opacity)
  static const Color pendingBg = Color(0xFFFEF3C7); // amber-100
  static const Color pendingText = Color(0xFFA16207); // amber-700

  /// Accepted status background (green with opacity)
  static const Color acceptedBg = Color(0xFFDCFCE7); // green-100
  static const Color acceptedText = Color(0xFF15803D); // green-700

  /// Rejected status background (red with opacity)
  static const Color rejectedBg = Color(0xFFFEE2E2); // red-100
  static const Color rejectedText = Color(0xFfB91C1C); // red-700

  // ==================== Gradient Colors ====================

  /// Primary gradient (for headers, hero sections)
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryBlue, secondaryTeal],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  /// Hero gradient (subtle, for backgrounds)
  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0x0D1E40AF), Colors.transparent],
    begin: Alignment.topRight,
    end: Alignment.center,
  );

  // ==================== Utility Methods ====================

  /// Get status color based on status string
  static Color getStatusColor(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'EN_ATTENTE':
        return pendingText;
      case 'ACCEPTED':
      case 'ACCEPTÉE':
        return acceptedText;
      case 'REJECTED':
      case 'REFUSÉE':
        return rejectedText;
      default:
        return textMuted;
    }
  }

  /// Get status background color based on status string
  static Color getStatusBgColor(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'EN_ATTENTE':
        return pendingBg;
      case 'ACCEPTED':
      case 'ACCEPTÉE':
        return acceptedBg;
      case 'REJECTED':
      case 'REFUSÉE':
        return rejectedBg;
      default:
        return slate100;
    }
  }
}

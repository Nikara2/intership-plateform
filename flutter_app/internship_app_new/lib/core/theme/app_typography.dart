import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// StageConnect Design System - Typography
/// Uses Plus Jakarta Sans for body text and Inter for headings
class AppTypography {
  // ==================== Font Families ====================

  /// Body text font - Plus Jakarta Sans (clean, modern, readable)
  static TextStyle get bodyFont => GoogleFonts.plusJakartaSans();

  /// Heading font - Inter (professional, bold)
  static TextStyle get headingFont => GoogleFonts.inter();

  // ==================== Display (Hero titles) ====================

  static TextStyle displayLarge = headingFont.copyWith(
    fontSize: 40,
    fontWeight: FontWeight.w700,
    height: 1.2,
    color: AppColors.textPrimary,
  );

  static TextStyle displayMedium = headingFont.copyWith(
    fontSize: 32,
    fontWeight: FontWeight.w700,
    height: 1.2,
    color: AppColors.textPrimary,
  );

  // ==================== Headlines (Section headers) ====================

  static TextStyle headlineLarge = headingFont.copyWith(
    fontSize: 28,
    fontWeight: FontWeight.w700,
    height: 1.3,
    color: AppColors.textPrimary,
  );

  static TextStyle headlineMedium = headingFont.copyWith(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 1.3,
    color: AppColors.textPrimary,
  );

  static TextStyle headlineSmall = headingFont.copyWith(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.4,
    color: AppColors.textPrimary,
  );

  // ==================== Title (Sub-headers) ====================

  static TextStyle titleLarge = bodyFont.copyWith(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 1.4,
    color: AppColors.textPrimary,
  );

  static TextStyle titleMedium = bodyFont.copyWith(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.4,
    color: AppColors.textPrimary,
  );

  static TextStyle titleSmall = bodyFont.copyWith(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    height: 1.4,
    color: AppColors.textPrimary,
  );

  // ==================== Body (Content) ====================

  static TextStyle bodyLarge = bodyFont.copyWith(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textPrimary,
  );

  static TextStyle bodyMedium = bodyFont.copyWith(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSecondary,
  );

  static TextStyle bodySmall = bodyFont.copyWith(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSecondary,
  );

  // ==================== Label (UI elements) ====================

  static TextStyle labelLarge = bodyFont.copyWith(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.4,
    color: AppColors.textPrimary,
  );

  static TextStyle labelMedium = bodyFont.copyWith(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.4,
    color: AppColors.textSecondary,
  );

  static TextStyle labelSmall = bodyFont.copyWith(
    fontSize: 10,
    fontWeight: FontWeight.w500,
    height: 1.4,
    color: AppColors.textMuted,
  );

  // ==================== Special Styles ====================

  /// Button text style
  static TextStyle button = bodyFont.copyWith(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.2,
    letterSpacing: 0.2,
  );

  /// Button text style (small)
  static TextStyle buttonSmall = bodyFont.copyWith(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    height: 1.2,
    letterSpacing: 0.2,
  );

  /// Caption text
  static TextStyle caption = bodyFont.copyWith(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.4,
    color: AppColors.textMuted,
  );

  /// Overline text (labels, metadata)
  static TextStyle overline = bodyFont.copyWith(
    fontSize: 10,
    fontWeight: FontWeight.w500,
    height: 1.4,
    letterSpacing: 0.5,
    color: AppColors.textMuted,
  );

  // ==================== Create TextTheme for MaterialApp ====================

  static TextTheme get textTheme => TextTheme(
    displayLarge: displayLarge,
    displayMedium: displayMedium,
    headlineLarge: headlineLarge,
    headlineMedium: headlineMedium,
    headlineSmall: headlineSmall,
    titleLarge: titleLarge,
    titleMedium: titleMedium,
    titleSmall: titleSmall,
    bodyLarge: bodyLarge,
    bodyMedium: bodyMedium,
    bodySmall: bodySmall,
    labelLarge: labelLarge,
    labelMedium: labelMedium,
    labelSmall: labelSmall,
  );
}

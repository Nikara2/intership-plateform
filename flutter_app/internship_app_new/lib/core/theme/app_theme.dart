import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';
import 'app_typography.dart';
import 'app_spacing.dart';

/// StageConnect Design System - Main Theme
class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,

      // ==================== Color Scheme ====================
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryBlue,
        secondary: AppColors.secondaryTeal,
        tertiary: AppColors.accentAmber,
        error: AppColors.errorRed,
        surface: AppColors.cardWhite,
        background: AppColors.background,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onTertiary: Colors.white,
        onError: Colors.white,
        onSurface: AppColors.textPrimary,
        onBackground: AppColors.textPrimary,
      ),

      // ==================== Scaffold ====================
      scaffoldBackgroundColor: AppColors.background,

      // ==================== App Bar ====================
      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: false,
        backgroundColor: AppColors.cardWhite,
        foregroundColor: AppColors.textPrimary,
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
        titleTextStyle: AppTypography.headlineMedium,
        iconTheme: const IconThemeData(
          color: AppColors.textPrimary,
          size: AppSpacing.iconMedium,
        ),
        shape: const Border(
          bottom: BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
      ),

      // ==================== Card ====================
      cardTheme: CardThemeData(
        color: AppColors.cardWhite,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
          side: const BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
        margin: EdgeInsets.zero,
      ),

      // ==================== Elevated Button ====================
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.accentAmber,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.spacing24,
            vertical: AppSpacing.spacing16,
          ),
          minimumSize: const Size(0, AppSpacing.buttonHeight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          ),
          textStyle: AppTypography.button,
        ),
      ),

      // ==================== Outlined Button ====================
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryBlue,
          side: const BorderSide(
            color: AppColors.primaryBlue,
            width: 1.5,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.spacing24,
            vertical: AppSpacing.spacing16,
          ),
          minimumSize: const Size(0, AppSpacing.buttonHeight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          ),
          textStyle: AppTypography.button,
        ),
      ),

      // ==================== Text Button ====================
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primaryBlue,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.spacing16,
            vertical: AppSpacing.spacing12,
          ),
          textStyle: AppTypography.button,
        ),
      ),

      // ==================== Input Decoration ====================
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.cardWhite,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.spacing16,
          vertical: AppSpacing.spacing12,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: AppColors.borderColor,
            width: 1,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: AppColors.primaryBlue,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: AppColors.errorRed,
            width: 1,
          ),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: AppColors.errorRed,
            width: 2,
          ),
        ),
        hintStyle: AppTypography.bodyLarge.copyWith(
          color: AppColors.textMuted,
        ),
        labelStyle: AppTypography.labelLarge,
        errorStyle: AppTypography.bodySmall.copyWith(
          color: AppColors.errorRed,
        ),
        prefixIconColor: AppColors.textMuted,
        suffixIconColor: AppColors.textMuted,
      ),

      // ==================== Chip ====================
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
        labelStyle: AppTypography.labelMedium.copyWith(
          color: AppColors.primaryBlue,
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.spacing12,
          vertical: AppSpacing.spacing8,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusSmall),
        ),
        elevation: 0,
        pressElevation: 0,
      ),

      // ==================== Bottom Navigation Bar ====================
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.cardWhite,
        selectedItemColor: AppColors.primaryBlue,
        unselectedItemColor: AppColors.textMuted,
        selectedLabelStyle: AppTypography.labelSmall.copyWith(
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: AppTypography.labelSmall,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        showSelectedLabels: true,
        showUnselectedLabels: true,
      ),

      // ==================== Floating Action Button ====================
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.accentAmber,
        foregroundColor: Colors.white,
        elevation: 6,
        shape: CircleBorder(),
      ),

      // ==================== Divider ====================
      dividerTheme: const DividerThemeData(
        color: AppColors.dividerColor,
        thickness: 1,
        space: 1,
      ),

      // ==================== Dialog ====================
      dialogTheme: DialogThemeData(
        backgroundColor: AppColors.cardWhite,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
        ),
        titleTextStyle: AppTypography.headlineSmall,
        contentTextStyle: AppTypography.bodyLarge,
      ),

      // ==================== Bottom Sheet ====================
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: AppColors.cardWhite,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppSpacing.radiusXLarge),
          ),
        ),
      ),

      // ==================== Snack Bar ====================
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.textPrimary,
        contentTextStyle: AppTypography.bodyMedium.copyWith(
          color: Colors.white,
        ),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusSmall),
        ),
      ),

      // ==================== Icon ====================
      iconTheme: const IconThemeData(
        color: AppColors.textPrimary,
        size: AppSpacing.iconMedium,
      ),

      // ==================== Typography ====================
      textTheme: AppTypography.textTheme,

      // ==================== Typography (Primary) ====================
      primaryTextTheme: AppTypography.textTheme,
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,

      // ==================== Color Scheme ====================
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primaryBlue,
        secondary: AppColors.secondaryTeal,
        tertiary: AppColors.accentAmber,
        error: AppColors.errorRed,
        surface: Color(0xFF1E1E1E),
        background: Color(0xFF121212),
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onTertiary: Colors.white,
        onError: Colors.white,
        onSurface: Color(0xFFE0E0E0),
        onBackground: Color(0xFFE0E0E0),
      ),

      // ==================== Scaffold ====================
      scaffoldBackgroundColor: const Color(0xFF121212),

      // ==================== App Bar ====================
      appBarTheme: AppBarTheme(
        elevation: 0,
        centerTitle: false,
        backgroundColor: const Color(0xFF1E1E1E),
        foregroundColor: const Color(0xFFE0E0E0),
        surfaceTintColor: Colors.transparent,
        systemOverlayStyle: SystemUiOverlayStyle.light,
        titleTextStyle: AppTypography.headlineMedium.copyWith(
          color: const Color(0xFFE0E0E0),
        ),
        iconTheme: const IconThemeData(
          color: Color(0xFFE0E0E0),
          size: AppSpacing.iconMedium,
        ),
        shape: const Border(
          bottom: BorderSide(
            color: Color(0xFF2C2C2C),
            width: 1,
          ),
        ),
      ),

      // ==================== Card ====================
      cardTheme: CardThemeData(
        color: const Color(0xFF1E1E1E),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
          side: const BorderSide(
            color: Color(0xFF2C2C2C),
            width: 1,
          ),
        ),
        margin: EdgeInsets.zero,
      ),

      // ==================== Elevated Button ====================
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.accentAmber,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.spacing24,
            vertical: AppSpacing.spacing16,
          ),
          minimumSize: const Size(0, AppSpacing.buttonHeight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          ),
          textStyle: AppTypography.button,
        ),
      ),

      // ==================== Outlined Button ====================
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primaryBlue,
          side: const BorderSide(
            color: AppColors.primaryBlue,
            width: 1.5,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.spacing24,
            vertical: AppSpacing.spacing16,
          ),
          minimumSize: const Size(0, AppSpacing.buttonHeight),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          ),
          textStyle: AppTypography.button,
        ),
      ),

      // ==================== Text Button ====================
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primaryBlue,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.spacing16,
            vertical: AppSpacing.spacing12,
          ),
          textStyle: AppTypography.button,
        ),
      ),

      // ==================== Input Decoration ====================
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF1E1E1E),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.spacing16,
          vertical: AppSpacing.spacing12,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: Color(0xFF2C2C2C),
            width: 1,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: Color(0xFF2C2C2C),
            width: 1,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: AppColors.primaryBlue,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: AppColors.errorRed,
            width: 1,
          ),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
          borderSide: const BorderSide(
            color: AppColors.errorRed,
            width: 2,
          ),
        ),
        hintStyle: AppTypography.bodyLarge.copyWith(
          color: const Color(0xFF757575),
        ),
        labelStyle: AppTypography.labelLarge.copyWith(
          color: const Color(0xFFE0E0E0),
        ),
        errorStyle: AppTypography.bodySmall.copyWith(
          color: AppColors.errorRed,
        ),
        prefixIconColor: const Color(0xFF757575),
        suffixIconColor: const Color(0xFF757575),
      ),

      // ==================== Chip ====================
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.primaryBlue.withOpacity(0.2),
        labelStyle: AppTypography.labelMedium.copyWith(
          color: AppColors.primaryBlue,
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.spacing12,
          vertical: AppSpacing.spacing8,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusSmall),
        ),
        elevation: 0,
        pressElevation: 0,
      ),

      // ==================== Bottom Navigation Bar ====================
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: const Color(0xFF1E1E1E),
        selectedItemColor: AppColors.primaryBlue,
        unselectedItemColor: const Color(0xFF757575),
        selectedLabelStyle: AppTypography.labelSmall.copyWith(
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: AppTypography.labelSmall,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        showSelectedLabels: true,
        showUnselectedLabels: true,
      ),

      // ==================== Floating Action Button ====================
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: AppColors.accentAmber,
        foregroundColor: Colors.white,
        elevation: 6,
        shape: CircleBorder(),
      ),

      // ==================== Divider ====================
      dividerTheme: const DividerThemeData(
        color: Color(0xFF2C2C2C),
        thickness: 1,
        space: 1,
      ),

      // ==================== Dialog ====================
      dialogTheme: DialogThemeData(
        backgroundColor: const Color(0xFF1E1E1E),
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
        ),
        titleTextStyle: AppTypography.headlineSmall.copyWith(
          color: const Color(0xFFE0E0E0),
        ),
        contentTextStyle: AppTypography.bodyLarge.copyWith(
          color: const Color(0xFFB0B0B0),
        ),
      ),

      // ==================== Bottom Sheet ====================
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: Color(0xFF1E1E1E),
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppSpacing.radiusXLarge),
          ),
        ),
      ),

      // ==================== Snack Bar ====================
      snackBarTheme: SnackBarThemeData(
        backgroundColor: const Color(0xFF2C2C2C),
        contentTextStyle: AppTypography.bodyMedium.copyWith(
          color: const Color(0xFFE0E0E0),
        ),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppSpacing.radiusSmall),
        ),
      ),

      // ==================== Icon ====================
      iconTheme: const IconThemeData(
        color: Color(0xFFE0E0E0),
        size: AppSpacing.iconMedium,
      ),

      // ==================== Typography ====================
      textTheme: AppTypography.textTheme.apply(
        bodyColor: const Color(0xFFE0E0E0),
        displayColor: const Color(0xFFE0E0E0),
      ),

      // ==================== Typography (Primary) ====================
      primaryTextTheme: AppTypography.textTheme.apply(
        bodyColor: const Color(0xFFE0E0E0),
        displayColor: const Color(0xFFE0E0E0),
      ),
    );
  }
}

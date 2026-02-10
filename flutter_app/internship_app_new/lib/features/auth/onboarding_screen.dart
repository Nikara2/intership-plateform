import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import 'login_screen.dart';

/// SCREEN 1: ONBOARDING - First launch welcome screen
/// Matches SuperDesign exactly: gradient background, glass cards, benefits
class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [AppColors.primaryBlue, AppColors.secondaryTeal],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.spacing32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Spacer(),

                // ==================== Logo Icon (Animated) ====================
                TweenAnimationBuilder(
                  duration: const Duration(seconds: 2),
                  tween: Tween<double>(begin: 0, end: 1),
                  builder: (context, double value, child) {
                    return Transform.translate(
                      offset: Offset(0, -10 * (1 - value).abs()),
                      child: child,
                    );
                  },
                  child: Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
                    ),
                    child: const Icon(
                      Icons.school_rounded,
                      size: 36,
                      color: Colors.white,
                    ),
                  ),
                ),

                const SizedBox(height: AppSpacing.spacing24),

                // ==================== App Name ====================
                RichText(
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: 'Stage',
                        style: AppTypography.displayMedium.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      TextSpan(
                        text: 'Connect',
                        style: AppTypography.displayMedium.copyWith(
                          color: AppColors.accentAmber,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: AppSpacing.spacing8),

                // ==================== Tagline ====================
                Text(
                  'Trouvez votre stage idéal',
                  style: AppTypography.titleLarge.copyWith(
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),

                const SizedBox(height: AppSpacing.spacing48),

                // ==================== Benefits Cards (Glass) ====================
                _buildBenefitCard(
                  icon: Icons.work_outline_rounded,
                  iconBg: AppColors.accentAmber.withOpacity(0.2),
                  iconColor: AppColors.accentAmber,
                  title: 'Offres Qualifiées',
                  subtitle: 'Accès aux meilleures entreprises.',
                ),
                const SizedBox(height: AppSpacing.spacing16),
                _buildBenefitCard(
                  icon: Icons.flash_on_rounded,
                  iconBg: Colors.white.withOpacity(0.2),
                  iconColor: Colors.white,
                  title: 'Candidature Rapide',
                  subtitle: 'Postulez en un clic seulement.',
                ),
                const SizedBox(height: AppSpacing.spacing16),
                _buildBenefitCard(
                  icon: Icons.verified_user_rounded,
                  iconBg: AppColors.secondaryTeal.withOpacity(0.4),
                  iconColor: Colors.white,
                  title: 'Accompagnement',
                  subtitle: 'Suivi personnalisé de vos étapes.',
                ),

                const Spacer(),

                // ==================== CTA Button ====================
                SizedBox(
                  width: double.infinity,
                  height: AppSpacing.buttonHeight,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const LoginScreen()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.accentAmber,
                      elevation: 8,
                      shadowColor: Colors.black26,
                    ),
                    child: Text(
                      'Commencer',
                      style: AppTypography.button.copyWith(
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: AppSpacing.spacing16),

                // ==================== Login Link ====================
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Déjà un compte ? ',
                      style: AppTypography.bodyMedium.copyWith(
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (_) => const LoginScreen()),
                        );
                      },
                      child: Text(
                        'Se connecter',
                        style: AppTypography.bodyMedium.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w700,
                          decoration: TextDecoration.underline,
                          decorationColor: AppColors.accentAmber,
                          decorationThickness: 2,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBenefitCard({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.spacing16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSpacing.radiusLarge),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
        // Glass morphism effect
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Icon
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: iconBg,
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              color: iconColor,
              size: 20,
            ),
          ),
          const SizedBox(width: AppSpacing.spacing16),
          // Text
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppTypography.titleSmall.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: AppTypography.bodySmall.copyWith(
                    color: Colors.white.withOpacity(0.6),
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

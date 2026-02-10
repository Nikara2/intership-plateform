import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../providers/auth_provider.dart';
import '../../providers/offers_provider.dart';
import '../../providers/application_provider.dart';
import '../../providers/notifications_provider.dart';
import '../../models/offer.dart';
import '../offers/offers_screen.dart';
import '../applications/applications_screen.dart';
import '../profile/profile_screen.dart';
import '../more/more_screen.dart';
import '../notifications/notifications_screen.dart';

/// Home Screen - Student Dashboard
/// Faithful implementation of SuperDesign dashboard
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    // Load data on startup
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = context.read<AuthProvider>();
      final notificationsProvider = context.read<NotificationsProvider>();

      if (authProvider.accessToken != null) {
        context.read<OffersProvider>().fetchOffers(authProvider.accessToken!);
        context.read<ApplicationsProvider>().fetchApplications(authProvider.accessToken!);

        // Generate welcome notification only on first launch
        // Wait for notifications to load before checking
        if (!notificationsProvider.isLoading && !notificationsProvider.isInitialized) {
          // Mark as initialized IMMEDIATELY to prevent duplicates
          notificationsProvider.markAsInitialized();

          final firstName = authProvider.studentProfile?.firstName ?? 'Étudiant';
          notificationsProvider.notifyWelcome(firstName);

          // Generate some sample notifications for demo
          notificationsProvider.notifyNewOffer(
            offerTitle: 'Stage Développeur Full Stack',
            companyName: 'TechCorp',
            offerId: 'sample-1',
          );

          notificationsProvider.notifyApplicationStatusChange(
            companyName: 'InnovateLab',
            status: 'PENDING',
            applicationId: 'sample-2',
          );
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer4<AuthProvider, OffersProvider, ApplicationsProvider, NotificationsProvider>(
      builder: (context, authProvider, offersProvider, applicationsProvider, notificationsProvider, _) {
        final firstName = authProvider.studentProfile?.firstName ?? 'Étudiant';
        final lastName = authProvider.studentProfile?.lastName ?? '';
        final level = authProvider.studentProfile?.level ?? 'Master 1';

        debugPrint('🏠 Building Dashboard');
        debugPrint('👤 firstName: $firstName, lastName: $lastName, level: $level');
        debugPrint('📱 isAuthenticated: ${authProvider.isAuthenticated}');

        return Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          body: Row(
            children: [
              // Sidebar Navigation (Desktop only)
              if (MediaQuery.of(context).size.width >= 1024)
                _buildSidebar(context),

              // Main Content
              Expanded(
                child: Column(
                  children: [
                    // App Bar
                    _buildAppBar(firstName, lastName, level, notificationsProvider),

                    // Scrollable Content
                    Expanded(
                      child: SingleChildScrollView(
                        padding: EdgeInsets.all(
                          MediaQuery.of(context).size.width >= 1024 ? 40 : 24,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Welcome Card
                            _buildWelcomeCard(firstName, context),
                            const SizedBox(height: 24),

                            // Profile Progress Card
                            _buildProfileProgressCard(authProvider, context),
                            const SizedBox(height: 32),

                            // Stats Grid
                            _buildStatsGrid(authProvider, applicationsProvider, offersProvider),
                            const SizedBox(height: 32),

                            // Offers + Activity Section
                            _buildOffersAndActivity(context, offersProvider, applicationsProvider),
                            const SizedBox(height: 100), // Space for bottom nav
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          // Mobile Bottom Navigation
          bottomNavigationBar: MediaQuery.of(context).size.width < 1024
              ? _buildMobileBottomNav(context)
              : null,
        );
      },
    );
  }

  // ==================== APP BAR ====================

  Widget _buildAppBar(String firstName, String lastName, String level, NotificationsProvider notificationsProvider) {
    return Container(
      height: 72,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(
            color: AppColors.slate200,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          // Logo
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.primaryBlue,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.school_rounded,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            'StageConnect',
            style: AppTypography.titleLarge.copyWith(
              color: AppColors.primaryBlue,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.5,
            ),
          ),
          const Spacer(),

          // Notification Bell
          Stack(
            children: [
              IconButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const NotificationsScreen(),
                    ),
                  );
                },
                icon: const Icon(
                  Icons.notifications_outlined,
                  size: 28,
                ),
                color: AppColors.slate600,
              ),
              if (notificationsProvider.hasUnread)
                Positioned(
                  right: 12,
                  top: 12,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    constraints: const BoxConstraints(
                      minWidth: 18,
                      minHeight: 18,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.accentAmber,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: Center(
                      child: Text(
                        notificationsProvider.unreadCount > 9
                            ? '9+'
                            : notificationsProvider.unreadCount.toString(),
                        style: AppTypography.labelSmall.copyWith(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),

          // User Info + Avatar
          Container(
            padding: const EdgeInsets.only(left: 16),
            decoration: BoxDecoration(
              border: Border(
                left: BorderSide(
                  color: AppColors.slate200,
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                // User Info (Hidden on small screens)
                LayoutBuilder(
                  builder: (context, constraints) {
                    final screenWidth = MediaQuery.of(context).size.width;
                    if (screenWidth >= 640) {
                      return Padding(
                        padding: const EdgeInsets.only(right: 12),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '$firstName $lastName',
                              style: AppTypography.bodyMedium.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            Text(
                              'Étudiant $level',
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.slate400,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),

                // Avatar - Clickable
                InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => const ProfileScreen(),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppColors.slate200,
                        width: 1,
                      ),
                    ),
                    child: ClipOval(
                      child: Image.network(
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=$firstName',
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => CircleAvatar(
                          backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
                          child: Text(
                            firstName[0].toUpperCase(),
                            style: AppTypography.titleMedium.copyWith(
                              color: AppColors.primaryBlue,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==================== SIDEBAR (DESKTOP) ====================

  Widget _buildSidebar(BuildContext context) {
    return Container(
      width: 256,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          right: BorderSide(
            color: AppColors.slate200,
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: [
          const SizedBox(height: 24),
          _buildNavItem(
            icon: Icons.home_rounded,
            label: 'Accueil',
            isActive: true,
          ),
          _buildNavItem(
            icon: Icons.work_outline_rounded,
            label: 'Offres',
            isActive: false,
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => const OffersScreen(),
                ),
              );
            },
          ),
          _buildNavItem(
            icon: Icons.description_outlined,
            label: 'Candidatures',
            isActive: false,
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => const ApplicationsScreen(),
                ),
              );
            },
          ),
          _buildNavItem(
            icon: Icons.person_outline_rounded,
            label: 'Profil',
            isActive: false,
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => const ProfileScreen(),
                ),
              );
            },
          ),
          const Spacer(),
          _buildNavItem(
            icon: Icons.more_horiz_rounded,
            label: 'Plus',
            isActive: false,
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => const MoreScreen(),
                ),
              );
            },
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required bool isActive,
    VoidCallback? onTap,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
      child: InkWell(
        onTap: onTap ?? () {},
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isActive
                ? AppColors.primaryBlue.withOpacity(0.1)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                color: isActive ? AppColors.primaryBlue : AppColors.slate600,
                size: 20,
              ),
              const SizedBox(width: 12),
              Text(
                label,
                style: AppTypography.bodyMedium.copyWith(
                  color: isActive ? AppColors.primaryBlue : AppColors.slate600,
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ==================== WELCOME CARD ====================

  Widget _buildWelcomeCard(String firstName, BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(48),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primaryBlue, AppColors.secondaryTeal],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Stack(
        children: [
          // Abstract shapes
          Positioned(
            right: -80,
            top: -80,
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            right: -40,
            bottom: 0,
            child: Container(
              width: 256,
              height: 256,
              decoration: BoxDecoration(
                color: AppColors.secondaryTeal.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
            ),
          ),

          // Content
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bonjour $firstName ! 👋',
                style: AppTypography.displayMedium.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Prêt à trouver votre stage de fin d\'études ?',
                style: AppTypography.bodyLarge.copyWith(
                  color: Colors.white.withOpacity(0.9),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const OffersScreen(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentAmber,
                  foregroundColor: Colors.white,
                  elevation: 4,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Découvrir les offres',
                      style: AppTypography.bodyMedium.copyWith(
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.arrow_forward_rounded, size: 20),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ==================== PROFILE PROGRESS CARD ====================

  Widget _buildProfileProgressCard(AuthProvider authProvider, BuildContext context) {
    final percentage = authProvider.profileCompletionPercentage;
    final missingFields = authProvider.missingProfileFields;
    final isComplete = percentage >= 100;

    // Don't show if profile is complete
    if (isComplete) {
      return const SizedBox.shrink();
    }

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.slate200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Icon
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.primaryBlue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.person_outline_rounded,
              color: AppColors.primaryBlue,
              size: 28,
            ),
          ),
          const SizedBox(width: 20),

          // Content
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Complétez votre profil',
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                    Text(
                      '$percentage%',
                      style: AppTypography.titleMedium.copyWith(
                        fontWeight: FontWeight.w700,
                        color: AppColors.primaryBlue,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                if (missingFields.isNotEmpty)
                  Text(
                    'Manquant: ${missingFields.join(', ')}',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                const SizedBox(height: 12),

                // Progress Bar
                Stack(
                  children: [
                    Container(
                      height: 8,
                      decoration: BoxDecoration(
                        color: AppColors.slate200,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    LayoutBuilder(
                      builder: (context, constraints) {
                        return Container(
                          height: 8,
                          width: constraints.maxWidth * (percentage / 100),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                AppColors.primaryBlue,
                                AppColors.secondaryTeal,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),

          // Action Button
          TextButton.icon(
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => const ProfileScreen(),
                ),
              );
            },
            icon: const Icon(Icons.edit_outlined, size: 18),
            label: const Text('Compléter'),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.primaryBlue,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: const BorderSide(color: AppColors.primaryBlue),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ==================== STATS GRID ====================

  Widget _buildStatsGrid(AuthProvider authProvider, ApplicationsProvider applicationsProvider, OffersProvider offersProvider) {
    // Calculate real stats
    final totalApplications = applicationsProvider.applications.length;
    final pendingApplications = applicationsProvider.pendingApplications.length;
    final totalOffers = offersProvider.offers.length; // Only count OPEN offers

    // Get profile completion from AuthProvider
    final profileProgress = authProvider.profileCompletionPercentage / 100;
    final profilePercentage = '${authProvider.profileCompletionPercentage}%';

    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth >= 1280
            ? 4
            : constraints.maxWidth >= 768
                ? 2
                : 1;

        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 24,
          crossAxisSpacing: 24,
          childAspectRatio: 2.5,
          children: [
            _buildStatCard(
              label: 'Candidatures',
              value: totalApplications.toString().padLeft(2, '0'),
              icon: Icons.send_rounded,
              iconBgColor: AppColors.primaryBlue.withOpacity(0.1),
              iconColor: AppColors.primaryBlue,
            ),
            _buildStatCard(
              label: 'Offres disponibles',
              value: totalOffers.toString().padLeft(2, '0'),
              icon: Icons.work_outline_rounded,
              iconBgColor: AppColors.accentAmber.withOpacity(0.1),
              iconColor: AppColors.accentAmber,
            ),
            _buildStatCard(
              label: 'En attente',
              value: pendingApplications.toString().padLeft(2, '0'),
              icon: Icons.schedule_rounded,
              iconBgColor: const Color(0xFFFED7AA).withOpacity(0.3),
              iconColor: const Color(0xFFEA580C),
            ),
            _buildStatCardWithProgress(
              label: 'Profil complété',
              value: profilePercentage,
              progress: profileProgress,
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatCard({
    required String label,
    required String value,
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.slate200),
        boxShadow: [
          BoxShadow(
            color: AppColors.slate900.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  label,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.slate600,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: AppTypography.headlineMedium.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: iconBgColor,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCardWithProgress({
    required String label,
    required String value,
    required double progress,
  }) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.slate200),
        boxShadow: [
          BoxShadow(
            color: AppColors.slate900.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            label,
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.slate600,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Text(
                value,
                style: AppTypography.headlineMedium.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  height: 8,
                  decoration: BoxDecoration(
                    color: AppColors.slate100,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: progress,
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppColors.successGreen,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ==================== OFFERS + ACTIVITY SECTION ====================

  Widget _buildOffersAndActivity(BuildContext context, OffersProvider offersProvider, ApplicationsProvider applicationsProvider) {
    final isDesktop = MediaQuery.of(context).size.width >= 1280;

    if (isDesktop) {
      return Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: _buildOffersSection(context, offersProvider),
          ),
          const SizedBox(width: 32),
          Expanded(
            flex: 1,
            child: _buildActivitySection(applicationsProvider),
          ),
        ],
      );
    }

    return Column(
      children: [
        _buildOffersSection(context, offersProvider),
        const SizedBox(height: 32),
        _buildActivitySection(applicationsProvider),
      ],
    );
  }

  Widget _buildOffersSection(BuildContext context, OffersProvider offersProvider) {
    // Get first 5 OPEN offers or all if less than 5
    final offers = offersProvider.offers.take(5).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Offres récentes',
              style: AppTypography.titleLarge.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => const OffersScreen(),
                  ),
                );
              },
              child: Text(
                'Voir tout',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.primaryBlue,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        if (offersProvider.isLoading && offers.isEmpty)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(32.0),
              child: CircularProgressIndicator(),
            ),
          )
        else if (offers.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Text(
                'Aucune offre disponible',
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.slate400,
                ),
              ),
            ),
          )
        else
          SizedBox(
            height: 220,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: offers.length,
              separatorBuilder: (_, __) => const SizedBox(width: 24),
              itemBuilder: (context, index) {
                final offer = offers[index];

                // Calculate days since creation
                final daysSinceCreation = DateTime.now().difference(offer.createdAt).inDays;
                String? badge;
                Color? badgeColor;

                if (daysSinceCreation == 0) {
                  badge = 'NOUVEAU';
                  badgeColor = AppColors.primaryBlue;
                } else if (daysSinceCreation <= 3) {
                  badge = 'Il y a ${daysSinceCreation}j';
                  badgeColor = AppColors.slate400;
                }

                return _buildOfferCardFromModel(
                  context: context,
                  offer: offer,
                  badge: badge,
                  badgeColor: badgeColor,
                );
              },
            ),
          ),
      ],
    );
  }

  Widget _buildOfferCard({
    required String company,
    required String location,
    required String title,
    required String salary,
    required String? badge,
    required Color? badgeColor,
    required String logoUrl,
  }) {
    return Container(
      width: 320,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.slate200),
        boxShadow: [
          BoxShadow(
            color: AppColors.slate900.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.slate100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    logoUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Icon(
                      Icons.business_rounded,
                      color: AppColors.slate400,
                    ),
                  ),
                ),
              ),
              if (badge != null)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: badgeColor!.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    badge,
                    style: AppTypography.labelSmall.copyWith(
                      color: badgeColor,
                      fontWeight: FontWeight.w700,
                      fontSize: 10,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: AppTypography.titleMedium.copyWith(
              fontWeight: FontWeight.w700,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            '$company • $location',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.slate600,
            ),
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: salary,
                      style: AppTypography.titleMedium.copyWith(
                        color: AppColors.primaryBlue,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    TextSpan(
                      text: ' /mois',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.slate400,
                      ),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentAmber,
                  foregroundColor: Colors.white,
                  elevation: 2,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 8,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  'Postuler',
                  style: AppTypography.bodySmall.copyWith(
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOfferCardFromModel({
    required BuildContext context,
    required Offer offer,
    required String? badge,
    required Color? badgeColor,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => const OffersScreen(),
          ),
        );
      },
      child: Container(
        width: 320,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.slate200),
          boxShadow: [
            BoxShadow(
              color: AppColors.slate900.withOpacity(0.06),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.slate100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: offer.companyLogo != null
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            offer.companyLogo!,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Icon(
                              Icons.business_rounded,
                              color: AppColors.slate400,
                            ),
                          ),
                        )
                      : Icon(
                          Icons.business_rounded,
                          color: AppColors.slate400,
                        ),
                ),
                if (badge != null)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: badgeColor,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      badge,
                      style: AppTypography.labelSmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 10,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              offer.companyName ?? 'Entreprise',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.slate500,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              offer.title,
              style: AppTypography.titleMedium.copyWith(
                fontWeight: FontWeight.w700,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  Icons.place_outlined,
                  size: 16,
                  color: AppColors.slate400,
                ),
                const SizedBox(width: 4),
                Text(
                  offer.location ?? 'Non spécifié',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.slate500,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.schedule_rounded,
                  size: 16,
                  color: AppColors.slate400,
                ),
                const SizedBox(width: 4),
                Text(
                  offer.duration ?? 'Non spécifié',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.slate500,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActivitySection(ApplicationsProvider applicationsProvider) {
    // Get recent applications (max 3)
    final recentApplications = applicationsProvider.applications.take(3).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Candidatures récentes',
          style: AppTypography.titleLarge.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 24),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.slate200),
            boxShadow: [
              BoxShadow(
                color: AppColors.slate900.withOpacity(0.06),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              if (recentApplications.isEmpty)
                Padding(
                  padding: const EdgeInsets.all(40),
                  child: Column(
                    children: [
                      Icon(
                        Icons.work_outline_rounded,
                        size: 48,
                        color: AppColors.slate300,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Aucune candidature',
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.slate400,
                        ),
                      ),
                    ],
                  ),
                )
              else
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: recentApplications.asMap().entries.map((entry) {
                      final index = entry.key;
                      final application = entry.value;

                      // Format time
                      final diff = DateTime.now().difference(application.appliedAt);
                      String time;
                      if (diff.inDays > 0) {
                        time = 'Il y a ${diff.inDays} jour${diff.inDays > 1 ? 's' : ''}';
                      } else if (diff.inHours > 0) {
                        time = 'Il y a ${diff.inHours}h';
                      } else {
                        time = 'Il y a ${diff.inMinutes}min';
                      }

                      // Status config
                      IconData icon;
                      Color iconColor;
                      String statusText;

                      if (application.status == 'ACCEPTED') {
                        icon = Icons.check_circle_rounded;
                        iconColor = AppColors.successGreen;
                        statusText = 'Candidature acceptée';
                      } else if (application.status == 'REJECTED') {
                        icon = Icons.cancel_rounded;
                        iconColor = AppColors.errorRed;
                        statusText = 'Candidature refusée';
                      } else if (application.status == 'PENDING') {
                        icon = Icons.schedule_rounded;
                        iconColor = AppColors.accentAmber;
                        statusText = 'Candidature envoyée';
                      } else {
                        icon = Icons.info_outline_rounded;
                        iconColor = AppColors.primaryBlue;
                        statusText = 'Candidature ${application.status.toLowerCase()}';
                      }

                      return Column(
                        children: [
                          if (index > 0) const SizedBox(height: 24),
                          _buildActivityItem(
                            icon: icon,
                            iconColor: iconColor,
                            iconBgColor: iconColor.withOpacity(0.1),
                            title: statusText,
                            description: '${application.offerTitle ?? 'Offre de stage'} - ${application.companyName ?? 'Entreprise'}',
                            time: time,
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ),
              InkWell(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const ApplicationsScreen(),
                    ),
                  );
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.slate50,
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(16),
                      bottomRight: Radius.circular(16),
                    ),
                    border: Border(
                      top: BorderSide(color: AppColors.slate200),
                    ),
                  ),
                  child: Center(
                    child: Text(
                      'Voir tout l\'historique',
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.slate600,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActivityItem({
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required String title,
    required String description,
    required String time,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32,
          height: 32,
          margin: const EdgeInsets.only(top: 4),
          decoration: BoxDecoration(
            color: iconBgColor,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: iconColor, size: 16),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: AppTypography.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.slate600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                time,
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.slate400,
                  fontSize: 10,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ==================== MOBILE BOTTOM NAV ====================

  Widget _buildMobileBottomNav(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: AppColors.slate200),
        ),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildMobileNavItem(
                icon: Icons.home_rounded,
                label: 'Accueil',
                isActive: true,
              ),
              _buildMobileNavItem(
                icon: Icons.work_outline_rounded,
                label: 'Offres',
                isActive: false,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const OffersScreen(),
                    ),
                  );
                },
              ),
              _buildMobileNavItem(
                icon: Icons.description_outlined,
                label: 'Candidatures',
                isActive: false,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const ApplicationsScreen(),
                    ),
                  );
                },
              ),
              _buildMobileNavItem(
                icon: Icons.person_outline_rounded,
                label: 'Profil',
                isActive: false,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const ProfileScreen(),
                    ),
                  );
                },
              ),
              _buildMobileNavItem(
                icon: Icons.more_horiz_rounded,
                label: 'Plus',
                isActive: false,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const MoreScreen(),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMobileNavItem({
    required IconData icon,
    required String label,
    required bool isActive,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap ?? () {},
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: isActive ? AppColors.primaryBlue : AppColors.slate400,
            size: 24,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: AppTypography.labelSmall.copyWith(
              color: isActive ? AppColors.primaryBlue : AppColors.slate400,
              fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }
}

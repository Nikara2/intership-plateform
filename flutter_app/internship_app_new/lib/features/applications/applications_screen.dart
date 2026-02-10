import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';
import '../../providers/application_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/application.dart';
import '../home/home_screen.dart';
import '../offers/offers_screen.dart';
import '../profile/profile_screen.dart';
import '../more/more_screen.dart';

/// APPLICATIONS SCREEN - Track internship applications
/// Features: tabs, status filters, detail panel, timeline, evaluations
class ApplicationsScreen extends StatefulWidget {
  const ApplicationsScreen({super.key});

  @override
  State<ApplicationsScreen> createState() => _ApplicationsScreenState();
}

class _ApplicationsScreenState extends State<ApplicationsScreen> {
  String _selectedTab = 'Toutes';
  String? _selectedApplicationId;
  final TextEditingController _searchController = TextEditingController();
  bool _isSearchVisible = false;

  @override
  void initState() {
    super.initState();
    // Fetch applications on load
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = context.read<AuthProvider>();
      final applicationsProvider = context.read<ApplicationsProvider>();

      if (authProvider.accessToken != null) {
        applicationsProvider.fetchApplications(authProvider.accessToken!);
      }
    });
  }


  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Application> _getFilteredApplications(ApplicationsProvider provider) {
    if (_selectedTab == 'Toutes') return provider.applications;
    if (_selectedTab == 'En attente') return provider.pendingApplications;
    if (_selectedTab == 'Acceptées') return provider.acceptedApplications;
    if (_selectedTab == 'Refusées') return provider.rejectedApplications;
    return provider.applications;
  }

  int _getTabCount(String tab, ApplicationsProvider provider) {
    if (tab == 'Toutes') return provider.applications.length;
    if (tab == 'En attente') return provider.pendingApplications.length;
    if (tab == 'Acceptées') return provider.acceptedApplications.length;
    if (tab == 'Refusées') return provider.rejectedApplications.length;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isDesktop = screenWidth >= 1024;

    return Consumer2<ApplicationsProvider, AuthProvider>(
      builder: (context, applicationsProvider, authProvider, _) {
        return Scaffold(
          backgroundColor: Colors.white,
          body: SafeArea(
            child: Column(
              children: [
                // ==================== Header ====================
                _buildHeader(applicationsProvider),

                // ==================== Tabs ====================
                _buildTabs(applicationsProvider),

                // ==================== Content ====================
                Expanded(
                  child: Row(
                    children: [
                      // Applications List
                      Expanded(
                        flex: isDesktop ? 1 : 1,
                        child: _buildApplicationsList(applicationsProvider, authProvider),
                      ),

                      // Detail Panel (Desktop only)
                      if (isDesktop && _selectedApplicationId != null)
                        Expanded(
                          flex: 1,
                          child: _buildDetailPanel(applicationsProvider),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          bottomNavigationBar: !isDesktop ? _buildMobileBottomNav() : null,
        );
      },
    );
  }

  Widget _buildHeader(ApplicationsProvider provider) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.spacing20),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppColors.slate100, width: 1),
        ),
      ),
      child: Row(
        children: [
          // Back button
          if (!_isSearchVisible)
            IconButton(
              onPressed: () => Navigator.of(context).pop(),
              icon: const Icon(Icons.arrow_back_rounded),
              color: AppColors.textPrimary,
            ),
          if (!_isSearchVisible) const SizedBox(width: 12),

          // Title or Search Field
          Expanded(
            child: _isSearchVisible
                ? TextField(
                    controller: _searchController,
                    autofocus: true,
                    decoration: InputDecoration(
                      hintText: 'Rechercher par entreprise ou titre...',
                      border: InputBorder.none,
                      hintStyle: AppTypography.bodyMedium.copyWith(
                        color: AppColors.textMuted,
                      ),
                    ),
                    style: AppTypography.bodyMedium,
                    onChanged: (value) {
                      provider.setSearchQuery(value);
                    },
                  )
                : Text(
                    'Mes Candidatures',
                    style: AppTypography.headlineMedium.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
          ),

          const SizedBox(width: 12),

          // Search button / Close search
          IconButton(
            onPressed: () {
              setState(() {
                _isSearchVisible = !_isSearchVisible;
                if (!_isSearchVisible) {
                  _searchController.clear();
                  provider.clearSearch();
                }
              });
            },
            icon: Icon(_isSearchVisible ? Icons.close_rounded : Icons.search_rounded),
            color: AppColors.textSecondary,
          ),

          // Filter button
          IconButton(
            onPressed: () => _showFilterDialog(provider),
            icon: const Icon(Icons.tune_rounded),
            color: AppColors.textSecondary,
          ),
        ],
      ),
    );
  }

  Widget _buildTabs(ApplicationsProvider provider) {
    final tabs = ['Toutes', 'En attente', 'Acceptées', 'Refusées'];

    return Container(
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppColors.slate100, width: 1),
        ),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.spacing20),
        child: Row(
          children: tabs.map((tab) {
            final isSelected = _selectedTab == tab;
            final count = _getTabCount(tab, provider);

            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedTab = tab;
                  _selectedApplicationId = null; // Reset selection
                });
              },
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      color: isSelected ? AppColors.primaryBlue : Colors.transparent,
                      width: 2,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      tab,
                      style: AppTypography.labelMedium.copyWith(
                        color: isSelected ? AppColors.primaryBlue : AppColors.textSecondary,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primaryBlue.withOpacity(0.1) : AppColors.slate100,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '$count',
                        style: AppTypography.bodySmall.copyWith(
                          color: isSelected ? AppColors.primaryBlue : AppColors.textSecondary,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildApplicationsList(ApplicationsProvider provider, AuthProvider authProvider) {
    // Show loading state
    if (provider.isLoading && provider.applications.isEmpty) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    // Show error state
    if (provider.error != null && provider.applications.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline_rounded,
              size: 64,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 16),
            Text(
              provider.error!,
              textAlign: TextAlign.center,
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                if (authProvider.accessToken != null) {
                  provider.fetchApplications(authProvider.accessToken!);
                }
              },
              child: const Text('Réessayer'),
            ),
          ],
        ),
      );
    }

    final applications = _getFilteredApplications(provider);

    if (applications.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.work_outline_rounded,
              size: 64,
              color: AppColors.textMuted,
            ),
            const SizedBox(height: 16),
            Text(
              'Aucune candidature',
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.spacing20),
      itemCount: applications.length,
      separatorBuilder: (context, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final app = applications[index];
        return _buildApplicationCard(app);
      },
    );
  }

  Widget _buildApplicationCard(Application app) {
    final isSelected = _selectedApplicationId == app.id;
    final status = app.status;

    Color statusColor;
    String statusText;
    if (status == 'PENDING') {
      statusColor = AppColors.accentAmber;
      statusText = 'En attente';
    } else if (status == 'ACCEPTED') {
      statusColor = AppColors.successGreen;
      statusText = 'Acceptée';
    } else if (status == 'REJECTED') {
      statusColor = AppColors.errorRed;
      statusText = 'Refusée';
    } else if (status == 'COMPLETED') {
      statusColor = AppColors.primaryBlue;
      statusText = 'Terminé';
    } else {
      statusColor = AppColors.slate400;
      statusText = status;
    }

    // Format date
    final now = DateTime.now();
    final difference = now.difference(app.appliedAt);
    String appliedDate;
    if (difference.inDays > 7) {
      appliedDate = 'Il y a ${(difference.inDays / 7).floor()} semaines';
    } else if (difference.inDays > 0) {
      appliedDate = 'Il y a ${difference.inDays} jours';
    } else if (difference.inHours > 0) {
      appliedDate = 'Il y a ${difference.inHours} heures';
    } else {
      appliedDate = 'Il y a ${difference.inMinutes} minutes';
    }

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedApplicationId = app.id;
        });

        // Show detail modal on mobile
        final screenWidth = MediaQuery.of(context).size.width;
        if (screenWidth < 1024) {
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            isDismissible: true,
            enableDrag: true,
            backgroundColor: Colors.transparent,
            builder: (context) => DraggableScrollableSheet(
              initialChildSize: 0.9,
              minChildSize: 0.5,
              maxChildSize: 0.95,
              builder: (context, scrollController) {
                return Container(
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                  ),
                  child: _buildDetailPanel(
                    context.read<ApplicationsProvider>(),
                    scrollController: scrollController,
                  ),
                );
              },
            ),
          );
        }
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.slate50 : Colors.white,
          border: Border.all(
            color: isSelected ? AppColors.primaryBlue : AppColors.borderColor,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Company Logo
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.slate100,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: app.companyLogo != null
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            app.companyLogo!,
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
                const SizedBox(width: 12),

                // Company & Position
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        app.companyName ?? 'Entreprise',
                        style: AppTypography.labelLarge.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        app.offerTitle ?? 'Offre de stage',
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),

                // Status Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    statusText,
                    style: AppTypography.bodySmall.copyWith(
                      color: statusColor,
                      fontWeight: FontWeight.w600,
                      fontSize: 11,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Date
            Row(
              children: [
                Icon(
                  Icons.calendar_today_outlined,
                  size: 14,
                  color: AppColors.textMuted,
                ),
                const SizedBox(width: 4),
                Text(
                  'Postulé $appliedDate',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailPanel(ApplicationsProvider provider, {ScrollController? scrollController}) {
    Application? app;
    try {
      app = provider.applications.firstWhere(
        (a) => a.id == _selectedApplicationId,
      );
    } catch (e) {
      return const Center(
        child: Text('Candidature non trouvée'),
      );
    }

    final status = app.status;
    Color statusColor;
    String statusText;
    IconData statusIcon;

    if (status == 'PENDING') {
      statusColor = AppColors.accentAmber;
      statusText = 'En attente';
      statusIcon = Icons.schedule_outlined;
    } else if (status == 'ACCEPTED') {
      statusColor = AppColors.successGreen;
      statusText = 'Acceptée';
      statusIcon = Icons.check_circle_outline;
    } else if (status == 'REJECTED') {
      statusColor = AppColors.errorRed;
      statusText = 'Refusée';
      statusIcon = Icons.cancel_outlined;
    } else if (status == 'COMPLETED') {
      statusColor = AppColors.primaryBlue;
      statusText = 'Terminée';
      statusIcon = Icons.done_all_rounded;
    } else {
      statusColor = AppColors.slate400;
      statusText = status;
      statusIcon = Icons.info_outline;
    }

    // Format date
    final appliedDate = '${app.appliedAt.day.toString().padLeft(2, '0')}/${app.appliedAt.month.toString().padLeft(2, '0')}/${app.appliedAt.year}';

    return Container(
      decoration: const BoxDecoration(
        border: Border(
          left: BorderSide(color: AppColors.slate100, width: 1),
        ),
      ),
      child: ListView(
        controller: scrollController,
        padding: const EdgeInsets.all(AppSpacing.spacing24),
        children: [
          // Close button for mobile
          if (scrollController != null)
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.close_rounded),
                  color: AppColors.textSecondary,
                ),
              ],
            ),

          // Header
          Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: AppColors.slate100,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: app.companyLogo != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          app.companyLogo!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Icon(
                            Icons.business_rounded,
                            color: AppColors.slate400,
                            size: 28,
                          ),
                        ),
                      )
                    : Icon(
                        Icons.business_rounded,
                        color: AppColors.slate400,
                        size: 28,
                      ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      app.companyName ?? 'Entreprise',
                      style: AppTypography.headlineSmall.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      app.offerTitle ?? 'Offre de stage',
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Status Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              border: Border.all(color: statusColor.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                Icon(
                  statusIcon,
                  color: statusColor,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Text(
                  statusText,
                  style: AppTypography.labelLarge.copyWith(
                    color: statusColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Details
          _buildSimpleDetailRow('ID Candidature', app.id),
          _buildSimpleDetailRow('ID Offre', app.offerId),
          _buildSimpleDetailRow('Date de candidature', appliedDate),
          _buildSimpleDetailRow('Statut', statusText),

          const SizedBox(height: 24),

          // Info message
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.slate50,
              borderRadius: BorderRadius.circular(AppSpacing.radiusMedium),
              border: Border.all(color: AppColors.slate200),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.info_outline_rounded,
                  color: AppColors.primaryBlue,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Les détails supplémentaires (timeline, documents, évaluation) seront disponibles prochainement.',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textSecondary,
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

  Widget _buildSimpleDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 150,
            child: Text(
              label,
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog(ApplicationsProvider provider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filtres'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tri par date',
              style: AppTypography.labelMedium.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Plus récentes d\'abord'),
              leading: Radio<String>(
                value: 'recent',
                groupValue: 'recent', // Default sort
                onChanged: (value) {
                  // Already sorted by recent in provider
                  Navigator.pop(context);
                },
              ),
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Plus anciennes d\'abord'),
              leading: Radio<String>(
                value: 'oldest',
                groupValue: 'recent',
                onChanged: (value) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Tri par anciennes à venir'),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Statut',
              style: AppTypography.labelMedium.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Utilisez les onglets ci-dessus pour filtrer par statut',
              style: AppTypography.bodySmall.copyWith(
                color: AppColors.textMuted,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              _searchController.clear();
              provider.clearSearch();
              Navigator.pop(context);
            },
            child: const Text('Réinitialiser'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Fermer'),
          ),
        ],
      ),
    );
  }

  Widget _buildMobileBottomNav() {
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
                isActive: false,
                onTap: () {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const HomeScreen()),
                    (route) => false,
                  );
                },
              ),
              _buildMobileNavItem(
                icon: Icons.work_outline_rounded,
                label: 'Offres',
                isActive: false,
                onTap: () {
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (_) => const OffersScreen()),
                  );
                },
              ),
              _buildMobileNavItem(
                icon: Icons.description_outlined,
                label: 'Candidatures',
                isActive: true,
                onTap: () {},
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
      onTap: onTap,
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

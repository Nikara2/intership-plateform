import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../providers/offers_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/application_provider.dart';
import '../../models/offer.dart';
import '../applications/applications_screen.dart';
import '../profile/profile_screen.dart';
import '../more/more_screen.dart';

/// Offers Screen - Browse internship offers
/// Faithful implementation of SuperDesign "StageConnect Internship Browser"
class OffersScreen extends StatefulWidget {
  const OffersScreen({super.key});

  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  String _selectedCategory = 'Tous';
  String? _selectedOfferId;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Fetch offers on load
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = context.read<AuthProvider>();
      final offersProvider = context.read<OffersProvider>();

      if (authProvider.accessToken != null) {
        offersProvider.fetchOffers(authProvider.accessToken!);
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 1024;

    return Consumer3<OffersProvider, AuthProvider, ApplicationsProvider>(
      builder: (context, offersProvider, authProvider, applicationsProvider, _) {
        return Scaffold(
          backgroundColor: AppColors.slate50,
          body: Row(
            children: [
              // Offers List Sidebar
              SizedBox(
                width: isDesktop ? 450 : MediaQuery.of(context).size.width,
                child: _buildOffersList(offersProvider, applicationsProvider, authProvider),
              ),

              // Offer Detail Panel (Desktop only)
              if (isDesktop && _selectedOfferId != null)
                Expanded(
                  child: _buildOfferDetail(
                    offersProvider.getOfferById(_selectedOfferId!)!,
                    applicationsProvider,
                    authProvider,
                  ),
                ),
            ],
          ),
          bottomNavigationBar: !isDesktop ? _buildMobileBottomNav() : null,
        );
      },
    );
  }

  // ==================== OFFERS LIST ====================

  Widget _buildOffersList(OffersProvider offersProvider, ApplicationsProvider applicationsProvider, AuthProvider authProvider) {
    final offers = offersProvider.offers;

    // Show loading state
    if (offersProvider.isLoading && offers.isEmpty) {
      return Container(
        color: Colors.white,
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    // Show error state
    if (offersProvider.error != null && offers.isEmpty) {
      return Container(
        color: Colors.white,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline_rounded,
                size: 64,
                color: AppColors.slate300,
              ),
              const SizedBox(height: 16),
              Text(
                offersProvider.error!,
                textAlign: TextAlign.center,
                style: AppTypography.titleMedium.copyWith(
                  color: AppColors.slate600,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  if (authProvider.accessToken != null) {
                    offersProvider.fetchOffers(authProvider.accessToken!);
                  }
                },
                child: const Text('Réessayer'),
              ),
            ],
          ),
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          right: BorderSide(color: AppColors.slate200),
        ),
      ),
      child: Column(
        children: [
          // Header Section
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(color: AppColors.slate100),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Offres de stage',
                      style: AppTypography.headlineMedium.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Search Bar
                TextField(
                  controller: _searchController,
                  onChanged: (value) {
                    offersProvider.setSearchQuery(value);
                  },
                  decoration: InputDecoration(
                    hintText: 'Rechercher un stage...',
                    hintStyle: AppTypography.bodyMedium.copyWith(
                      color: AppColors.slate400,
                    ),
                    prefixIcon: Icon(
                      Icons.search_rounded,
                      color: AppColors.slate400,
                    ),
                    suffixIcon: offersProvider.searchQuery.isNotEmpty
                        ? IconButton(
                            icon: Icon(
                              Icons.clear_rounded,
                              color: AppColors.slate400,
                            ),
                            onPressed: () {
                              _searchController.clear();
                              offersProvider.setSearchQuery('');
                            },
                          )
                        : null,
                    filled: true,
                    fillColor: AppColors.slate50,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: AppColors.slate200),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: AppColors.slate200),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(
                        color: AppColors.primaryBlue,
                        width: 2,
                      ),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Offers List
          Expanded(
            child: offers.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.search_off_rounded,
                          size: 64,
                          color: AppColors.slate300,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Aucune offre trouvée',
                          style: AppTypography.titleMedium.copyWith(
                            color: AppColors.slate400,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Essayez une autre recherche ou catégorie',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.slate400,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: offers.length,
                    itemBuilder: (context, index) {
                      final offer = offers[index];
                      return _buildOfferCard(offer, applicationsProvider);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(String category) {
    final isSelected = _selectedCategory == category;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedCategory = category;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBlue : Colors.transparent,
          border: isSelected
              ? null
              : Border.all(color: AppColors.slate200),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          category,
          style: AppTypography.bodySmall.copyWith(
            color: isSelected ? Colors.white : AppColors.slate600,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildOfferCard(Offer offer, ApplicationsProvider applicationsProvider) {
    final isSelected = _selectedOfferId == offer.id;
    final hasApplied = applicationsProvider.hasApplied(offer.id);

    // Format date
    final now = DateTime.now();
    final difference = now.difference(offer.createdAt);
    String publishedAt;
    if (difference.inDays > 7) {
      publishedAt = 'Il y a ${(difference.inDays / 7).floor()} semaines';
    } else if (difference.inDays > 0) {
      publishedAt = 'Il y a ${difference.inDays} jours';
    } else if (difference.inHours > 0) {
      publishedAt = 'Il y a ${difference.inHours} heures';
    } else {
      publishedAt = 'Il y a ${difference.inMinutes} minutes';
    }

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedOfferId = offer.id;
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(
            color: isSelected ? AppColors.primaryBlue : AppColors.slate200,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primaryBlue.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
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
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.slate100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: offer.companyLogo != null
                      ? Image.network(
                          offer.companyLogo!,
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => Icon(
                            Icons.business_rounded,
                            color: AppColors.slate400,
                          ),
                        )
                      : Icon(
                          Icons.business_rounded,
                          color: AppColors.slate400,
                        ),
                ),
                const SizedBox(width: 16),

                // Title & Company
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        offer.title,
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        offer.companyName ?? 'Entreprise',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.slate500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),

                // Applied Status Badge
                if (hasApplied)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primaryBlue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Postulé',
                      style: AppTypography.labelSmall.copyWith(
                        color: AppColors.primaryBlue,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),

            // Chips
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                if (offer.location != null)
                  _buildInfoChip(
                    Icons.place_outlined,
                    offer.location!,
                    AppColors.slate100,
                    AppColors.slate600,
                  ),
                if (offer.duration != null)
                  _buildInfoChip(
                    Icons.schedule_rounded,
                    offer.duration!,
                    AppColors.primaryBlue.withOpacity(0.1),
                    AppColors.primaryBlue,
                  ),
              ],
            ),
            const SizedBox(height: 16),

            // Footer
            Container(
              padding: const EdgeInsets.only(top: 16),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(color: AppColors.slate100),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    publishedAt,
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.slate400,
                    ),
                  ),
                  ElevatedButton(
                    onPressed: hasApplied
                        ? null
                        : () => _handleApply(offer.id, applicationsProvider),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: hasApplied
                          ? AppColors.slate200
                          : AppColors.accentAmber,
                      foregroundColor: Colors.white,
                      disabledBackgroundColor: AppColors.slate200,
                      disabledForegroundColor: AppColors.slate400,
                      elevation: hasApplied ? 0 : 4,
                      shadowColor: AppColors.accentAmber.withOpacity(0.3),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 8,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      hasApplied ? 'Déjà postulé' : 'Postuler',
                      style: AppTypography.bodySmall.copyWith(
                        fontWeight: FontWeight.w700,
                        color: hasApplied ? AppColors.slate400 : Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Handle application to an offer
  void _handleApply(String offerId, ApplicationsProvider applicationsProvider) async {
    final authProvider = context.read<AuthProvider>();

    if (authProvider.accessToken == null) {
      _showSnackBar('Vous devez être connecté pour postuler', isError: true);
      return;
    }

    // Show confirmation dialog
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmer la candidature'),
        content: const Text(
          'Êtes-vous sûr de vouloir postuler à cette offre ?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryBlue,
            ),
            child: const Text('Confirmer'),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    // Apply to offer
    final success = await applicationsProvider.applyToOffer(
      offerId,
      authProvider.accessToken!,
    );

    if (success) {
      _showSnackBar('Candidature envoyée avec succès');
    } else {
      _showSnackBar(
        applicationsProvider.error ?? 'Erreur lors de la candidature',
        isError: true,
      );
    }
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? AppColors.errorRed : AppColors.successGreen,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }

  Widget _buildInfoChip(
    IconData icon,
    String label,
    Color bgColor,
    Color textColor,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: textColor),
          const SizedBox(width: 4),
          Text(
            label,
            style: AppTypography.labelSmall.copyWith(
              color: textColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  // ==================== OFFER DETAIL ====================

  Widget _buildOfferDetail(Offer offer, ApplicationsProvider applicationsProvider, AuthProvider authProvider) {
    final hasApplied = applicationsProvider.hasApplied(offer.id);

    // Format deadline
    final daysUntilDeadline = offer.deadline.difference(DateTime.now()).inDays;
    String deadlineText;
    if (daysUntilDeadline < 0) {
      deadlineText = 'Expiré';
    } else if (daysUntilDeadline == 0) {
      deadlineText = 'Aujourd\'hui';
    } else if (daysUntilDeadline == 1) {
      deadlineText = 'Demain';
    } else {
      deadlineText = 'Dans $daysUntilDeadline jours';
    }
    return Container(
      color: Colors.white,
      child: Stack(
        children: [
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Hero Header
                Container(
                  height: 192,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppColors.primaryBlue,
                        const Color(0xFF3B82F6),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        top: 24,
                        left: 24,
                        child: IconButton(
                          onPressed: () {
                            setState(() {
                              _selectedOfferId = null;
                            });
                          },
                          icon: const Icon(Icons.arrow_back_rounded),
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.white.withOpacity(0.2),
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                      if (hasApplied)
                        Positioned(
                          top: 24,
                          right: 24,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'Postulé',
                              style: AppTypography.labelSmall.copyWith(
                                color: AppColors.primaryBlue,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),

                // Content
                Padding(
                  padding: const EdgeInsets.fromLTRB(48, 0, 48, 120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Company Logo
                      Transform.translate(
                        offset: const Offset(0, -40),
                        child: Container(
                          width: 96,
                          height: 96,
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: AppColors.slate100),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.slate900.withOpacity(0.1),
                                blurRadius: 16,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: offer.companyLogo != null
                              ? Image.network(
                                  offer.companyLogo!,
                                  fit: BoxFit.contain,
                                  errorBuilder: (_, __, ___) => Icon(
                                    Icons.business_rounded,
                                    color: AppColors.primaryBlue,
                                    size: 48,
                                  ),
                                )
                              : Icon(
                                  Icons.business_rounded,
                                  color: AppColors.primaryBlue,
                                  size: 48,
                                ),
                        ),
                      ),

                      // Title
                      Text(
                        offer.title,
                        style: AppTypography.displayMedium.copyWith(
                          fontWeight: FontWeight.w900,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),

                      // Company Name + Badge
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            offer.companyName ?? 'Entreprise',
                            style: AppTypography.titleMedium.copyWith(
                              color: AppColors.slate600,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            Icons.check_circle_rounded,
                            color: Colors.blue,
                            size: 20,
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),

                      // Meta Chips
                      Wrap(
                        alignment: WrapAlignment.center,
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          if (offer.location != null)
                            _buildMetaChip(
                              Icons.place_outlined,
                              offer.location!,
                            ),
                          if (offer.duration != null)
                            _buildMetaChip(
                              Icons.schedule_rounded,
                              offer.duration!,
                            ),
                          _buildMetaChip(
                            Icons.calendar_today_rounded,
                            deadlineText,
                          ),
                          _buildMetaChip(
                            Icons.work_outline_rounded,
                            offer.status == 'OPEN' ? 'Ouvert' : 'Fermé',
                          ),
                        ],
                      ),
                      const SizedBox(height: 48),

                      // Description
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Description du poste',
                          style: AppTypography.titleLarge.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        offer.description,
                        style: AppTypography.bodyMedium.copyWith(
                          color: AppColors.slate600,
                          height: 1.6,
                        ),
                      ),
                      const SizedBox(height: 48),

                      // Requirements
                      if (offer.requirements != null && offer.requirements!.isNotEmpty) ...[
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Text(
                            'Exigences',
                            style: AppTypography.titleLarge.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          offer.requirements!,
                          style: AppTypography.bodyMedium.copyWith(
                            color: AppColors.slate600,
                            height: 1.6,
                          ),
                        ),
                        const SizedBox(height: 48),
                      ],

                      // Deadline Info
                      Container(
                        padding: const EdgeInsets.all(32),
                        decoration: BoxDecoration(
                          color: AppColors.slate50,
                          border: Border.all(color: AppColors.slate200),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Icon(
                                  Icons.calendar_today_rounded,
                                  color: AppColors.primaryBlue,
                                  size: 32,
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Date limite de candidature',
                                        style: AppTypography.titleMedium.copyWith(
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        deadlineText,
                                        style: AppTypography.bodyMedium.copyWith(
                                          color: AppColors.slate600,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Sticky Bottom Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.8),
                border: Border(
                  top: BorderSide(color: AppColors.slate200),
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.slate900.withOpacity(0.15),
                    blurRadius: 32,
                    offset: const Offset(0, -8),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Date limite',
                          style: AppTypography.bodySmall.copyWith(
                            color: AppColors.slate400,
                          ),
                        ),
                        Text(
                          deadlineText,
                          style: AppTypography.titleLarge.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 24),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: hasApplied
                          ? null
                          : () => _handleApply(offer.id, applicationsProvider),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: hasApplied
                            ? AppColors.slate200
                            : AppColors.accentAmber,
                        foregroundColor: Colors.white,
                        disabledBackgroundColor: AppColors.slate200,
                        disabledForegroundColor: AppColors.slate400,
                        elevation: hasApplied ? 0 : 8,
                        shadowColor: AppColors.accentAmber.withOpacity(0.3),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: Text(
                        hasApplied ? 'Déjà postulé' : 'Postuler maintenant',
                        style: AppTypography.titleMedium.copyWith(
                          fontWeight: FontWeight.w700,
                          color: hasApplied ? AppColors.slate400 : Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetaChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.slate100,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18, color: AppColors.slate600),
          const SizedBox(width: 8),
          Text(
            label,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.slate600,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // ==================== MOBILE BOTTOM NAV ====================

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
                  Navigator.of(context).pop();
                },
              ),
              _buildMobileNavItem(
                icon: Icons.work_outline_rounded,
                label: 'Offres',
                isActive: true,
                onTap: () {},
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


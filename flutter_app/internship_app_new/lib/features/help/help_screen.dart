import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';

/// HELP SCREEN - Help center and FAQs
class HelpScreen extends StatelessWidget {
  const HelpScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.slate50,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Centre d\'aide',
          style: AppTypography.headlineMedium.copyWith(
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search bar
            _buildSearchBar(),
            const SizedBox(height: 24),

            // Quick Actions
            _buildQuickActions(context),
            const SizedBox(height: 32),

            // FAQ Section
            _buildSectionTitle('Questions fréquentes'),
            const SizedBox(height: 16),
            _buildFAQItem(
              '❓ Comment postuler à une offre de stage?',
              'Pour postuler à une offre:\n'
                  '1. Accédez à l\'onglet "Offres"\n'
                  '2. Parcourez les offres disponibles\n'
                  '3. Cliquez sur une offre pour voir les détails\n'
                  '4. Appuyez sur le bouton "Postuler"\n'
                  '5. Confirmez votre candidature',
            ),
            const SizedBox(height: 12),
            _buildFAQItem(
              '📋 Comment compléter mon profil?',
              'Pour compléter votre profil:\n'
                  '1. Accédez à l\'onglet "Profil"\n'
                  '2. Cliquez sur "Modifier le profil"\n'
                  '3. Remplissez tous les champs requis\n'
                  '4. Ajoutez vos compétences\n'
                  '5. Téléchargez votre CV\n'
                  '6. Rédigez une description personnelle',
            ),
            const SizedBox(height: 12),
            _buildFAQItem(
              '📄 Quels formats de CV sont acceptés?',
              'Les formats de CV acceptés sont:\n'
                  '• PDF (.pdf)\n'
                  '• Word (.doc, .docx)\n\n'
                  'Taille maximale: 5 MB\n\n'
                  'Assurez-vous que votre CV est à jour et bien formaté.',
            ),
            const SizedBox(height: 12),
            _buildFAQItem(
              '🔔 Comment gérer mes notifications?',
              'Pour gérer vos notifications:\n'
                  '1. Cliquez sur l\'icône de cloche 🔔\n'
                  '2. Consultez vos notifications\n'
                  '3. Glissez vers la gauche pour supprimer\n'
                  '4. Utilisez "Tout marquer comme lu" si nécessaire',
            ),
            const SizedBox(height: 12),
            _buildFAQItem(
              '📊 Comment suivre mes candidatures?',
              'Pour suivre vos candidatures:\n'
                  '1. Accédez à l\'onglet "Candidatures"\n'
                  '2. Utilisez les onglets pour filtrer par statut:\n'
                  '   • Toutes\n'
                  '   • En attente\n'
                  '   • Acceptées\n'
                  '   • Refusées\n'
                  '3. Utilisez la recherche pour trouver une candidature spécifique',
            ),
            const SizedBox(height: 12),
            _buildFAQItem(
              '🔍 Comment rechercher des offres?',
              'Pour rechercher des offres:\n'
                  '1. Accédez à l\'onglet "Offres"\n'
                  '2. Utilisez la barre de recherche en haut\n'
                  '3. Tapez des mots-clés (entreprise, poste, lieu)\n'
                  '4. Les résultats se mettent à jour en temps réel',
            ),
            const SizedBox(height: 32),

            // Contact Section
            _buildSectionTitle('Besoin d\'aide supplémentaire?'),
            const SizedBox(height: 16),
            _buildContactCard(
              icon: Icons.email_outlined,
              title: 'Email',
              subtitle: 'support@stageconnect.com',
              onTap: () {},
            ),
            const SizedBox(height: 12),
            _buildContactCard(
              icon: Icons.phone_outlined,
              title: 'Téléphone',
              subtitle: '+33 1 23 45 67 89',
              onTap: () {},
            ),
            const SizedBox(height: 12),
            _buildContactCard(
              icon: Icons.schedule_outlined,
              title: 'Horaires d\'assistance',
              subtitle: 'Lun-Ven: 9h-18h',
              onTap: null,
            ),
            const SizedBox(height: 32),

            // Useful Links
            _buildSectionTitle('Liens utiles'),
            const SizedBox(height: 16),
            _buildLinkItem('📖 Guide de démarrage', () {}),
            _buildLinkItem('📝 Conditions d\'utilisation', () {}),
            _buildLinkItem('🔒 Politique de confidentialité', () {}),
            _buildLinkItem('ℹ️ À propos de StageConnect', () {}),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.slate200),
      ),
      child: TextField(
        decoration: InputDecoration(
          hintText: 'Rechercher dans l\'aide...',
          border: InputBorder.none,
          icon: Icon(Icons.search_rounded, color: AppColors.slate400),
          hintStyle: AppTypography.bodyMedium.copyWith(
            color: AppColors.textMuted,
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildQuickActionCard(
            icon: Icons.video_library_rounded,
            title: 'Tutoriels',
            color: AppColors.primaryBlue,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Tutoriels à venir')),
              );
            },
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildQuickActionCard(
            icon: Icons.chat_bubble_outline_rounded,
            title: 'Chat support',
            color: AppColors.successGreen,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Chat support à venir')),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.slate200),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: AppTypography.bodyMedium.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: AppTypography.titleLarge.copyWith(
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimary,
      ),
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.slate200),
      ),
      child: ExpansionTile(
        title: Text(
          question,
          style: AppTypography.bodyMedium.copyWith(
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Text(
              answer,
              style: AppTypography.bodyMedium.copyWith(
                color: AppColors.textSecondary,
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.slate200),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primaryBlue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppColors.primaryBlue, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTypography.labelMedium.copyWith(
                      color: AppColors.textMuted,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: AppTypography.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
            if (onTap != null)
              Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppColors.slate400),
          ],
        ),
      ),
    );
  }

  Widget _buildLinkItem(String title, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.slate200),
        ),
        child: Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.primaryBlue,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Icon(Icons.arrow_forward_ios_rounded, size: 16, color: AppColors.slate400),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/evaluations_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/evaluation.dart';
import '../../core/theme/app_colors.dart';

/// Evaluation Screen - Displays student evaluations from supervisors
class EvaluationScreen extends StatefulWidget {
  const EvaluationScreen({super.key});

  @override
  State<EvaluationScreen> createState() => _EvaluationScreenState();
}

class _EvaluationScreenState extends State<EvaluationScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch evaluations on screen load
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final evaluationsProvider = Provider.of<EvaluationsProvider>(context, listen: false);

      if (authProvider.accessToken != null) {
        evaluationsProvider.fetchEvaluations(authProvider.accessToken!);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final evaluationsProvider = Provider.of<EvaluationsProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    return RefreshIndicator(
      onRefresh: () async {
        if (authProvider.accessToken != null) {
          await evaluationsProvider.fetchEvaluations(authProvider.accessToken!);
        }
      },
      child: evaluationsProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : evaluationsProvider.error != null
              ? _buildErrorState(evaluationsProvider.error!, authProvider, evaluationsProvider)
              : evaluationsProvider.evaluations.isEmpty
                  ? _buildEmptyState()
                  : _buildEvaluationsList(evaluationsProvider),
    );
  }

  Widget _buildEvaluationsList(EvaluationsProvider provider) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Average Score Card
        if (provider.hasEvaluations) ...[
          _buildAverageScoreCard(provider),
          const SizedBox(height: 16),
        ],

        // Evaluations List
        ...provider.evaluations.map((eval) => EvaluationCard(evaluation: eval)),
      ],
    );
  }

  Widget _buildAverageScoreCard(EvaluationsProvider provider) {
    final avgScore = provider.averageScore;
    final percentage = (avgScore / 100) * 100;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.primaryBlue, AppColors.secondaryTeal],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryBlue.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          const Text(
            'Score Moyen',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '${avgScore.toStringAsFixed(1)}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 48,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            '${percentage.toStringAsFixed(0)}%',
            style: TextStyle(
              color: Colors.white.withOpacity(0.9),
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${provider.evaluations.length} évaluation${provider.evaluations.length > 1 ? 's' : ''}',
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.assessment_outlined,
              size: 80,
              color: Colors.grey.shade300,
            ),
            const SizedBox(height: 16),
            Text(
              'Aucune évaluation',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Vos évaluations apparaîtront ici une fois que vos stages seront terminés et évalués.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(String error, AuthProvider authProvider, EvaluationsProvider evaluationsProvider) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 80,
              color: Colors.red.shade300,
            ),
            const SizedBox(height: 16),
            Text(
              'Erreur',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              error,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                if (authProvider.accessToken != null) {
                  evaluationsProvider.fetchEvaluations(authProvider.accessToken!);
                }
              },
              icon: const Icon(Icons.refresh),
              label: const Text('Réessayer'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class EvaluationCard extends StatelessWidget {
  final Evaluation evaluation;

  const EvaluationCard({
    super.key,
    required this.evaluation,
  });

  @override
  Widget build(BuildContext context) {
    final company = evaluation.companyName ?? 'Entreprise inconnue';
    final supervisor = evaluation.supervisorName ?? 'Superviseur';
    final scorePercentage = evaluation.score;
    final scoreOutOf5 = (evaluation.score / 100) * 5;
    final comment = evaluation.comment ?? 'Pas de commentaire';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 6,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      company,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "Encadrant : $supervisor",
                      style: TextStyle(color: Colors.grey.shade700),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getScoreColor(scorePercentage).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '$scorePercentage%',
                  style: TextStyle(
                    color: _getScoreColor(scorePercentage),
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.star, color: Colors.amber, size: 20),
              const SizedBox(width: 6),
              Text(
                "${scoreOutOf5.toStringAsFixed(1)} / 5",
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            comment,
            style: TextStyle(color: Colors.grey.shade800),
          ),
          const SizedBox(height: 8),
          Text(
            'Évalué le ${_formatDate(evaluation.evaluatedAt)}',
            style: TextStyle(
              color: Colors.grey.shade500,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Color _getScoreColor(int score) {
    if (score >= 80) return Colors.green;
    if (score >= 60) return Colors.orange;
    return Colors.red;
  }

  String _formatDate(DateTime date) {
    final months = [
      'jan', 'fév', 'mar', 'avr', 'mai', 'jun',
      'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }
}

import 'package:flutter/material.dart';

class EvaluationScreen extends StatelessWidget {
  const EvaluationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        EvaluationCard(
          company: "Orange Burkina",
          supervisor: "M. Traoré",
          score: 4.5,
          comment:
          "Très bon stagiaire, sérieux et impliqué dans les projets confiés.",
        ),
        EvaluationCard(
          company: "SONABEL",
          supervisor: "Mme Kaboré",
          score: 3.8,
          comment:
          "Bon travail dans l’ensemble, encore des efforts sur l’autonomie.",
        ),
      ],
    );
  }
}

class EvaluationCard extends StatelessWidget {
  final String company;
  final String supervisor;
  final double score;
  final String comment;

  const EvaluationCard({
    super.key,
    required this.company,
    required this.supervisor,
    required this.score,
    required this.comment,
  });

  @override
  Widget build(BuildContext context) {
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
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.star, color: Colors.amber),
              const SizedBox(width: 6),
              Text(
                "$score / 5",
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            comment,
            style: TextStyle(color: Colors.grey.shade800),
          ),
        ],
      ),
    );
  }
}

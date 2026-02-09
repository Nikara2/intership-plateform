import 'package:flutter/material.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        HistoryItem(
          title: "Candidature envoyée",
          company: "Tech Solutions",
          date: "12 Jan 2026",
          icon: Icons.send_outlined,
          color: Colors.blueAccent,
        ),
        HistoryItem(
          title: "Stage accepté",
          company: "Digital Africa",
          date: "20 Jan 2026",
          icon: Icons.check_circle_outline,
          color: Colors.green,
        ),
        HistoryItem(
          title: "Évaluation reçue",
          company: "CyberLab",
          date: "05 Fév 2026",
          icon: Icons.star_outline,
          color: Colors.orange,
        ),
        HistoryItem(
          title: "Candidature refusée",
          company: "Data Insight",
          date: "18 Fév 2026",
          icon: Icons.cancel_outlined,
          color: Colors.redAccent,
        ),
      ],
    );
  }
}

class HistoryItem extends StatelessWidget {
  final String title;
  final String company;
  final String date;
  final IconData icon;
  final Color color;

  const HistoryItem({
    super.key,
    required this.title,
    required this.company,
    required this.date,
    required this.icon,
    required this.color,
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
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  company,
                  style: TextStyle(
                    color: Colors.grey.shade700,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  date,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade500,
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

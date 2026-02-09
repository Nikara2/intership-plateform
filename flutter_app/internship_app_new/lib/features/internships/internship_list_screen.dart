import 'package:flutter/material.dart';
import 'internship_detail_screen.dart';

class InternshipListScreen extends StatelessWidget {
  const InternshipListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        InternshipCard(
          title: 'Stage Développeur Flutter',
          company: 'Tech Solutions',
          location: 'Ouagadougou',
          duration: '3 mois',
          description:
          "Participation au développement d'une application mobile Flutter, maintenance et amélioration des fonctionnalités existantes.",
          requirements: "Flutter, Dart, notions REST API, Git.",
        ),
        InternshipCard(
          title: 'Stage Data Analyst',
          company: 'DataCorp',
          location: 'Bobo-Dioulasso',
          duration: '2 mois',
          description:
          "Analyse de données pour aider à la prise de décision et création de dashboards.",
          requirements: "SQL, Excel, Python, PowerBI.",
        ),
      ],
    );
  }
}

class InternshipCard extends StatelessWidget {
  final String title;
  final String company;
  final String location;
  final String duration;
  final String description;
  final String requirements;

  const InternshipCard({
    super.key,
    required this.title,
    required this.company,
    required this.location,
    required this.duration,
    required this.description,
    required this.requirements,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style: const TextStyle(
                    fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text(company),
            const SizedBox(height: 6),
            Row(
              children: [
                const Icon(Icons.location_on_outlined, size: 16),
                const SizedBox(width: 4),
                Text(location),
                const SizedBox(width: 16),
                const Icon(Icons.schedule_outlined, size: 16),
                const SizedBox(width: 4),
                Text(duration),
              ],
            ),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => InternshipDetailScreen(
                        title: title,
                        company: company,
                        location: location,
                        duration: duration,
                        description: description,
                        requirements: requirements,
                      ),
                    ),
                  );
                },
                child: const Text('Voir détail'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

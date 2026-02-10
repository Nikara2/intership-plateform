import 'package:flutter/material.dart';
import '/providers/application_provider.dart';


import 'package:provider/provider.dart';

class InternshipDetailScreen extends StatelessWidget {
  final String title;
  final String company;
  final String location;
  final String duration;
  final String description;
  final String requirements;

  const InternshipDetailScreen({
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
    return Scaffold(
      appBar: AppBar(
        title: const Text("Détails du stage"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          Text(company, style: const TextStyle(fontSize: 16)),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.location_on_outlined),
              const SizedBox(width: 6),
              Text(location),
              const SizedBox(width: 16),
              const Icon(Icons.schedule_outlined),
              const SizedBox(width: 6),
              Text(duration),
            ],
          ),
          const SizedBox(height: 16),
          Text("Description", style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 6),
          Text(description),
          const SizedBox(height: 16),
          Text("Exigences", style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 6),
          Text(requirements),
          const SizedBox(height: 24),
          Consumer<ApplicationsProvider>(
            builder: (context, applications, _) {
              bool alreadyApplied = applications.hasApplied(title);

              return ElevatedButton(
                onPressed: alreadyApplied
                    ? null
                    : () {
                  // TODO: Implement with applyToOffer(offerId, accessToken)
                  // This screen needs to be updated to use offer IDs
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Utilisez la page Offres pour postuler')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                  backgroundColor: alreadyApplied ? Colors.grey : Colors.blueAccent,
                ),
                child: Text(alreadyApplied ? 'Déjà postulé' : 'Postuler'),
              );
            },
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';

enum ApplicationStatus { pending, accepted, rejected }

class Application {
  final String title;
  final String company;
  final DateTime appliedAt;
  ApplicationStatus status;

  Application({
    required this.title,
    required this.company,
    required this.appliedAt,
    this.status = ApplicationStatus.pending,
  });
}

class ApplicationsProvider extends ChangeNotifier {
  final List<Application> _applications = [];

  List<Application> get applications => _applications;

  /// Postuler à une offre
  void apply(String title, String company) {
    if (!hasApplied(title)) {
      _applications.add(Application(
        title: title,
        company: company,
        appliedAt: DateTime.now(),
      ));
      notifyListeners();
    }
  }

  /// Vérifie si déjà postulé
  bool hasApplied(String title) {
    return _applications.any((app) => app.title == title);
  }

  /// Mettre à jour le statut d'une candidature
  void updateStatus(String title, ApplicationStatus status) {
    for (var app in _applications) {
      if (app.title == title) {
        app.status = status;
        break;
      }
    }
    notifyListeners();
  }

  /// Charger depuis backend (exemple rapide)
  Future<void> fetchApplications(String token) async {
    // TODO: Implémenter récupération via API
    // Pour l'instant on peut garder le mock local
  }
}

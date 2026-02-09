import '../../core/theme/ApplicationStatus.dart';


class ApplicationModel {
  final String offerTitle;
  final String company;
  final ApplicationStatus status;
  final DateTime appliedAt;

  ApplicationModel({
    required this.offerTitle,
    required this.company,
    required this.status,
    required this.appliedAt,
  });
}

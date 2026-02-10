/// Application Model - Student application to an offer
class Application {
  final String id;
  final String studentId;
  final String offerId;
  final String status; // PENDING, ACCEPTED, REJECTED, COMPLETED
  final DateTime appliedAt;

  // Optional related data (if included in response)
  final String? offerTitle;
  final String? companyName;
  final String? companyLogo;

  Application({
    required this.id,
    required this.studentId,
    required this.offerId,
    required this.status,
    required this.appliedAt,
    this.offerTitle,
    this.companyName,
    this.companyLogo,
  });

  factory Application.fromJson(Map<String, dynamic> json) {
    return Application(
      id: json['id'],
      studentId: json['student_id'],
      offerId: json['offer_id'],
      status: json['status'] ?? 'PENDING',
      appliedAt: DateTime.parse(json['applied_at']),
      offerTitle: json['offer']?['title'],
      companyName: json['offer']?['company']?['name'],
      companyLogo: json['offer']?['company']?['logo'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'student_id': studentId,
      'offer_id': offerId,
      'status': status,
      'applied_at': appliedAt.toIso8601String(),
    };
  }
}

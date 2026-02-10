/// Offer Model - Internship offer from companies
class Offer {
  final String id;
  final String companyId;
  final String title;
  final String description;
  final String? location;
  final String? duration;
  final String? requirements;
  final DateTime deadline;
  final String status; // OPEN or CLOSED
  final DateTime createdAt;

  // Optional company info (if included in response)
  final String? companyName;
  final String? companyLogo;

  Offer({
    required this.id,
    required this.companyId,
    required this.title,
    required this.description,
    this.location,
    this.duration,
    this.requirements,
    required this.deadline,
    required this.status,
    required this.createdAt,
    this.companyName,
    this.companyLogo,
  });

  factory Offer.fromJson(Map<String, dynamic> json) {
    return Offer(
      id: json['id'],
      companyId: json['company_id'],
      title: json['title'],
      description: json['description'],
      location: json['location'],
      duration: json['duration'],
      requirements: json['requirements'],
      deadline: DateTime.parse(json['deadline']),
      status: json['status'] ?? 'OPEN',
      createdAt: DateTime.parse(json['created_at']),
      companyName: json['company']?['name'],
      companyLogo: json['company']?['logo'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'company_id': companyId,
      'title': title,
      'description': description,
      'location': location,
      'duration': duration,
      'requirements': requirements,
      'deadline': deadline.toIso8601String(),
      'status': status,
      'created_at': createdAt.toIso8601String(),
    };
  }
}

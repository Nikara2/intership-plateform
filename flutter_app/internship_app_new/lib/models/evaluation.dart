class Evaluation {
  final String id;
  final String applicationId;
  final String supervisorId;
  final int score;
  final String? comment;
  final DateTime evaluatedAt;

  // Related data (from backend joins)
  final String? companyName;
  final String? supervisorName;
  final String? offerTitle;

  Evaluation({
    required this.id,
    required this.applicationId,
    required this.supervisorId,
    required this.score,
    this.comment,
    required this.evaluatedAt,
    this.companyName,
    this.supervisorName,
    this.offerTitle,
  });

  factory Evaluation.fromJson(Map<String, dynamic> json) {
    return Evaluation(
      id: json['id'] ?? '',
      applicationId: json['application_id'] ?? '',
      supervisorId: json['supervisor_id'] ?? '',
      score: json['score'] ?? 0,
      comment: json['comment'],
      evaluatedAt: json['evaluated_at'] != null
          ? DateTime.parse(json['evaluated_at'])
          : DateTime.now(),
      companyName: json['application']?['offer']?['company']?['name'],
      supervisorName: json['supervisor']?['name'] ?? json['supervisor']?['user']?['email']?.split('@')[0],
      offerTitle: json['application']?['offer']?['title'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'application_id': applicationId,
      'supervisor_id': supervisorId,
      'score': score,
      'comment': comment,
      'evaluated_at': evaluatedAt.toIso8601String(),
    };
  }
}

/// Notification Model - User notifications
class AppNotification {
  final String id;
  final String title;
  final String message;
  final String type; // APPLICATION_STATUS, NEW_OFFER, EVALUATION, SYSTEM
  final DateTime createdAt;
  final bool isRead;
  final String? relatedId; // ID of related entity (application, offer, etc.)
  final String? actionUrl; // Deep link or route to navigate to

  AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.createdAt,
    this.isRead = false,
    this.relatedId,
    this.actionUrl,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'],
      title: json['title'],
      message: json['message'],
      type: json['type'] ?? 'SYSTEM',
      createdAt: DateTime.parse(json['created_at']),
      isRead: json['is_read'] ?? false,
      relatedId: json['related_id'],
      actionUrl: json['action_url'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'type': type,
      'created_at': createdAt.toIso8601String(),
      'is_read': isRead,
      'related_id': relatedId,
      'action_url': actionUrl,
    };
  }

  AppNotification copyWith({
    String? id,
    String? title,
    String? message,
    String? type,
    DateTime? createdAt,
    bool? isRead,
    String? relatedId,
    String? actionUrl,
  }) {
    return AppNotification(
      id: id ?? this.id,
      title: title ?? this.title,
      message: message ?? this.message,
      type: type ?? this.type,
      createdAt: createdAt ?? this.createdAt,
      isRead: isRead ?? this.isRead,
      relatedId: relatedId ?? this.relatedId,
      actionUrl: actionUrl ?? this.actionUrl,
    );
  }
}

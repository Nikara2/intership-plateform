class StudentProfile {
  final String firstName;
  final String lastName;
  final String school;
  final String program;
  final String level;
  final String phone;
  final String? about;
  final List<String>? skills;
  final String? cvUrl;

  StudentProfile({
    required this.firstName,
    required this.lastName,
    required this.school,
    required this.program,
    required this.level,
    required this.phone,
    this.about,
    this.skills,
    this.cvUrl,
  });

  /// ✅ copyWith (indispensable pour update profile)
  StudentProfile copyWith({
    String? firstName,
    String? lastName,
    String? school,
    String? program,
    String? level,
    String? phone,
    String? about,
    List<String>? skills,
    String? cvUrl,
  }) {
    return StudentProfile(
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      school: school ?? this.school,
      program: program ?? this.program,
      level: level ?? this.level,
      phone: phone ?? this.phone,
      about: about ?? this.about,
      skills: skills ?? this.skills,
      cvUrl: cvUrl ?? this.cvUrl,
    );
  }
}

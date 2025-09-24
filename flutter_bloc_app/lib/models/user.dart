class User {
  final String id;
  final String name;
  final String email;
  final double handicap;
  final int totalRounds;
  final int? bestScore;
  final double? averageScore;
  final int? lowestRound;
  final int parTotal;
  final int totalStrokes;
  final int currentStreak;
  final int bestStreak;
  final List<Course> coursesPlayed;
  final DateTime? createdAt;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.handicap,
    required this.totalRounds,
    this.bestScore,
    this.averageScore,
    this.lowestRound,
    this.parTotal = 72,
    this.totalStrokes = 0,
    this.currentStreak = 0,
    this.bestStreak = 0,
    this.coursesPlayed = const [],
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      handicap: (json['handicap'] ?? 0).toDouble(),
      totalRounds: json['totalRounds'] ?? 0,
      bestScore: json['bestScore'],
      averageScore: json['averageScore']?.toDouble(),
      lowestRound: json['lowestRound'],
      parTotal: json['parTotal'] ?? 72,
      totalStrokes: json['totalStrokes'] ?? 0,
      currentStreak: json['currentStreak'] ?? 0,
      bestStreak: json['bestStreak'] ?? 0,
      coursesPlayed: (json['coursesPlayed'] as List<dynamic>?)
          ?.map((course) => Course.fromJson(course))
          .toList() ?? [],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'handicap': handicap,
      'totalRounds': totalRounds,
      'bestScore': bestScore,
      'averageScore': averageScore,
      'lowestRound': lowestRound,
      'parTotal': parTotal,
      'totalStrokes': totalStrokes,
      'currentStreak': currentStreak,
      'bestStreak': bestStreak,
      'coursesPlayed': coursesPlayed.map((course) => course.toJson()).toList(),
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  // Helper methods for golf statistics
  double get strokesPerRound => totalRounds > 0 ? totalStrokes / totalRounds : 0;

  String get handicapDisplay => handicap == handicap.toInt()
      ? handicap.toInt().toString()
      : handicap.toStringAsFixed(1);

  String get scoreToPar {
    if (averageScore == null) return 'N/A';
    final diff = averageScore! - parTotal;
    if (diff > 0) return '+${diff.toStringAsFixed(1)}';
    if (diff < 0) return '${diff.toStringAsFixed(1)}';
    return 'E';
  }
}

class Course {
  final String courseName;
  final String? location;
  final int par;
  final int playedCount;

  const Course({
    required this.courseName,
    this.location,
    this.par = 72,
    this.playedCount = 1,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      courseName: json['courseName'] ?? '',
      location: json['location'],
      par: json['par'] ?? 72,
      playedCount: json['playedCount'] ?? 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'courseName': courseName,
      'location': location,
      'par': par,
      'playedCount': playedCount,
    };
  }
}
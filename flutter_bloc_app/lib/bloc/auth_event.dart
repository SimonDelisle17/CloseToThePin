import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthLoginRequested extends AuthEvent {
  final String email;
  final String password;

  const AuthLoginRequested({
    required this.email,
    required this.password,
  });

  @override
  List<Object> get props => [email, password];
}

class AuthRegisterRequested extends AuthEvent {
  final String name;
  final String email;
  final String password;
  final double handicap;

  const AuthRegisterRequested({
    required this.name,
    required this.email,
    required this.password,
    this.handicap = 0,
  });

  @override
  List<Object> get props => [name, email, password, handicap];
}

class AuthLogoutRequested extends AuthEvent {}

class AuthProfileRequested extends AuthEvent {}

class AuthStatusChanged extends AuthEvent {
  final bool isAuthenticated;

  const AuthStatusChanged(this.isAuthenticated);

  @override
  List<Object> get props => [isAuthenticated];
}
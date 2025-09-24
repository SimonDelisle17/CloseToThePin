import 'package:bloc/bloc.dart';
import '../services/auth_service.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthService _authService;

  AuthBloc({required AuthService authService})
      : _authService = authService,
        super(AuthInitial()) {
    on<AuthLoginRequested>(_onLoginRequested);
    on<AuthRegisterRequested>(_onRegisterRequested);
    on<AuthLogoutRequested>(_onLogoutRequested);
    on<AuthProfileRequested>(_onProfileRequested);
    on<AuthStatusChanged>(_onStatusChanged);

    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    if (await _authService.isLoggedIn()) {
      add(AuthProfileRequested());
    } else {
      add(const AuthStatusChanged(false));
    }
  }

  Future<void> _onLoginRequested(
    AuthLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await _authService.login(
      email: event.email,
      password: event.password,
    );

    if (result['success']) {
      emit(AuthAuthenticated(user: result['user']));
    } else {
      emit(AuthError(
        message: result['message'],
        errors: result['errors'],
      ));
    }
  }

  Future<void> _onRegisterRequested(
    AuthRegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    final result = await _authService.register(
      name: event.name,
      email: event.email,
      password: event.password,
      handicap: event.handicap,
    );

    if (result['success']) {
      emit(AuthAuthenticated(user: result['user']));
    } else {
      emit(AuthError(
        message: result['message'],
        errors: result['errors'],
      ));
    }
  }

  Future<void> _onLogoutRequested(
    AuthLogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _authService.logout();
    emit(AuthUnauthenticated());
  }

  Future<void> _onProfileRequested(
    AuthProfileRequested event,
    Emitter<AuthState> emit,
  ) async {
    final result = await _authService.getProfile();

    if (result['success']) {
      emit(AuthAuthenticated(user: result['user']));
    } else {
      emit(AuthUnauthenticated());
    }
  }

  Future<void> _onStatusChanged(
    AuthStatusChanged event,
    Emitter<AuthState> emit,
  ) async {
    if (event.isAuthenticated) {
      add(AuthProfileRequested());
    } else {
      emit(AuthUnauthenticated());
    }
  }
}
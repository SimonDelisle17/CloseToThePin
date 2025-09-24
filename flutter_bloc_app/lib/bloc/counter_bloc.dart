import 'package:bloc/bloc.dart';
import 'counter_event.dart';
import 'counter_state.dart';

class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(const CounterState(value: 0)) {
    on<CounterIncrement>((event, emit) {
      emit(CounterState(value: state.value + 1));
    });

    on<CounterDecrement>((event, emit) {
      emit(CounterState(value: state.value - 1));
    });
  }
}
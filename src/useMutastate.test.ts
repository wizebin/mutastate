import { renderHook, act } from '@testing-library/react-hooks';
import { useMutastate } from './useMutastate';
import Mutastate from './Mutastate';

// Explicitly use react-test-renderer
import * as ReactTestRenderer from 'react-test-renderer';

describe('useMutastate', () => {
  let globalState: Mutastate;

  beforeEach(() => {
    globalState = new Mutastate();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() =>
      useMutastate('testKey', { defaultValue: 'initial', globalState })
    );

    expect(result.current[0]).toBe('initial');
  });

  it('should update value when setter is called with direct value', () => {
    const { result } = renderHook(() =>
      useMutastate('testKey', { defaultValue: 'initial', globalState })
    );

    act(() => {
      result.current[1]('updated');
    });

    expect(globalState.get('testKey')).toBe('updated');
  });

  it('should update value when setter is called with callback function', () => {
    globalState.set('counter', 5);

    const { result } = renderHook(() =>
      useMutastate<number>('counter', { globalState })
    );

    act(() => {
      // Use callback to increment based on current value
      result.current[1](prevValue => prevValue + 3);
    });

    expect(globalState.get('counter')).toBe(8);
  });

  it('should handle multiple callback updates correctly', () => {
    globalState.set('counter', 0);

    const { result } = renderHook(() =>
      useMutastate<number>('counter', { globalState })
    );

    act(() => {
      result.current[1](prevValue => prevValue + 1);
    });

    expect(globalState.get('counter')).toBe(1);

    act(() => {
      result.current[1](prevValue => prevValue + 2);
    });

    expect(globalState.get('counter')).toBe(3);

    act(() => {
      result.current[1](prevValue => prevValue * 2);
    });

    expect(globalState.get('counter')).toBe(6);
  });

  it('should handle callback with complex objects', () => {
    globalState.set('user', { name: 'John', age: 30 });

    const { result } = renderHook(() =>
      useMutastate<{ name: string; age: number }>('user', { globalState })
    );

    act(() => {
      result.current[1](prevValue => ({
        ...prevValue,
        age: prevValue.age + 1
      }));
    });

    expect(globalState.get('user')).toEqual({ name: 'John', age: 31 });
  });

  it('should work with arrays using callback', () => {
    globalState.set('items', ['a', 'b', 'c']);

    const { result } = renderHook(() =>
      useMutastate<string[]>('items', { globalState })
    );

    act(() => {
      result.current[1](prevValue => [...prevValue, 'd']);
    });

    expect(globalState.get('items')).toEqual(['a', 'b', 'c', 'd']);
  });

  it('should handle callback with undefined default value', () => {
    const { result } = renderHook(() =>
      useMutastate<number>('newKey', { defaultValue: 0, globalState })
    );

    act(() => {
      result.current[1](prevValue => (prevValue || 0) + 10);
    });

    expect(globalState.get('newKey')).toBe(10);
  });
});

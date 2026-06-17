"use client";

import { useState } from "react";

type LocalStorageState<T> = {
  value: T;
  setValue: (value: T | ((current: T) => T)) => void;
  error: string | null;
  hydrated: boolean;
};

export function useLocalStorage<T>(key: string, initialValue: T): LocalStorageState<T> {
  const [state, setState] = useState<{ value: T; error: string | null; hydrated: boolean }>(() => {
    if (typeof window === "undefined") {
      return { value: initialValue, error: null, hydrated: false };
    }

    try {
      const stored = window.localStorage.getItem(key);
      return { value: stored ? (JSON.parse(stored) as T) : initialValue, error: null, hydrated: true };
    } catch {
      return { value: initialValue, error: "读取本地保存数据失败，已使用默认空白项目。", hydrated: true };
    }
  });

  const setValue = (nextValue: T | ((current: T) => T)) => {
    setState((current) => {
      const resolved =
        typeof nextValue === "function" ? (nextValue as (current: T) => T)(current.value) : nextValue;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
        return { value: resolved, error: null, hydrated: true };
      } catch {
        return { value: resolved, error: "保存到本地失败，请检查浏览器存储权限。", hydrated: true };
      }
    });
  };

  return { value: state.value, setValue, error: state.error, hydrated: state.hydrated };
}

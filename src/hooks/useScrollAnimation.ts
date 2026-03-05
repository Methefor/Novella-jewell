import { useInView } from 'framer-motion';
import { useRef } from 'react';

export interface ScrollAnimationOptions {
  once?: boolean;
  margin?: string;
  amount?: number | 'some' | 'all';
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: options.once ?? true,
    margin: (options.margin ?? '-60px') as `${number}px`,
    amount: options.amount ?? 0.1,
  });
  return { ref, isInView };
}

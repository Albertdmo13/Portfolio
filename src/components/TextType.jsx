'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  deletingSpeed = 30,
  initialDelay = 0,
  pauseDuration = 2000,
  loop = true,
  reverseMode = false,
  variableSpeed,
  startOnVisible = false,
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
  textColors = [],
  onSentenceComplete,
  className = '',
  cursorClassName = '',
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  // --- Variable typing speed helper ---
  const getTypingDelay = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  // --- Current text color ---
  const currentColor = textColors.length > 0 ? textColors[index % textColors.length] : 'inherit';

  // --- Observer to start animation only when visible ---
  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  // --- Cursor blink animation ---
  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.killTweensOf(cursorRef.current);
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  // --- Main typing effect ---
  useEffect(() => {
    if (!isVisible) return;

    const currentText = reverseMode
      ? texts[index].split('').reverse().join('')
      : texts[index];

    let timer;
    const finishedTyping = charIndex >= currentText.length;
    const finishedDeleting = displayedText === '';

    if (!isDeleting && !finishedTyping) {
      timer = setTimeout(() => {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, getTypingDelay());
    } else if (!isDeleting && finishedTyping) {
      timer = setTimeout(() => {
        if (texts.length > 1) setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting && !finishedDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(t => t.slice(0, -1));
      }, deletingSpeed);
    } else if (isDeleting && finishedDeleting) {
      setIsDeleting(false);
      setCharIndex(0);
      setIndex(i => (i + 1) % texts.length);
      onSentenceComplete?.(texts[index], index);
      if (!loop && index === texts.length - 1) return;
      timer = setTimeout(() => {}, pauseDuration);
    }

    if (charIndex === 0 && !isDeleting && displayedText === '') {
      timer = setTimeout(() => {}, initialDelay);
    }

    return () => clearTimeout(timer);
  }, [
    displayedText,
    charIndex,
    isDeleting,
    index,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    getTypingDelay,
    loop,
    initialDelay,
    reverseMode,
    isVisible,
    onSentenceComplete,
  ]);

  const hideCursor = hideCursorWhileTyping && !isDeleting && charIndex < texts[index].length;

  return (
    <Component ref={containerRef} className={`text-type ${className}`} {...props}>
      <span
        className="text-type__content"
        style={{
          color: currentColor,
          transition: 'color 0.3s ease-in-out',
        }}
      >
        {displayedText}
      </span>
      {showCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor ${cursorClassName} ${hideCursor ? 'text-type__cursor--hidden' : ''}`}
        >
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
};

export default TextType;

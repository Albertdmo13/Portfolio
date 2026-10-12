import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import './TextType.css';

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTypingOrDeleting, setIsTypingOrDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  const containerRef = useRef(null);
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!isVisible || textArray.length === 0) return;

    let timer = null;
    let isCancelled = false;

    let textIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    setDisplayedText('');
    setCurrentTextIndex(0);
    setIsTypingOrDeleting(false);

    const tick = () => {
      if (isCancelled) return;

      const rawText = textArray[textIdx] || '';
      const targetText = reverseMode ? rawText.split('').reverse().join('') : rawText;

      if (isDeleting) {
        setIsTypingOrDeleting(true);
        if (charIdx > 0) {
          charIdx--;
          setDisplayedText(targetText.slice(0, charIdx));
          timer = setTimeout(tick, deletingSpeed);
        } else {
          // Finished deleting current sentence
          setIsTypingOrDeleting(false);

          if (onSentenceComplete) {
            onSentenceComplete(rawText, textIdx);
          }

          if (!loop && textIdx === textArray.length - 1) {
            return;
          }

          textIdx = (textIdx + 1) % textArray.length;
          setCurrentTextIndex(textIdx);
          isDeleting = false;
          // Brief pause before typing next sentence
          timer = setTimeout(tick, 300);
        }
      } else {
        if (charIdx < targetText.length) {
          setIsTypingOrDeleting(true);
          charIdx++;
          setDisplayedText(targetText.slice(0, charIdx));
          const speed = variableSpeed ? getRandomSpeed() : typingSpeed;
          timer = setTimeout(tick, speed);
        } else {
          // Finished typing full sentence
          setIsTypingOrDeleting(false);

          if (!loop && textIdx === textArray.length - 1) {
            return;
          }

          isDeleting = true;
          // Pause showing the full sentence before starting to delete
          timer = setTimeout(tick, pauseDuration);
        }
      }
    };

    if (initialDelay > 0) {
      timer = setTimeout(tick, initialDelay);
    } else {
      tick();
    }

    return () => {
      isCancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [
    isVisible,
    textArray,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    loop,
    initialDelay,
    reverseMode,
    variableSpeed,
    getRandomSpeed,
    onSentenceComplete
  ]);

  const shouldHideCursor = hideCursorWhileTyping && isTypingOrDeleting;

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props
    },
    <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
      {displayedText}
    </span>,
    showCursor && (
      <span
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
        style={cursorBlinkDuration ? { animationDuration: `${cursorBlinkDuration * 2}s` } : undefined}
      >
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;

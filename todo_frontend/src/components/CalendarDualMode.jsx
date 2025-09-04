import React, { useState, useMemo, useCallback } from 'react';
import styles from './CalendarDualMode.module.css';

/**
 * PUBLIC_INTERFACE
 * CalendarDualMode
 * A dual-mode (light and dark) static calendar UI converted from provided HTML/CSS.
 * Interactivity:
 * - Clicking Month/Year "pills" toggles a visual focus/open state (ported from assets/app.js).
 * - Prev/Next buttons are present for parity; handlers are stubbed and can be wired later.
 *
 * Props:
 * - initialMonth: string (default 'April')
 * - initialYear: number (default 2021)
 * - today: { weekIndex: number, dayIndex: number } - marks a specific cell as "today" (optional)
 *
 * Note: Dates grid is kept as static arrays to match the Figma/HTML layout.
 */
function CalendarDualMode({ initialMonth = 'April', initialYear = 2021, today = { weekIndex: 1, dayIndex: 2 } }) {
  // Track "open" state of the month/year pills for both variants
  const [lightPillOpen, setLightPillOpen] = useState({ month: false, year: false });
  const [darkPillOpen, setDarkPillOpen] = useState({ month: false, year: false });

  // Stub navigation handlers for buttons; exposed for future wiring
  const onPrev = useCallback(() => {
    // no-op: keep static like the HTML; can be implemented to navigate months
  }, []);
  const onNext = useCallback(() => {
    // no-op
  }, []);

  // Day-of-week labels
  const dow = useMemo(() => ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], []);

  // Weeks/days layout (copied from HTML structure)
  const weeks = useMemo(() => ([
    [
      { label: '29', state: 'disabled' },
      { label: '30', state: 'disabled' },
      { label: '31', state: 'disabled' },
      { label: '1', state: 'regular' },
      { label: '2', state: 'regular' },
      { label: '3', state: 'regular' },
      { label: '4', state: 'regular' },
    ],
    [
      { label: '5', state: 'regular' },
      { label: '6', state: 'regular' },
      { label: '7', state: 'today' }, // today in original
      { label: '8', state: 'regular' },
      { label: '9', state: 'regular' },
      { label: '10', state: 'regular' },
      { label: '11', state: 'regular' },
    ],
    [
      { label: '12', state: 'regular' },
      { label: '13', state: 'regular' },
      { label: '14', state: 'regular' },
      { label: '15', state: 'regular' },
      { label: '16', state: 'regular' },
      { label: '17', state: 'regular' },
      { label: '18', state: 'regular' },
    ],
    [
      { label: '19', state: 'regular' },
      { label: '20', state: 'regular' },
      { label: '21', state: 'regular' },
      { label: '22', state: 'regular' },
      { label: '23', state: 'regular' },
      { label: '24', state: 'regular' },
      { label: '25', state: 'regular' },
    ],
    [
      { label: '26', state: 'regular' },
      { label: '27', state: 'regular' },
      { label: '28', state: 'regular' },
      { label: '29', state: 'regular' },
      { label: '30', state: 'regular' },
      { label: '1', state: 'disabled' },
      { label: '2', state: 'disabled' },
    ],
  ]), []);

  // Helper to render single calendar card (variantClass: styles.calendarLight or styles.calendarDark)
  const renderCalendar = useCallback((variantClass, pillOpenState, setPillOpenState, ariaLabel) => {
    return (
      <article className={`${styles.calendarCard} ${variantClass}`} aria-label={ariaLabel}>
        <header className={styles.calendarHeader}>
          <button className={styles.headerBtn} aria-label="Previous month" onClick={onPrev} type="button">
            <span className={styles.iconLeft} aria-hidden="true"></span>
          </button>

          <div className={styles.monthYear}>
            <div
              className={`${styles.monthPill} ${pillOpenState.month ? styles.pillOpen : ''}`}
              tabIndex={0}
              role="button"
              aria-haspopup="listbox"
              aria-expanded={pillOpenState.month}
              onClick={() => setPillOpenState(s => ({ ...s, month: !s.month }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPillOpenState(s => ({ ...s, month: !s.month }));
                }
              }}
            >
              <span className={styles.monthText}>{initialMonth}</span>
              <span className={styles.chev} aria-hidden="true"></span>
            </div>
            <div
              className={`${styles.yearPill} ${pillOpenState.year ? styles.pillOpen : ''}`}
              tabIndex={0}
              role="button"
              aria-haspopup="listbox"
              aria-expanded={pillOpenState.year}
              onClick={() => setPillOpenState(s => ({ ...s, year: !s.year }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPillOpenState(s => ({ ...s, year: !s.year }));
                }
              }}
            >
              <span className={styles.yearText}>{initialYear}</span>
              <span className={styles.chev} aria-hidden="true"></span>
            </div>
          </div>

          <button className={styles.headerBtn} aria-label="Next month" onClick={onNext} type="button">
            <span className={styles.iconRight} aria-hidden="true"></span>
          </button>
        </header>

        <div className={styles.dowRow} aria-hidden="true">
          {dow.map((d) => (
            <div className={styles.dowCell} key={d}><span className="dowText">{d}</span></div>
          ))}
        </div>

        <div className={styles.weeks}>
          {weeks.map((week, wIdx) => (
            <div className={styles.weekRow} key={`w-${wIdx}`}>
              {week.map((cell, cIdx) => {
                let stateClass = styles.dayRegular;
                if (cell.state === 'disabled') stateClass = styles.dayDisabled;
                if (cell.state === 'today') stateClass = styles.dayToday;

                // If a 'today' prop is passed, optionally override a cell (keeps original look if not provided)
                const isPropToday = today && today.weekIndex === wIdx && today.dayIndex === cIdx;
                const combinedStateClass = isPropToday ? styles.dayToday : stateClass;

                return (
                  <div
                    key={`d-${wIdx}-${cIdx}`}
                    className={`${styles.dayCell} ${combinedStateClass}`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isPropToday || cell.state === 'today'}
                  >
                    <span className={styles.dayText}>{cell.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </article>
    );
  }, [dow, weeks, initialMonth, initialYear, onNext, onPrev, today]);

  return (
    <main className={styles.screenRegular}>
      <section className={styles.wrapperTwoCards}>
        {renderCalendar(styles.calendarLight, lightPillOpen, setLightPillOpen, 'Light Mode Calendar')}
        {renderCalendar(styles.calendarDark, darkPillOpen, setDarkPillOpen, 'Dark Mode Calendar')}
      </section>
    </main>
  );
}

export default CalendarDualMode;

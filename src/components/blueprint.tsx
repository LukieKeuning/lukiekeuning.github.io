"use client";
import { useRef, useState } from "react";
import { RotateCcw, MoveUpRight } from "lucide-react";
import { usePreferences } from "@/context/preferences";

export function Blueprint({ compact = false }: { compact?: boolean }) {
  const { t, profile } = usePreferences();
  const [finished, setFinished] = useState(false);
  const [revision, setRevision] = useState(0);
  const [detail, setDetail] = useState("");
  const drawing = useRef<SVGSVGElement>(null);
  return (
    <div
      className={`blueprint ${finished ? "is-finished" : ""} ${compact ? "compact" : ""}`}
    >
      <div className="drawing-top">
        <span>{t.drawingNumber}</span>
        <MoveUpRight size={16} aria-hidden="true" />
      </div>
      <svg
        key={revision}
        ref={drawing}
        className="building-svg"
        viewBox="0 0 700 560"
        role="img"
        aria-label={t.drawing}
        onPointerMove={(event) => {
          if (
            event.pointerType !== "mouse" ||
            matchMedia("(prefers-reduced-motion: reduce)").matches
          )
            return;
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.transform = `translate(${((event.clientX - bounds.left) / bounds.width - 0.5) * 7}px, ${((event.clientY - bounds.top) / bounds.height - 0.5) * 7}px)`;
        }}
        onPointerLeave={() => {
          if (drawing.current) drawing.current.style.transform = "";
        }}
      >
        <defs>
          <pattern
            id={compact ? "grid-small" : "grid-main"}
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="currentColor"
              strokeWidth=".45"
            />
          </pattern>
          <pattern
            id={compact ? "hatch-small" : "hatch-main"}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(30)"
          >
            <path d="M0 0V6" stroke="currentColor" strokeWidth=".6" />
          </pattern>
        </defs>
        <rect
          className="drawing-grid"
          x="10"
          y="10"
          width="680"
          height="540"
          fill={`url(#${compact ? "grid-small" : "grid-main"})`}
        />
        <g className="guides">
          <path d="M45 365 400 160 660 310M110 220 590 495M175 125V425M535 160V470M350 75V500M55 400 395 200" />
        </g>
        <g className="ground">
          <path d="m70 381 325-188 269 155-326 188Z" />
          <path d="m92 385 303-175 245 141-303 175Z" />
        </g>
        <g
          className="building-structure draw-phase"
          onMouseEnter={() => setDetail(t.structure)}
          onMouseLeave={() => setDetail("")}
        >
          <path className="side-plane" d="m348 283 213-123v200L348 483Z" />
          <path className="front-plane" d="m140 252 208 120v111L140 363Z" />
          <path className="upper-plane" d="m140 163 208 120v89L140 252Z" />
          <path d="M140 163v200M348 283v200M561 160v200M140 252l208 120 213-123M140 342l208 120 213-123M348 394l213-123" />
        </g>
        <g
          className="roof-plane draw-phase"
          onMouseEnter={() => setDetail(t.roof)}
          onMouseLeave={() => setDetail("")}
        >
          <path d="m123 153 228-132 229 132-228 132Z" />
          <path d="m123 153 229 132v15L123 168Zm229 132 228-132v15L352 300" />
          <path className="roof-inset" d="m171 153 180-104 180 104-180 104Z" />
        </g>
        <g
          className="windows draw-phase"
          onMouseEnter={() => setDetail(t.facade)}
          onMouseLeave={() => setDetail("")}
        >
          <path d="m164 197 159 92v61l-159-92ZM184 209v60M211 224v60M239 240v60M267 256v60M295 273v60" />
          <path d="m374 304 159-92v119l-159 92ZM400 289v119M427 273v120M454 258v119M481 243v119M508 228v120M374 365l159-92" />
          <path d="m164 285 53 31v61l-53-31ZM244 332l79 46v61l-79-46ZM270 347v61M297 363v61" />
        </g>
        <g className="architectural-details draw-phase">
          <path d="m132 365 216 125 223-129M126 373l222 128 229-132M119 381l229 132 236-136M348 501v12M348 490v11" />
          <path d="M592 395v-76m-22 17 22-35 23 9-23 9m0-18v-24" />
          <path d="m94 335 17-10 17 10-17 10Z M111 345v39" />
        </g>
        <g className="dimensions draw-phase">
          <path d="m118 408 211 122m-211-130v16m211 106v16M376 524l217-125m-217 117v16m217-141v16M601 159v194m-8-194h16m-16 194h16" />
          <text x="203" y="482" transform="rotate(30 203 482)">
            12 000
          </text>
          <text x="458" y="485" transform="rotate(-30 458 485)">
            18 000
          </text>
          <text x="617" y="270" transform="rotate(-90 617 270)">
            7 200
          </text>
        </g>
        <g className="north">
          <path d="M52 100V53l-9 19 9-5 9 5-9-19" />
          <text x="48" y="43">
            N
          </text>
        </g>
      </svg>
      {!compact && (
        <>
          <div className="drawing-label" aria-live="polite">
            <span className="status-dot" />
            {detail || t.explore}
          </div>
          <div className="drawing-controls">
            <div className="segmented">
              <button
                aria-pressed={!finished}
                onClick={() => setFinished(false)}
              >
                {t.blueprint}
              </button>
              <button aria-pressed={finished} onClick={() => setFinished(true)}>
                {t.finished}
              </button>
            </div>
            <button
              className="icon-button"
              onClick={() => setRevision((value) => value + 1)}
              aria-label={t.reset}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </>
      )}
      <div className="drawing-bottom">
        <span>{t.scale}</span>
        <span>{profile.personal.initials} — 001</span>
      </div>
    </div>
  );
}

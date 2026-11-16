"use client";

import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "@/context/preferences";

export function SkillsBuilding() {
  const { profile, t } = usePreferences();
  const [selected, setSelected] = useState("professional");
  const [hovered, setHovered] = useState<string | null>(null);
  const id = useId();
  const groups = profile.skills.filter((group) => group.items.some(Boolean));
  const parts = [
    {
      id: "professional",
      label: t.skillFoundation,
      number: "01",
      kind: "foundation",
    },
    {
      id: "architecture",
      label: t.skillStructure,
      number: "02",
      kind: "structure",
    },
    { id: "software", label: t.skillWorkshop, number: "03", kind: "workshop" },
    { id: "other", label: t.skillFinish, number: "04", kind: "finish" },
  ];
  const ordered = [...groups].sort((a, b) => {
    const rank = (key: string) => {
      const index = parts.findIndex((part) => part.id === key);
      return index < 0 ? parts.length : index;
    };
    return rank(a.id) - rank(b.id);
  });
  const active =
    hovered ??
    (groups.some((group) => group.id === selected) ? selected : ordered[0]?.id);
  const activePart = parts.find((part) => part.id === active);

  return (
    <div className="skills-building">
      <div className="skills-building-heading">
        <p className="eyebrow">{t.skillDrawingLabel}</p>
        <p>{t.skillDrawingIntro}</p>
      </div>
      <div className="skills-building-layout">
        <figure className="skills-building-figure">
          <svg viewBox="0 0 600 620" role="img" aria-labelledby={`${id}-title`}>
            <title id={`${id}-title`}>{t.skillDrawingAlt}</title>
            <defs>
              <pattern
                id={`${id}-grid`}
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M30 0H0V30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".5"
                />
              </pattern>
            </defs>
            <rect
              x="20"
              y="20"
              width="560"
              height="580"
              fill={`url(#${id}-grid)`}
              className="skills-drawing-grid"
            />
            <g className="skills-drawing-guides">
              <path d="M120 144v365M300 40v572M480 144v365M90 530l210 73 210-73" />
              <path d="M70 570V65m-7 0h14m-14 505h14" />
            </g>
            <g
              className={`skills-layer foundation ${active === "professional" ? "is-active" : ""}`}
            >
              <path
                className="layer-side"
                d="m112 466 188 96 188-96v24l-188 96-188-96Z"
              />
              <path className="layer-top" d="m112 466 188-96 188 96-188 96Z" />
              <g className="layer-detail">
                <path d="m142 466 158-80 158 80-158 80ZM180 447l188 96m-125-128 188 96m-251 0 188-96m-125 128 188-96" />
              </g>
              <path className="layer-leader" d="M488 478h47" />
              <text x="545" y="483">
                01
              </text>
            </g>
            <g
              className={`skills-layer workshop ${active === "software" ? "is-active" : ""}`}
            >
              <path
                className="layer-side"
                d="m125 350 175 90 175-90v14l-175 90-175-90Z"
              />
              <path className="layer-top" d="m125 350 175-90 175 90-175 90Z" />
              <g className="layer-detail">
                <path d="m160 350 140-72 140 72-140 72ZM230 314l140 72m-210 0 140-72" />
              </g>
              <path
                className="drawing-table"
                d="m235 332 65-33 65 33-65 34Zm0 0v36m130-36v36m-65-2v34"
              />
              <path className="drawing-sheet" d="m257 331 43-22 43 22-43 22Z" />
              <path className="layer-leader" d="M475 357h60" />
              <text x="545" y="362">
                03
              </text>
            </g>
            <g
              className={`skills-layer structure ${active === "architecture" ? "is-active" : ""}`}
            >
              <path
                className="layer-column"
                d="M135 177v113l10 5V182Zm155 78v113l10 5V260Zm165-78v113l10 5V182ZM300 93v113l10 5V98Z"
              />
              <path
                className="layer-side"
                d="m125 170 175 90 175-90v16l-175 90-175-90Z"
              />
              <path
                className="layer-top"
                fillRule="evenodd"
                d="m125 170 175-90 175 90-175 90Zm32 0 143 73 143-73-143-73Z"
              />
              <path
                className="layer-detail"
                d="m145 185 145 169m20 0 145-169"
              />
              <path className="layer-leader" d="M475 178h60" />
              <text x="545" y="183">
                02
              </text>
            </g>
            <g
              className={`skills-layer finish ${active === "other" ? "is-active" : ""}`}
            >
              <path
                className="layer-side"
                d="m115 99 185 95 185-95v13l-185 95-185-95Z"
              />
              <path className="layer-top" d="m115 99 185-95 185 95-185 95Z" />
              <path
                className="roof-surface"
                d="m151 99 149-76 149 76-149 76Z"
              />
              <path
                className="layer-detail"
                d="m185 99 115-59 115 59-115 59Zm34 0 81-42 81 42-81 42Z"
              />
              <path className="layer-leader" d="M485 105h50" />
              <text x="545" y="110">
                04
              </text>
            </g>
          </svg>
          <figcaption>
            <span className="skills-drawing-marker" />
            <span>
              {activePart
                ? `${activePart.number} / ${activePart.label}`
                : t.skillDrawingLabel}
            </span>
            <span>LK / 04</span>
          </figcaption>
        </figure>
        <div className="skills-building-cards">
          {ordered.map((group) => {
            const part = parts.find((item) => item.id === group.id);
            return (
              <article
                key={group.id}
                className={`skills-building-card ${part?.kind ?? "foundation"} ${active === group.id ? "is-active" : ""}`}
                onMouseEnter={() => setHovered(group.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <h3>
                  <button
                    type="button"
                    aria-pressed={selected === group.id}
                    onClick={() => setSelected(group.id)}
                    onFocus={() => setHovered(group.id)}
                    onBlur={() => setHovered(null)}
                  >
                    <span className="skills-card-number">
                      {part?.number ?? "+"}
                    </span>
                    <span>
                      <span className="skills-part-name">
                        {part?.label ?? group.name}
                      </span>
                      <span className="skills-category-name">{group.name}</span>
                    </span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                </h3>
                <ul>
                  {group.items.filter(Boolean).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

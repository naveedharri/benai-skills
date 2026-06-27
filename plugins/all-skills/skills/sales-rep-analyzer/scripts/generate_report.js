/**
 * Sales Rep Performance Report Generator
 *
 * This script generates a professional .docx report from analyzed sales data.
 * It expects a JSON data file as input with the structure defined below.
 *
 * Dependencies:
 *   npm install docx
 *
 * Usage:
 *   node generate_report.js <data.json> <output.docx>
 *
 * The data.json should have this structure:
 * {
 *   "repName": "Jane Doe",
 *   "analysisPeriod": "Sep 2025 - Feb 2026",
 *   "totalCallsAnalyzed": 35,
 *   "totalCallsInScope": 69,
 *   "closeRate": "14.5%",
 *   "overallGrade": "B-",
 *   "businessContext": { "product": "...", "icp": "...", "targets": "..." },
 *   "scoringFramework": "Custom" | "BANT" | "MEDDIC" | ...,
 *   "grades": [
 *     { "dimension": "Discovery & Qualification", "grade": "B", "color": "BLUE",
 *       "verdict": "One-line summary",
 *       "strengths": ["Strength with quote evidence..."],
 *       "weaknesses": ["Weakness with quote evidence..."],
 *       "recommendation": "Specific coaching advice" }
 *   ],
 *   "confirmedDeals": [
 *     { "prospect": "Acme Corp", "status": "Won", "evidence": "Contract signed on call Jan 15",
 *       "source": "CRM + Transcript", "meetingCount": 3 }
 *   ],
 *   "prospectJourneys": [
 *     { "prospect": "Acme Corp", "meetings": 3,
 *       "arc": "Discovery → Demo → Negotiation → Close",
 *       "outcome": "Won", "keyMoments": ["Quote from key moment..."],
 *       "crmStage": "Closed Won", "dealValue": "$15,000" }
 *   ],
 *   "wonPatterns": ["Pattern seen in winning deals..."],
 *   "lostPatterns": ["Pattern seen in losing deals..."],
 *   "coachingPlaybook": [
 *     { "priority": 1, "title": "Create urgency on every call",
 *       "description": "...", "example": "On the X call, instead of Y, try Z" }
 *   ],
 *   "methodology": "35 full transcripts analyzed out of 69 total calls via Fireflies. CRM data from Attio."
 * }
 */

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, LevelFormat, PageBreak
} = require("docx");

// --- Color Palette ---
const NAVY  = "1B2A4A";
const RED   = "C0392B";
const GREEN = "27AE60";
const AMBER = "E67E22";
const BLUE  = "2980B9";
const LGRAY = "F5F6FA";
const MGRAY = "E0E0E0";
const WHITE = "FFFFFF";

// --- Grade-to-color mapping ---
function gradeColor(grade) {
  if (grade.startsWith("A")) return GREEN;
  if (grade.startsWith("B")) return BLUE;
  if (grade.startsWith("C")) return AMBER;
  return RED;
}

function gradeLabel(grade) {
  if (grade.startsWith("A")) return "Excellent";
  if (grade === "B+") return "Very Good";
  if (grade === "B" || grade === "B-") return "Good";
  if (grade === "C+") return "Above Average";
  if (grade === "C") return "Average";
  if (grade === "C-") return "Below Average";
  return "Needs Work";
}

// --- Reusable cell/paragraph helpers ---
const border = { style: BorderStyle.SINGLE, size: 1, color: MGRAY };
const borders = { top: border, bottom: border, left: border, right: border };
const cellM = { top: 100, bottom: 100, left: 140, right: 140 };

function hCell(text, w) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: { fill: NAVY, type: ShadingType.CLEAR }, margins: cellM,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, font: "Arial", size: 20, color: WHITE })] })]
  });
}

function bCell(children, w, opts = {}) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: cellM,
    children: Array.isArray(children) ? children : [children]
  });
}

function tp(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: opts.spacing || { after: 80 },
    children: [new TextRun({ text, font: "Arial", size: opts.size || 20, bold: opts.bold, color: opts.color || "333333", italics: opts.italics })]
  });
}

function rp(runs, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: opts.spacing || { after: 80 },
    numbering: opts.numbering,
    children: runs.map(r => new TextRun({ font: "Arial", size: 20, color: "333333", ...r }))
  });
}

function divider() {
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: { style: BorderStyle.SINGLE, size: 3, color: NAVY }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
      width: { size: 9360, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 0 },
      children: [new Paragraph({ spacing: { before: 200, after: 200 }, children: [] })]
    })] })]
  });
}

function gradeRow(area, grade) {
  return new TableRow({ children: [
    bCell(tp(area, { bold: true }), 5460),
    bCell(tp(grade, { bold: true, color: gradeColor(grade), align: AlignmentType.CENTER }), 1950, { fill: LGRAY }),
    bCell(tp(gradeLabel(grade), { italics: true, align: AlignmentType.CENTER }), 1950)
  ]});
}

function bulletPoint(text, opts = {}) {
  return rp([{ text, italics: opts.italics }], {
    numbering: { reference: "bullets", level: opts.level || 0 }
  });
}

function quoteBlock(text, attribution) {
  return rp([
    { text: `"${text}"`, italics: true, color: "555555" },
    { text: attribution ? ` — ${attribution}` : "", color: "777777", size: 18 }
  ], { spacing: { before: 60, after: 100 } });
}

// --- Main report builder ---
function buildReport(data) {
  const sections = [];

  // ---- Title ----
  sections.push(
    new Paragraph({ spacing: { before: 2400 }, children: [] }),
    tp(data.repName.toUpperCase(), { size: 44, bold: true, color: NAVY, align: AlignmentType.CENTER, spacing: { after: 120 } }),
    tp("Sales Performance Analysis", { size: 32, color: NAVY, align: AlignmentType.CENTER, spacing: { after: 200 } }),
    tp(`${data.analysisPeriod} | ${data.totalCallsAnalyzed} Calls Analyzed`, { size: 22, color: "666666", align: AlignmentType.CENTER, spacing: { after: 80 } }),
    tp(`Overall Grade: ${data.overallGrade}`, { size: 28, bold: true, color: gradeColor(data.overallGrade), align: AlignmentType.CENTER, spacing: { after: 600 } }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ---- Executive Summary ----
  sections.push(
    tp("1. EXECUTIVE SUMMARY", { size: 28, bold: true, color: NAVY, spacing: { before: 300, after: 200 } }),
    divider()
  );
  if (data.executiveSummary) {
    data.executiveSummary.forEach(line => sections.push(tp(line, { spacing: { after: 120 } })));
  }

  // ---- Scorecard ----
  sections.push(
    new Paragraph({ children: [new PageBreak()] }),
    tp("2. PERFORMANCE SCORECARD", { size: 28, bold: true, color: NAVY, spacing: { before: 300, after: 200 } }),
    divider()
  );
  const scorecardRows = [
    new TableRow({ children: [hCell("Dimension", 5460), hCell("Grade", 1950), hCell("Assessment", 1950)] })
  ];
  data.grades.forEach(g => scorecardRows.push(gradeRow(g.dimension, g.grade)));
  // Overall row
  scorecardRows.push(new TableRow({ children: [
    bCell(tp("OVERALL", { bold: true, size: 22 }), 5460, { fill: LGRAY }),
    bCell(tp(data.overallGrade, { bold: true, size: 22, color: gradeColor(data.overallGrade), align: AlignmentType.CENTER }), 1950, { fill: LGRAY }),
    bCell(tp(gradeLabel(data.overallGrade), { bold: true, italics: true, align: AlignmentType.CENTER }), 1950, { fill: LGRAY })
  ]}));
  sections.push(new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [5460, 1950, 1950],
    rows: scorecardRows
  }));

  // ---- Detailed Analysis per Dimension ----
  sections.push(
    new Paragraph({ children: [new PageBreak()] }),
    tp("3. DETAILED ANALYSIS BY DIMENSION", { size: 28, bold: true, color: NAVY, spacing: { before: 300, after: 200 } }),
    divider()
  );
  data.grades.forEach((g, i) => {
    sections.push(
      tp(`${g.dimension} — ${g.grade}`, { size: 24, bold: true, color: gradeColor(g.grade), spacing: { before: 240, after: 80 } }),
      tp(g.verdict, { italics: true, color: "555555", spacing: { after: 120 } })
    );
    if (g.strengths && g.strengths.length > 0) {
      sections.push(tp("Strengths:", { bold: true, color: GREEN, spacing: { before: 80, after: 40 } }));
      g.strengths.forEach(s => sections.push(bulletPoint(s)));
    }
    if (g.weaknesses && g.weaknesses.length > 0) {
      sections.push(tp("Areas for Improvement:", { bold: true, color: RED, spacing: { before: 80, after: 40 } }));
      g.weaknesses.forEach(w => sections.push(bulletPoint(w)));
    }
    if (g.recommendation) {
      sections.push(
        tp("Coaching Recommendation:", { bold: true, color: BLUE, spacing: { before: 80, after: 40 } }),
        tp(g.recommendation, { spacing: { after: 160 } })
      );
    }
  });

  // ---- Confirmed Deal Outcomes ----
  if (data.confirmedDeals && data.confirmedDeals.length > 0) {
    sections.push(
      new Paragraph({ children: [new PageBreak()] }),
      tp("4. CONFIRMED DEAL OUTCOMES", { size: 28, bold: true, color: NAVY, spacing: { before: 300, after: 200 } }),
      divider()
    );
    const dealRows = [new TableRow({ children: [
      hCell("Prospect", 2800), hCell("Status", 1200), hCell("Meetings", 1000),
      hCell("Evidence", 4360)
    ]})];
    data.confirmedDeals.forEach(d => {
      dealRows.push(new TableRow({ children: [
        bCell(tp(d.prospect, { bold: true }), 2800),
        bCell(tp(d.status, { bold: true, color: d.status === "Won" ? GREEN : d.status === "Lost" ? RED : AMBER }), 1200),
        bCell(tp(String(d.meetingCount || "—"), { align: AlignmentType.CENTER }), 1000),
        bCell(tp(d.evidence, { size: 18 }), 4360)
      ]}));
    });
    sections.push(new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [2800, 1200, 1000, 4360],
      rows: dealRows
    }));
  }

  // ---- Prospect Journey Analysis ----
  if (data.prospectJourneys && data.prospectJourneys.length > 0) {
    sections.push(
      new Paragraph({ children: [new PageBreak()] }),
      tp("5. PROSPECT JOURNEY ANALYSIS", { size: 28, bold: true, color: NAVY, spacing: { before: 300, after: 200 } }),
      divider()
    );
    data.prospectJourneys.forEach(pj => {
      sections.push(
        tp(`${pj.prospect} — ${pj.outcome}`, {
          size: 22, bold: true,
          color: pj.outcome === "Won" ? GREEN : pj.outcome === "Lost" ? RED : AMBER,
          spacing: { before: 200, after: 60 }
        }),
        tp(`${pj.meetings} meeting(s) | Arc: ${pj.arc}`, { size: 18, color: "666666" })
      );
      if (pj.dealValue) sections.push(tp(`Deal value: ${pj.dealValue}`, { size: 18, color: "666666" }));
      if (pj.crmStage) sections.push(tp(`CRM stage: ${pj.crmStage}`, { size: 18, color: "666666" }));
      if (pj.keyMoments && pj.keyMoments.length > 0) {
        sections.push(tp("Key Moments:", { bold: true, spacing: { before: 60, after: 40 } }));
        pj.keyMoments.forEach(km => sections.push(bulletPoint(km, { italics: true })));
      }
    });
  }

  // ---- Won vs Lost Patterns ----
  if (data.wonPatterns || data.lostPatterns) {
    sections.push(
      new Paragraph({ children: [new PageBreak()] }),
      tp("6. WON VS. LOST PATTERNS", { size: 28, bold: true, color: NAVY, spacing: { before: 300, after: 200 } }),
      divider()
    );
    if (data.wonPatterns && data.wonPatterns.length > 0) {
      sections.push(tp("What happens on winning calls:", { bold: true, color: GREEN, spacing: { after: 60 } }));
      data.wonPatterns.forEach(p => sections.push(bulletPoint(p)));
    }
    if (data.lostPatterns && data.lostPatterns.length > 0) {
      sections.push(tp("What's missing on losing calls:", { bold: true, color: RED, spacing: { before: 120, after: 60 } }));
      data.lostPatterns.forEach(p => sections.push(bulletPoint(p)));
    }
  }

  // ---- Coaching Playbook ----
  if (data.coachingPlaybook && data.coachingPlaybook.length > 0) {
    sections.push(
      new Paragraph({ children: [new PageBreak()] }),
      tp("7. COACHING PLAYBOOK", { size: 28, bold: true, color: NAVY, spacing: { before: 300, after: 200 } }),
      divider(),
      tp("Prioritized recommendations ranked by expected impact on close rate:", { spacing: { after: 160 } })
    );
    data.coachingPlaybook.forEach(cp => {
      sections.push(
        tp(`#${cp.priority}: ${cp.title}`, { size: 22, bold: true, color: NAVY, spacing: { before: 160, after: 60 } }),
        tp(cp.description, { spacing: { after: 60 } })
      );
      if (cp.example) sections.push(quoteBlock(cp.example));
    });
  }

  // ---- Methodology ----
  sections.push(
    new Paragraph({ children: [new PageBreak()] }),
    tp("8. METHODOLOGY", { size: 28, bold: true, color: NAVY, spacing: { before: 300, after: 200 } }),
    divider(),
    tp(data.methodology || "No methodology note provided.", { spacing: { after: 120 } })
  );

  // ---- Build Document ----
  return new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, font: "Arial", color: NAVY },
          paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, bold: true, font: "Arial", color: NAVY },
          paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      ]
    },
    numbering: {
      config: [
        { reference: "bullets", levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } }
        ]}
      ]
    },
    sections: [{
      properties: {
        page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } }
      },
      headers: {
        default: new Header({
          children: [tp(`${data.repName} — Sales Performance Analysis`, { size: 16, color: "999999", align: AlignmentType.RIGHT })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" })]
          })]
        })
      },
      children: sections
    }]
  });
}

// --- CLI entry point ---
async function main() {
  const [,, dataPath, outputPath] = process.argv;
  if (!dataPath || !outputPath) {
    console.error("Usage: node generate_report.js <data.json> <output.docx>");
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const doc = buildReport(data);
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Report generated: ${outputPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });

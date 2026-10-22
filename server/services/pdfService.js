// ============================================================
// services/pdfService.js — PDF Report Generation
// ============================================================
// Generates professional PDF validation reports using PDFKit.
// ============================================================

const PDFDocument = require('pdfkit');

/**
 * Generate a styled PDF from a validation report.
 *
 * @param {Object} report - The ValidationReport document
 * @param {Object} startup - The StartupIdea document
 * @returns {PDFDocument} A PDFKit document stream
 */
function generateReportPDF(report, startup) {
  const startupName = startup?.startupName || 'Startup Idea';
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: `Validation Report - ${startupName}`,
      Author: 'AI Startup Validator',
    },
  });

  const primaryColor = '#6366f1';
  const darkColor = '#1e1b4b';
  const grayColor = '#64748b';

  // ---- Header ----
  doc.fontSize(28).fillColor(primaryColor).text('AI Startup Validator', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(18).fillColor(darkColor).text(`Validation Report: ${startupName}`, { align: 'center' });
  doc.moveDown(0.3);
  const createdDate = report.createdAt ? new Date(report.createdAt) : new Date();
  doc.fontSize(10).fillColor(grayColor).text(`Generated on ${createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
  doc.moveDown(0.5);

  // Divider
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(primaryColor).lineWidth(2).stroke();
  doc.moveDown(1);

  // ---- Scores Summary ----
  addSectionTitle(doc, 'Score Summary', primaryColor);
  doc.moveDown(0.3);

  const scores = [
    ['Innovation Score', report.innovationScore],
    ['Market Potential', report.marketPotentialScore],
    ['Scalability', report.scalabilityScore],
    ['Investor Readiness', report.investorReadinessScore],
    ['Success Probability', report.successProbability],
  ];

  scores.forEach(([label, value]) => {
    doc.fontSize(11).fillColor(darkColor).text(`${label}: `, { continued: true });
    doc.fillColor(getScoreColor(value)).text(`${value}/100`);
  });
  doc.moveDown(1);

  // ---- Executive Summary ----
  addSectionTitle(doc, 'Executive Summary', primaryColor);
  addParagraph(doc, report.executiveSummary, grayColor);

  // ---- SWOT Analysis ----
  addSectionTitle(doc, 'SWOT Analysis', primaryColor);
  if (report.swotAnalysis) {
    addBulletList(doc, 'Strengths', report.swotAnalysis.strengths, '#10b981');
    addBulletList(doc, 'Weaknesses', report.swotAnalysis.weaknesses, '#ef4444');
    addBulletList(doc, 'Opportunities', report.swotAnalysis.opportunities, '#3b82f6');
    addBulletList(doc, 'Threats', report.swotAnalysis.threats, '#f59e0b');
  }

  // ---- Risks ----
  addSectionTitle(doc, 'Key Risks', primaryColor);
  if (report.risks && report.risks.length > 0) {
    report.risks.forEach((risk) => {
      doc.fontSize(10).fillColor(grayColor).text(`• ${risk}`, { indent: 15 });
    });
  }
  doc.moveDown(0.5);

  // ---- Business Analysis ----
  addSectionTitle(doc, 'Business Model Analysis', primaryColor);
  addParagraph(doc, report.businessModelAnalysis, grayColor);

  addSectionTitle(doc, 'Product-Market Fit', primaryColor);
  addParagraph(doc, report.productMarketFit, grayColor);

  addSectionTitle(doc, 'Competitive Analysis', primaryColor);
  addParagraph(doc, report.competitiveAnalysis, grayColor);

  // ---- Strategy ----
  doc.addPage();
  addSectionTitle(doc, 'Marketing Strategy', primaryColor);
  addParagraph(doc, report.marketingStrategy, grayColor);

  addSectionTitle(doc, 'Customer Acquisition Strategy', primaryColor);
  addParagraph(doc, report.customerAcquisitionStrategy, grayColor);

  addSectionTitle(doc, 'Go-To-Market Plan', primaryColor);
  addParagraph(doc, report.goToMarketPlan, grayColor);

  // ---- Technical ----
  addSectionTitle(doc, 'MVP Roadmap', primaryColor);
  addParagraph(doc, report.mvpRoadmap, grayColor);

  addSectionTitle(doc, 'Recommended Technology Stack', primaryColor);
  addParagraph(doc, report.recommendedTechStack, grayColor);

  addSectionTitle(doc, 'Development Timeline & Cost', primaryColor);
  doc.fontSize(10).fillColor(grayColor).text(`Timeline: ${report.estimatedDevTimeline || '3-4 months'}`);
  doc.fontSize(10).fillColor(grayColor).text(`Cost: ${report.estimatedDevCost || '$15k - $30k'}`);
  doc.moveDown(0.5);

  // ---- Revenue & Pricing ----
  addSectionTitle(doc, 'Revenue Suggestions', primaryColor);
  addParagraph(doc, report.revenueSuggestions, grayColor);

  addSectionTitle(doc, 'Pricing Suggestions', primaryColor);
  addParagraph(doc, report.pricingSuggestions, grayColor);

  // ---- Funding ----
  addSectionTitle(doc, 'Funding Suggestions', primaryColor);
  addParagraph(doc, report.fundingSuggestions, grayColor);

  // ---- Final Verdict ----
  doc.addPage();
  addSectionTitle(doc, 'Final Verdict', primaryColor);
  addParagraph(doc, report.finalVerdict, darkColor);

  // ---- AI Recommendations ----
  addSectionTitle(doc, 'AI Recommendations for Improvement', primaryColor);
  if (report.aiRecommendations && report.aiRecommendations.length > 0) {
    report.aiRecommendations.forEach((rec, i) => {
      doc.fontSize(10).fillColor(grayColor).text(`${i + 1}. ${rec}`, { indent: 15 });
    });
  }

  doc.moveDown(2);
  doc.fontSize(8).fillColor(grayColor).text('This report was generated by AI Startup Validator using Google Gemini AI. The analysis is based on the information provided and should be used as guidance, not as definitive business advice.', { align: 'center' });

  doc.end();
  return doc;
}

// Helper functions
function addSectionTitle(doc, title, color) {
  doc.moveDown(0.5);
  doc.fontSize(14).fillColor(color).text(title);
  doc.moveDown(0.3);
}

function addParagraph(doc, text, color) {
  doc.fontSize(10).fillColor(color).text(text || 'N/A', { lineGap: 3 });
  doc.moveDown(0.5);
}

function addBulletList(doc, title, items, color) {
  doc.fontSize(11).fillColor(color).text(title);
  if (items && items.length > 0) {
    items.forEach((item) => {
      doc.fontSize(10).fillColor('#475569').text(`  • ${item}`, { indent: 10 });
    });
  }
  doc.moveDown(0.3);
}

function getScoreColor(score) {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

module.exports = { generateReportPDF };

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TestResults, SampleSizeInputs, SampleSizeResult } from '../types';

export const exportTestResultsToPDF = (results: TestResults) => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  doc.setFontSize(18);
  doc.text('A/B Test Results', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(14);
  doc.text('The Verdict', 14, yPosition);
  yPosition += 10;

  const verdictText = results.is_significant
    ? `Result is Statistically Significant: Version B is performing ${(results.variant_rate - results.control_rate) * 100 > 0 ? 'better' : 'worse'} than Version A.`
    : 'Keep Testing - Not Enough Data: More data is needed to confirm the difference is real.';
  doc.setFontSize(12);
  doc.text(verdictText, 14, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [['Version', 'Conversion Rate']],
    body: [
      ['A', `${(results.control_rate * 100).toFixed(2)}%`],
      ['B', `${(results.variant_rate * 100).toFixed(2)}%`],
    ],
  });
  yPosition = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.text('Statistical Summary', 14, yPosition);
  yPosition += 10;

  const stats = [
    ['Z-Score', results.z_score.toFixed(4)],
    ['P-Value', results.p_value.toFixed(4)],
    ['Confidence Interval', `${(results.confidence_interval.lower_bound * 100).toFixed(2)}% to ${(results.confidence_interval.upper_bound * 100).toFixed(2)}%`],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Statistic', 'Value']],
    body: stats,
  });

  doc.save('ab-test-results.pdf');
};

export const exportSampleSizeToPDF = (inputs: SampleSizeInputs, result: SampleSizeResult) => {
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Title
  doc.setFontSize(18);
  doc.text('Sample Size Calculation', 14, yPosition);
  yPosition += 15;

  // Test Parameters
  doc.setFontSize(14);
  doc.text('Test Parameters', 14, yPosition);
  yPosition += 10;

  const relativeImprovement = inputs.baselineRate > 0
    ? (((inputs.expectedRate - inputs.baselineRate) / inputs.baselineRate) * 100).toFixed(1)
    : '0.0';

  autoTable(doc, {
    startY: yPosition,
    head: [['Parameter', 'Value']],
    body: [
      ['Current Conversion Rate', `${(inputs.baselineRate * 100).toFixed(2)}%`],
      ['Expected Conversion Rate', `${(inputs.expectedRate * 100).toFixed(2)}%`],
      ['Relative Improvement', `${relativeImprovement}%`],
      ['Significance Level (α)', `${(inputs.alpha! * 100).toFixed(0)}%`],
      ['Statistical Power', `${(inputs.power! * 100).toFixed(0)}%`],
    ],
  });
  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Required Sample Size
  doc.setFontSize(14);
  doc.text('Required Sample Size', 14, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Value']],
    body: [
      ['Visitors per Version', result.sample_size_per_variant.toLocaleString()],
      ['Total Visitors Needed', result.total_sample_size.toLocaleString()],
    ],
    headStyles: { fillColor: [102, 126, 234] },
  });
  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Recommendation
  doc.setFontSize(12);
  doc.text('Recommendation:', 14, yPosition);
  yPosition += 7;
  doc.setFontSize(10);
  const recommendation = `To detect a ${(inputs.baselineRate * 100).toFixed(1)}% → ${(inputs.expectedRate * 100).toFixed(1)}% change with ${(inputs.alpha! * 100).toFixed(0)}% confidence and ${(inputs.power! * 100).toFixed(0)}% power, you need ${result.sample_size_per_variant.toLocaleString()} visitors per version.`;
  const splitText = doc.splitTextToSize(recommendation, 180);
  doc.text(splitText, 14, yPosition);

  doc.save('sample-size-calculation.pdf');
};
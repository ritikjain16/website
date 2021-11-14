const studentFinancialHeader = [
  {
    label: 'Month',
    key: 'date',
  },
  {
    label: 'Unique student ID',
    key: 'userId',
  },
  {
    label: 'Name of student',
    key: 'userName',
  },
  {
    label: 'Grade',
    key: 'grade',
  },
  {
    label: 'Course name',
    key: 'courseName',
  },
  {
    label: 'No. of classes in course',
    key: 'totalClasses',
  },
  {
    label: 'Model opted',
    key: 'type',
  },
  {
    label: 'City',
    key: 'city',
  },
  {
    label: 'State',
    key: 'state',
  },
  {
    label: 'Region',
    key: 'region',
  },
  {
    label: 'Country',
    key: 'country',
  },
  {
    label: 'Mentor associated',
    key: 'allottedMentor',
  },
  {
    label: 'Currency',
    key: 'currency',
  },
  {
    label: 'Total contract value ex GST (INR)',
    key: 'priceExGSTInRS',
  },
  {
    label: 'Total contract value (USD)',
    key: 'priceExGSTInUSD',
  },
  {
    label: 'Per class value ex GST (INR)',
    key: 'pricePerClassExGSTInRS',
  },
  {
    label: 'Per class value (USD)',
    key: 'pricePerClassExGSTInUSD',
  },
  {
    label: 'No. of Installments',
    key: 'numberOfInstallments',
  },
  {
    label: 'Course beginning date',
    key: 'courseBeginDate',
  },
  {
    label: 'Date of installment due',
    key: 'invoiceGenerateDate',
  },
  {
    label: 'Date of installment collection',
    key: 'installmentCollectDate',
  },
  {
    label: 'Amount collected in month ex GST (INR)',
    key: 'paidAmountExGST',
  },
  {
    label: 'Amount collected in month (USD)',
    key: 'paidAmountInMonthUSD',
  },
  {
    label: 'CGST',
    key: 'collectedCGST',
  },
  {
    label: 'SGST',
    key: 'collectedSGST',
  },
  {
    label: 'IGST',
    key: 'collectedIGST',
  },
  {
    label: 'Amount collected (cumulative) ex GST (INR)',
    key: 'cumulativeAmount',
  },
  {
    label: 'Amount collected (cumulative) (USD)',
    key: 'paidAmountInCumInUSD',
  },
  {
    label: 'CGST',
    key: 'cumulativeCGST',
  },
  {
    label: 'SGST',
    key: 'cumulativeSGST',
  },
  {
    label: 'IGST',
    key: 'cumulativeIGST',
  },
  {
    label: 'Total classes completed in that month',
    key: 'totalClassCompleted',
  },
  {
    label: 'Total classes completed overall',
    key: 'overAllCompletedClass',
  },
  {
    label: 'Revenue for the month',
    key: 'revenueForMonth',
  },
  {
    label: 'Overall revenue',
    key: 'overAllRevenue',
  },
  {
    label: 'Deferred revenue for month',
    key: 'deferredAmount',
  },
  {
    label: 'Accrued revenue for month',
    key: 'accruedAmount',
  },
]

const financeReportConfig = studentFinancialHeader.filter(({ label }) => label !== 'Month')

financeReportConfig.unshift({ label: 'Sr.No', key: 'no' })

const schoolFinancialReport = [...studentFinancialHeader]

schoolFinancialReport.unshift({ label: 'Sr.No', key: 'no' })

const insertIndex = schoolFinancialReport.findIndex(({ label }) => label === 'Mentor associated')

schoolFinancialReport.splice(insertIndex, 0, {
  label: 'Channel',
  key: 'channel',
},
{
  label: 'Further bifurcation in online marketing channel',
  key: 'subChannel',
},
{
  label: 'SM associated',
  key: 'smAssociated',
})

export { studentFinancialHeader, financeReportConfig, schoolFinancialReport }

export const calculatePercentage = (num, den) => {
  if (den === 0) {
    return 0
  }
  return ((num / den) * 100).toFixed(2)
}
export const createColumn = (label) => [
  {
    title: 'Sr. No',
    dataIndex: 'srNo',
    key: 'srNo',
    align: 'center',
    fixed: 'left',
  },
  {
    title: `${label}`,
    dataIndex: `${label}`,
    key: `${label}`,
    align: 'center',
    fixed: 'left',
  },
]

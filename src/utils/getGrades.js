const getGrades = () => {
  const grades = []
  for (let i = 1; i <= 12; i += 1) {
    grades.push(`Grade${i}`)
  }
  return grades
}

export default getGrades

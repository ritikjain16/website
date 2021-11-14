import { get, groupBy, mapValues, omit } from 'lodash'

const convertSchoolCountAndGrade = (originalData) => {
  let schoolClasses = []
  const groupedStudentProfiles = mapValues(groupBy(get(originalData, 'studentProfiles', []), 'grade'), grouped => grouped.map(profile => omit(profile, 'grade')))
  get(originalData, 'school.classes', []).map(schoolClass => {
    const data = schoolClasses.find(d => get(d, 'grade') === get(schoolClass, 'grade'))
    const gradeOrder = get(schoolClass, 'grade').match(/\d+/g)
    if (data) {
      data.sections = [...data.sections,
        {
          section: get(schoolClass, 'section'),
          id: get(schoolClass, 'id'),
          sectionStudentCount: get(schoolClass, 'studentsMeta.count', 0)
        }]
      // data.studentCount += get(schoolClass, 'studentsMeta.count', 0)
      const newSchoolClasses = schoolClasses.filter((d) => get(d, 'grade') !== get(data, 'grade'))
      schoolClasses = [...newSchoolClasses, data]
    } else {
      schoolClasses.push({
        id: get(schoolClass, 'id'),
        grade: get(schoolClass, 'grade'),
        order: Number(get(gradeOrder, '[0]', 0)),
        sections: [{
          section: get(schoolClass, 'section'),
          id: get(schoolClass, 'id'),
          sectionStudentCount: get(schoolClass, 'studentsMeta.count', 0)
        }],
        studentCount: get(groupedStudentProfiles, `${get(schoolClass, 'grade')}.length`, 0)
      })
    }
  })
  const studentsMeta = get(originalData, 'school.studentsMeta.count', 0)
  const grades = [...new Set(get(originalData, 'school.classes', []).map(({ grade }) => grade))]
  return { studentsMeta, grades, schoolClasses }
}

export default convertSchoolCountAndGrade

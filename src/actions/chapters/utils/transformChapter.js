const transformChapter = ({ topics, ...chapter }) => (
  { ...chapter, topicsCount: topics.length }
)

export default transformChapter

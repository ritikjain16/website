const transformChapters = chapters => (
  chapters.map(({ topics, ...chapter }) => ({
    ...chapter, topicsCount: topics.length
  }))
)

export default transformChapters

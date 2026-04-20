# Users Collection

- fullName: String
- email: String (unique)
- username: String (unique)
- password: String
- createdAt: Date
- role: String

# Playlist Collection

- name: String
- userId: String
- songs: Array
  - title: String
  - artist: String
  - source: String ("spotify" or "local")
  - url: String or null
  - filePath: String or null
- createdAt: Date

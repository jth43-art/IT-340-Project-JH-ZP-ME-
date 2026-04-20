# Database (MongoDB)
This folder contains the database design for our TuneVault project.

## Collections

### Users
this stores account info including login credentials and roles

### Playlists 
Stores playlists associated with users, including songs from external APIs and locally uploaded files/

## Design Decisions
- 'source' is used to determine whether a song comes from an external API (like spotify) or a local upload.
- 'url' is used for externally hosted songs.
- 'filePath' is used for locally uploaded MP3 files.
- 'userId' links the playlist to the users.

## Indexing
- username and email are enforced as unique so that there arent duplicate accounts.


import db from "./";

export const getSongsByArtist = (artist: string) => db.songs
    .where("artist")
    .startsWithIgnoreCase(artist)
    .toArray();

export const getSongsByTitle = (title: string) => db.songs
    .where("title")
    .startsWithIgnoreCase(title)
    .toArray();

export const addSong = (artist: string, title: string, tuningId: number) => db.songs.add({
    artist,
    title,
    tuningId
});
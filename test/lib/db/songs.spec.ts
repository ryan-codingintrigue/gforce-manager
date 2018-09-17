import db, { ColorBank } from "../../../src/lib/db/index";
import { addSong, getSongsByArtist, getSongsByTitle } from "../../../src/lib/db/songs";
import { addTuning } from "../../../src/lib/db/tunings";

describe("Creating songs", () => {
    beforeEach(async done => {
        // Reset the database before each test
        await db.delete();
        jest.resetModules();
        await db.open();
        done();
    });

    it("Can add a song", async () => {
        const tuningId = await addTuning("Half-Step Down", ColorBank.Blue, "D# G# C# F# A# D#");
        await addSong("Guns N Roses", "November Rain", tuningId);
        expect(await db.songs.count()).toBe(1);
        const [song] = await db.songs.toArray();
        expect(song).toBeDefined();
        expect(song.artist).toBe("Guns N Roses");
        expect(song.title).toBe("November Rain");
        expect(song.tuningId).toBe(tuningId);
    });
});

describe("Searching songs", () => {
    beforeEach(async done => {
        // Reset the database before each test
        await db.delete();
        jest.resetModules();
        await db.open();

        // Add a few test songs
        await Promise.all([
            { artist: "Pearl Jam", title: "Black", tuning: "E A D G B e" },
            { artist: "Guns N Roses", title: "November Rain", tuning: "D# G# C# F# A# D#" },
            { artist: "Guns N Roses", title: "Patience", tuning: "D# G# C# F# A# D#" },
            { artist: "Pearl Jam", title: "Yellow Ledbetter", tuning: "E A D G B e" },
            { artist: "Beach House", title: "Pay No Mind", tuning: "Eb Ab Db Gb Bb Eb" }
        ].map(async ({ artist, title, tuning }, index) => {
            const tuningId = await addTuning(`Tuning ${index}`, ColorBank.Blue, tuning);
            await addSong(artist, title, tuningId);
        }));

        done();
    });

    it("Can search for a song by exact Artist", async () => {
        const songs = await getSongsByArtist("Pearl Jam");
        expect(songs.length).toBe(2);
        songs.forEach(song => {
            expect(song.artist).toBe("Pearl Jam");
        });
    });

    it("Can search for a song by Artist prefix", async () => {
        const songs = await getSongsByArtist("Guns");
        expect(songs.length).toBe(2);
        songs.forEach(song => {
            expect(song.artist).toBe("Guns N Roses");
        });
    });

    it("Can search for a song by Artist prefix (case-insensitive)", async () => {
        const songs = await getSongsByArtist("pEaRl");
        expect(songs.length).toBe(2);
        songs.forEach(song => {
            expect(song.artist).toBe("Pearl Jam");
        });
    });

    it("Can search for a song by exact Title", async () => {
        const songs = await getSongsByTitle("Black");
        expect(songs.length).toBe(1);
        expect(songs[0].title).toBe("Black");
    });

    it("Can search for a song by Title prefix", async () => {
        const songs = await getSongsByTitle("P");
        expect(songs.length).toBe(2);
        expect(songs[0].title).toBe("Patience");
        expect(songs[1].title).toBe("Pay No Mind");
    });

    it("Can search for a song by Title prefix (case-insensitive)", async () => {
        const songs = await getSongsByTitle("pAtIeNcE");
        expect(songs.length).toBe(1);
        expect(songs[0].title).toBe("Patience");
    });
});
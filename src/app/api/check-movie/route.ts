import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MovieEntry, MoviesJsonData, CheckMovieResponse } from "@/types/movie";

export async function GET(request: Request): Promise<NextResponse<CheckMovieResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get("id");

    if (!tmdbId) return NextResponse.json({ found: false, error: "Missing ID" }, { status: 400 });

    // 1. Читаємо локальний файл (Videoseed data)
    const filePath = path.join(process.cwd(), "src", "data", "movies.json");
    if (!fs.existsSync(filePath)) return NextResponse.json({ found: false, error: "DB missing" }, { status: 500 });

    const fileContents = fs.readFileSync(filePath, "utf8");
    const jsonData: MoviesJsonData = JSON.parse(fileContents);

    const movieInDb = jsonData.data.find(m => String(m.id_tmdb) === String(tmdbId));

    if (!movieInDb) return NextResponse.json({ found: false });

    let player2Url: string | undefined = undefined;

    // 2. Запитуємо Vibix API для другого плеєра, якщо є kp_id
    if (movieInDb.id_kp) {
      try {
        const vibixRes = await fetch(`https://vibix.org/api/v1/publisher/videos/kp/${movieInDb.id_kp}`, {
          headers: {
            'Authorization': `Bearer ${process.env.VIBIX_API_KEY}`,
            'Accept': 'application/json'
          },
          next: { revalidate: 3600 }
        });

        if (vibixRes.ok) {
          const vibixData = await vibixRes.json();
          player2Url = vibixData.iframe_url;
        }
      } catch (e) {
        console.error("Vibix API Error:", e);
      }
    }

    return NextResponse.json({
      found: true,
      player1Url: movieInDb.iframe, // З файлу Videoseed
      player2Url: player2Url,      // З Vibix API
      kp_id: movieInDb.id_kp
    });

  } catch (error) {
    return NextResponse.json({ found: false, error: "Internal Error" }, { status: 500 });
  }
}
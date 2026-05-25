const moodProfiles = {
  thrill: {
    label: "Edge-of-seat",
    keywords: ["crime", "mystery", "danger", "killer", "mission", "revenge", "secret", "battle"],
    genres: ["Action", "Thriller", "Crime", "Mystery"],
    runtime: "medium",
  },
  date: {
    label: "Date night",
    keywords: ["love", "romance", "heart", "family", "music", "dream", "wedding"],
    genres: ["Romance", "Comedy", "Drama", "Music"],
    runtime: "medium",
  },
  family: {
    label: "Family crowd",
    keywords: ["family", "friend", "adventure", "journey", "magic", "fun", "heart"],
    genres: ["Family", "Animation", "Adventure", "Comedy"],
    runtime: "short",
  },
  premium: {
    label: "Big screen",
    keywords: ["war", "space", "kingdom", "epic", "visual", "world", "hero", "legend"],
    genres: ["Action", "Adventure", "Science Fiction", "Fantasy"],
    runtime: "long",
  },
};

const languageLabels = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  ko: "Korean",
  ja: "Japanese",
};

const languageKeywords = {
  hindi: "hi",
  bollywood: "hi",
  english: "en",
  hollywood: "en",
  tamil: "ta",
  telugu: "te",
  malayalam: "ml",
  kannada: "kn",
  korean: "ko",
  japanese: "ja",
};

const semanticHints = {
  scary: ["Horror", "Thriller", "Mystery"],
  horror: ["Horror", "Thriller"],
  funny: ["Comedy", "Family"],
  comedy: ["Comedy"],
  laugh: ["Comedy"],
  romantic: ["Romance", "Drama"],
  romance: ["Romance", "Drama"],
  love: ["Romance", "Drama"],
  emotional: ["Drama", "Romance"],
  sad: ["Drama"],
  action: ["Action", "Adventure"],
  fight: ["Action", "Crime"],
  superhero: ["Action", "Adventure", "Science Fiction"],
  kids: ["Family", "Animation", "Adventure"],
  children: ["Family", "Animation"],
  animation: ["Animation", "Family"],
  mystery: ["Mystery", "Thriller", "Crime"],
  suspense: ["Thriller", "Mystery"],
  thriller: ["Thriller", "Crime", "Mystery"],
  sci: ["Science Fiction", "Adventure"],
  space: ["Science Fiction", "Adventure"],
  fantasy: ["Fantasy", "Adventure"],
  adventure: ["Adventure", "Action"],
  musical: ["Music", "Drama"],
  history: ["History", "Drama"],
  premium: ["Action", "Adventure", "Science Fiction", "Fantasy"],
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "for",
  "give",
  "i",
  "me",
  "movie",
  "movies",
  "of",
  "on",
  "show",
  "some",
  "the",
  "to",
  "watch",
  "with",
]);

export const aiPromptIdeas = [
  "fast action movie with high rating",
  "date night movie, romantic but not too long",
  "family friendly adventure in Hindi",
  "big screen visual movie with strong cast",
];

export const getGenreNames = (movie) =>
  movie?.genres?.map((genre) => genre.name).filter(Boolean) || [];

const getWords = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

const getIntent = (prompt, moodKey) => {
  const words = getWords(prompt);
  const language = Object.entries(languageKeywords).find(([keyword]) =>
    words.includes(keyword)
  )?.[1];

  return {
    words,
    language,
    hintedGenres: Array.from(
      new Set(words.flatMap((word) => semanticHints[word] || []))
    ),
    wantsShort: words.some((word) => ["short", "quick", "crisp"].includes(word)),
    wantsLong: words.some((word) => ["long", "epic", "big"].includes(word)),
    wantsTopRated: words.some((word) => ["best", "top", "rating", "rated", "popular"].includes(word)),
    profile: moodProfiles[moodKey] || moodProfiles.thrill,
  };
};

const scoreRuntime = (runtime = 0, intent) => {
  if (!runtime) return 0;
  if (intent.wantsShort || intent.profile.runtime === "short") return runtime <= 125 ? 10 : -4;
  if (intent.wantsLong || intent.profile.runtime === "long") return runtime >= 135 ? 10 : 2;
  return runtime >= 95 && runtime <= 155 ? 6 : 0;
};

export const getAiRecommendations = (movies, prompt, moodKey = "thrill", limit = 3) => {
  const intent = getIntent(prompt, moodKey);

  return [...movies]
    .map((movie) => {
      const genres = getGenreNames(movie);
      const searchable = [
        movie?.title,
        movie?.overview,
        movie?.tagline,
        genres.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;

      intent.words.forEach((word) => {
        if (movie?.title?.toLowerCase().includes(word)) score += 18;
        if (searchable.includes(word)) score += 8;
      });

      intent.profile.genres.forEach((genre) => {
        if (genres.includes(genre)) score += 14;
      });

      intent.hintedGenres.forEach((genre) => {
        if (genres.includes(genre)) score += 18;
      });

      intent.profile.keywords.forEach((word) => {
        if (searchable.includes(word)) score += 4;
      });

      if (intent.language && movie?.original_language === intent.language) score += 16;
      score += scoreRuntime(movie?.runtime, intent);
      score += (movie?.vote_average || 0) * (intent.wantsTopRated ? 2.4 : 1.4);

      const matchedGenres = genres.filter((genre) => intent.profile.genres.includes(genre));
      const language = languageLabels[movie?.original_language] || movie?.original_language?.toUpperCase();

      return {
        movie,
        score,
        match: Math.min(98, Math.max(72, Math.round(score + 52))),
        reason:
          matchedGenres.length > 0
            ? `${intent.profile.label} pick with ${matchedGenres.slice(0, 2).join(" + ")} energy${language ? ` in ${language}` : ""}.`
            : `Strong ${intent.profile.label.toLowerCase()} match based on rating, story signals, and runtime.`,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

export const getMovieAiInsights = (movie) => {
  const genres = getGenreNames(movie);
  const runtime = movie?.runtime || 0;
  const rating = movie?.vote_average || 0;

  const pace = runtime > 150 ? "slow-burn epic" : runtime < 115 ? "crisp watch" : "balanced theatrical ride";
  const crowd = genres.includes("Action")
    ? "friends who want scale and impact"
    : genres.includes("Romance")
    ? "date-night viewers"
    : genres.includes("Family") || genres.includes("Animation")
    ? "families and younger audiences"
    : "story-first movie lovers";
  const confidence = rating >= 7.5 ? "high-confidence" : rating >= 6.5 ? "safe" : "curiosity";

  return [
    `${confidence} recommendation for ${crowd}`,
    `${pace}${runtime ? ` at ${runtime} minutes` : ""}`,
    genres.length ? `Best mood: ${genres.slice(0, 2).join(" + ")}` : "Best mood: discovery watch",
  ];
};

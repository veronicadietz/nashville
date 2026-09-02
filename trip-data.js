window.TRIP_DATA = {
  trip: {
    title: "Cowboys, Cocktails & Cosmic Virgos",
    subtitle: "Nashville Trip HQ",
    datesLabel: "Sept 19 - 23, 2026",
    startDate: "2026-09-19",
    endDate: "2026-09-23",
    location: "Nashville, Tennessee",
    travelers: 3,
    nights: 4,
    homeBase: "East Nashville",
    tagline: "A shared trip site for plans, reservations, and spontaneous magic."
  },

  images: {
    hero: "assets/images/nashville.webp",
    stay: "assets/images/stay.webp"
  },

  flights: [
    {
      id: "veronica",
      traveler: "Veronica Grace Dietz",
      airline: "Southwest",
      accent: "#9B3531",
      outbound: {
        flight: "WN 4220",
        route: "LAS → BNA",
        date: "Sat, Sept 19, 2026",
        time: "6:40 AM - 12:15 PM",
        note: "Nonstop, 3h 35m"
      },
      return: {
        flight: "WN 0500 / WN 4847",
        route: "BNA → DEN → LAS",
        date: "Wed, Sept 23, 2026",
        time: "3:30 PM - 7:05 PM"
      },
      confirmation: "BRKMWF",
      seatNote: "Seats assigned at check-in"
    },
    {
      id: "natasha",
      traveler: "Natasha Harris",
      airline: "Delta",
      accent: "#C8795B",
      outbound: {
        flight: "DL 768",
        route: "LAX → BNA",
        date: "Sat, Sept 19, 2026",
        time: "6:45 AM - 12:44 PM",
        note: "Delta Main Basic (E)"
      },
      return: {
        flight: "DL 355",
        route: "BNA → LAX",
        date: "Wed, Sept 23, 2026",
        time: "3:26 PM - 5:49 PM"
      },
      confirmation: "",
      seatNote: "Seat assigned at gate"
    },
    {
      id: "kassiadoll",
      traveler: "Kassiadoll Harris",
      airline: "Delta",
      accent: "#98BDB6",
      outbound: {
        flight: "DL 768",
        route: "LAX → BNA",
        date: "Sat, Sept 19, 2026",
        time: "6:45 AM - 12:44 PM",
        note: "Delta Main Basic (E)"
      },
      return: {
        flight: "DL 355",
        route: "BNA → LAX",
        date: "Wed, Sept 23, 2026",
        time: "3:26 PM - 5:49 PM"
      },
      confirmation: "",
      seatNote: "Seat assigned at gate"
    }
  ],

  airportNote: "Meet at baggage claim / rental car center. Veronica lands at 12:15 PM. Natasha and Kassiadoll land at 12:44 PM.",

  car: {
    company: "Enterprise",
    confirmation: "2131844844",
    pickup: {
      location: "Nashville International Airport",
      date: "Saturday, September 19, 2026",
      time: "12:30 PM"
    },
    return: {
      location: "Nashville International Airport",
      date: "Wednesday, September 23, 2026",
      time: "3:00 PM"
    }
  },

  stay: {
    title: "Cozy Nashville Stay | 8 minutes to Downtown!",
    host: "Dominique",
    type: "Entire home in Nashville",
    area: "East Nashville / Gallatin Ave scene",
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    highlights: [
      "Private fenced yard with fire pit",
      "Free off-street parking",
      "About 15 minutes to BNA"
    ],
    address: "Exact check-in address: add when available in Airbnb reservation",
    url: "https://www.airbnb.com/rooms/1756236076704236180?guests=1&adults=1&s=67&unique_share_id=d25714c4-00a9-45e6-b128-418148b7bf70"
  },

  weather: {
    latitude: 36.1627,
    longitude: -86.7816,
    timezone: "America/Chicago",
    seasonalNote: "Late September in Nashville is usually warm during the day with milder evenings. The trip forecast will populate automatically once the dates enter the forecast window."
  },

  activities: [
    {
      id: "practical-magic",
      title: "Practical Magic Movie Night at the Airbnb",
      icon: "clapperboard",
      category: "witchy",
      bestTime: "Evening",
      address: "At the Airbnb",
      phone: "Not needed",
      reservationNotes: "Popcorn, candles, cozy pajamas, birthday drinks, and a little witchy setup.",
      vibe: "Cozy + witchy",
      link: ""
    },
    {
      id: "tarot-candle",
      title: "Tarot + Candle Ritual",
      icon: "moon-star",
      category: "witchy",
      bestTime: "Sunset or after dinner",
      address: "The Makeup Altar · 114 A S 11th St, Nashville, TN 37206",
      phone: "(615) 538-4515",
      reservationNotes: "Option 1: book tarot readings at The Makeup Altar in Five Points. Option 2: DIY at the Airbnb with a deck, ritual candles, journals, and one intention for the birthday year ahead. Confirm reader availability before choosing.",
      vibe: "Magical + reflective",
      link: "https://themakeupaltar.com/"
    },
    {
      id: "candle-pouring",
      title: "Intentional Candle-Pouring Workshop",
      icon: "flame",
      category: "witchy",
      bestTime: "Afternoon · reserve a group time",
      address: "Intentional Illumination at Nashville Farmers’ Market",
      phone: "(800) 984-7262",
      reservationNotes: "A separate hands-on option if the group prefers making intention candles instead of tarot. Check the official booking calendar before adding it to the plan.",
      vibe: "Creative + witchy",
      link: "https://www.intentionalillumination.com/"
    },
    {
      id: "music-row",
      title: "Music Row Cocktail Crawl",
      icon: "martini",
      category: "nightlife",
      bestTime: "7:00 PM onward",
      address: "Music Row / Demonbreun area, Nashville, TN",
      phone: "Add once bars are selected",
      reservationNotes: "Build a short crawl so the night stays fun instead of becoming a transportation project.",
      vibe: "Lively + glam",
      link: ""
    },
    {
      id: "birthday-tattoos",
      title: "Matching Birthday Tattoos",
      icon: "heart-pulse",
      category: "birthday",
      bestTime: "Afternoon, before a low-key evening",
      address: "Duel in the Sun · 3617 Gallatin Pike, Nashville, TN 37216",
      phone: "Call or text through the studio website",
      reservationNotes: "East Nashville option with custom work, original flash, and walk-ins on open days. Backup options: Kind Tattoo Parlor or Safe House Tattoo Studio. Agree on the design and placement first, then request appointments together. Avoid making this the heavy-drinking night.",
      vibe: "Bold + personal",
      link: "https://www.duelinthesun.co/"
    },
    {
      id: "horseback",
      title: "Horseback Riding",
      icon: "trees",
      category: "outdoors",
      bestTime: "Morning",
      address: "Outfitter: TBD",
      phone: "TBD",
      reservationNotes: "Confirm trail length, weight limits, footwear rules, and drive time before booking.",
      vibe: "Cowgirl + outdoorsy",
      link: ""
    },
    {
      id: "dollywood",
      title: "Dollywood Day Trip",
      icon: "sparkles",
      category: "daytrip",
      bestTime: "Leave Nashville early, full day",
      address: "2700 Dollywood Parks Blvd, Pigeon Forge, TN 37863",
      phone: "Confirm on official site",
      reservationNotes: "This is the biggest driving day. Buy tickets ahead and check park hours closer to the trip.",
      vibe: "Dolly + sparkle",
      link: "https://www.dollywood.com/"
    },
    {
      id: "dolly-stop",
      title: "Dolly's Tennessean Travel Stop",
      icon: "star",
      category: "dolly",
      bestTime: "Pair with the route that makes geographic sense",
      address: "Confirm exact stop and route before departure",
      phone: "TBD",
      reservationNotes: "Treat this as a bonus stop, not a reason to zigzag across Tennessee.",
      vibe: "Kitschy + cute",
      link: ""
    },
    {
      id: "thrift",
      title: "Best Thrift + Vintage Shopping",
      icon: "shirt",
      category: "shopping",
      bestTime: "Late morning into early afternoon",
      address: "Start: Music City Vintage · 1006 Fatherland St, Suite 305",
      phone: "Not usually needed",
      reservationNotes: "Suggested East Nashville loop: Music City Vintage for ’80s/’90s finds, then Garage Sale Vintage for shopping plus drinks, with Anaconda Vintage or High Class Hillbilly as optional add-ons. Recheck store hours before the trip.",
      vibe: "Vintage + western",
      link: "https://www.musiccityvtg.com/pages/visit-us-east-nashville"
    },
    {
      id: "parthenon",
      title: "The Parthenon at Centennial Park",
      icon: "landmark",
      category: "photo",
      bestTime: "Morning or late afternoon for photos",
      address: "2500 West End Ave, Nashville, TN 37203",
      phone: "Confirm museum hours closer to trip",
      reservationNotes: "Plan enough time for both exterior photos and the museum if you want to go inside.",
      vibe: "Iconic + photogenic",
      link: "https://www.nashville.gov/departments/parks/parthenon"
    },
    {
      id: "birthday-dining",
      title: "Birthday Brunch + Dinners",
      icon: "utensils",
      category: "food",
      bestTime: "Reserve prime dinners 2 to 4 weeks ahead",
      address: "Sirocco · 970 Woodland St, Nashville, TN 37206",
      phone: "(615) 664-8658",
      reservationNotes: "East Nashville option: Sirocco serves weekend brunch and dinner in a celebratory lounge setting. Brunch alternative: The Henry in 12 South. Choose one birthday dinner and one brunch, then reserve for the full group.",
      vibe: "Pretty + celebratory",
      link: "https://www.the-sirocco.com/"
    }
  ]
};

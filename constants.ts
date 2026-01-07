
import { Genre, Difficulty, CourseModule } from './types';

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 'foundations-theory',
    title: 'Level 1: The Foundations of Sound',
    lessons: [
      {
        id: 'notation-basics',
        title: 'Reading the Grand Staff',
        description: 'Master the fundamentals of musical notation for both Treble and Bass clef.',
        genre: Genre.CLASSICAL,
        difficulty: Difficulty.BEGINNER,
        content: 'Musical notation is a language. The lines and spaces of the staff represent specific pitches. Clefs act as a key to unlock these pitches...',
        xpValue: 100,
        imageUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=400',
        chords: [
          { name: 'Middle C', root: 'C', notes: ['C'] },
          { name: 'G Major Triad', root: 'G', notes: ['G', 'B', 'D'] }
        ]
      },
      {
        id: 'rhythm-simple',
        title: 'Rhythmic Pulse: Simple Meters',
        description: 'Understand 4/4, 3/4, and 2/4 time signatures and basic subdivisions.',
        genre: Genre.POP,
        difficulty: Difficulty.BEGINNER,
        content: 'Rhythm is the placement of sounds in time. Simple meters divide the beat into groups of two...',
        xpValue: 120,
        imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8d4078440?auto=format&fit=crop&q=80&w=400'
      }
    ]
  },
  {
    id: 'harmonic-essentials',
    title: 'Level 2: Harmonic Essentials',
    lessons: [
      {
        id: 'major-scales',
        title: 'The Architecture of Major Scales',
        description: 'Deep dive into the pattern of whole and half steps that defines the Major key.',
        genre: Genre.CLASSICAL,
        difficulty: Difficulty.BEGINNER,
        content: 'W-W-H-W-W-W-H. This simple pattern is the DNA of Western music...',
        xpValue: 150,
        imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=400',
        chords: [
          { name: 'C Major Scale (Root)', root: 'C', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] }
        ]
      },
      {
        id: 'triad-construction',
        title: 'Triads: The DNA of Harmony',
        description: 'Build Major, Minor, Augmented, and Diminished triads from scratch.',
        genre: Genre.ROCK,
        difficulty: Difficulty.BEGINNER,
        content: 'A triad is more than just three notes; it is an emotional foundation...',
        xpValue: 180,
        imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400',
        chords: [
          { name: 'C Major', root: 'C', notes: ['C', 'E', 'G'] },
          { name: 'C Minor', root: 'C', notes: ['C', 'Eb', 'G'] },
          { name: 'C Dim', root: 'C', notes: ['C', 'Eb', 'Gb'] },
          { name: 'C Aug', root: 'C', notes: ['C', 'E', 'G#'] }
        ]
      }
    ]
  },
  {
    id: 'intermediate-harmony',
    title: 'Level 3: Functional Harmony & 7ths',
    lessons: [
      {
        id: 'dominant-7ths',
        title: 'The Dominant 7th: Solving Tension',
        description: 'Learn why the V7 chord is the most important engine in functional harmony.',
        genre: Genre.BLUES,
        difficulty: Difficulty.INTERMEDIATE,
        content: 'The tritone between the 3rd and 7th of a dominant chord creates a powerful urge to resolve...',
        xpValue: 220,
        imageUrl: 'https://images.unsplash.com/photo-1593697972410-24750172949f?auto=format&fit=crop&q=80&w=400',
        chords: [
          { name: 'G7', root: 'G', notes: ['G', 'B', 'D', 'F'] },
          { name: 'C7', root: 'C', notes: ['C', 'E', 'G', 'Bb'] },
          { name: 'F7', root: 'F', notes: ['F', 'A', 'C', 'Eb'] }
        ]
      },
      {
        id: 'secondary-dominants',
        title: 'Secondary Dominants: Adding Color',
        description: 'Borrowing chords from related keys to create sophisticated harmonic motion.',
        genre: Genre.JAZZ,
        difficulty: Difficulty.INTERMEDIATE,
        content: 'A V/V (five of five) chord adds a sudden splash of color and direction to a phrase...',
        xpValue: 250,
        imageUrl: 'https://images.unsplash.com/photo-1415201374777-4192eef36069?auto=format&fit=crop&q=80&w=400',
        chords: [
          { name: 'D7 (V/V in C)', root: 'D', notes: ['D', 'F#', 'A', 'C'] },
          { name: 'A7 (V/ii in C)', root: 'A', notes: ['A', 'C#', 'E', 'G'] }
        ]
      }
    ]
  },
  {
    id: 'advanced-orchestration',
    title: 'Level 4: Advanced Composition & Form',
    lessons: [
      {
        id: 'sonata-form',
        title: 'Sonata-Allegro Form',
        description: 'Master the structural pillars: Exposition, Development, and Recapitulation.',
        genre: Genre.CLASSICAL,
        difficulty: Difficulty.ADVANCED,
        content: 'Sonata form is a narrative journey. It presents a conflict (Exposition), explores it (Development), and resolves it...',
        xpValue: 350,
        imageUrl: 'https://images.unsplash.com/photo-1520529011345-669b4b47038f?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'modal-interchange',
        title: 'Modal Interchange & Borrowed Chords',
        description: 'Blending colors from parallel scales (e.g., C Major and C Minor) for emotional depth.',
        genre: Genre.POP,
        difficulty: Difficulty.ADVANCED,
        content: 'The "iv" chord in a major key (the minor four) is a classic example of modal interchange...',
        xpValue: 400,
        imageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=400',
        chords: [
          { name: 'F Minor (iv)', root: 'F', notes: ['F', 'Ab', 'C'] },
          { name: 'Ab Major (bVI)', root: 'Ab', notes: ['Ab', 'C', 'Eb'] },
          { name: 'Bb Major (bVII)', root: 'Bb', notes: ['Bb', 'D', 'F'] }
        ]
      }
    ]
  },
  {
    id: 'expert-jazz-theory',
    title: 'Level 5: The Frontier of Jazz & Modernism',
    lessons: [
      {
        id: 'upper-extensions',
        title: 'Upper Structure Voicings',
        description: 'Using 9ths, 11ths, and 13ths to create the "dense" sound of modern jazz.',
        genre: Genre.JAZZ,
        difficulty: Difficulty.EXPERT,
        content: 'By stacking triads from different keys on top of a bass note, we unlock complex textures...',
        xpValue: 500,
        imageUrl: 'https://images.unsplash.com/photo-1514525253361-bee8d4078440?auto=format&fit=crop&q=80&w=400',
        chords: [
          { name: 'C13(b9)', root: 'C', notes: ['C', 'E', 'Bb', 'Db', 'A'] },
          { name: 'G7(alt)', root: 'G', notes: ['G', 'B', 'F', 'Ab', 'Bb', 'Eb'] }
        ]
      },
      {
        id: 'atonal-composition',
        title: 'Atonalism & 12-Tone Serialism',
        description: 'Breaking free from the tonic center to explore pure interval relationships.',
        genre: Genre.CLASSICAL,
        difficulty: Difficulty.EXPERT,
        content: 'The emancipation of dissonance. By treating all 12 tones equally, Schoenberg changed music history...',
        xpValue: 600,
        imageUrl: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&q=80&w=400'
      }
    ]
  },
  {
    id: 'production-track',
    title: 'Production: Studio Mastery',
    lessons: [
      {
        id: 'daw-flow',
        title: 'DAW Architecture & Signal Flow',
        description: 'Understanding inputs, outputs, buses, and inserts in a professional environment.',
        genre: Genre.PRODUCTION,
        difficulty: Difficulty.BEGINNER,
        content: 'Signal flow is the most critical technical concept in production. Understanding where the audio goes ensures a clean mix...',
        xpValue: 150,
        imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'comp-dynamics',
        title: 'Dynamic Control: Compression',
        description: 'Taming the transients to create a consistent, professional-sounding vocal or drum track.',
        genre: Genre.PRODUCTION,
        difficulty: Difficulty.INTERMEDIATE,
        content: 'Threshold, Ratio, Attack, and Release. These four parameters control the movement of your music...',
        xpValue: 250,
        imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'mastering-chains',
        title: 'The Final Polish: Mastering',
        description: 'Preparing your track for distribution through limiting, spatial enhancement, and final EQ.',
        genre: Genre.PRODUCTION,
        difficulty: Difficulty.EXPERT,
        content: 'Mastering is the bridge between the studio and the world. It is about translation across different speaker systems...',
        xpValue: 500,
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400'
      }
    ]
  }
];

export const GENRE_COLORS: Record<Genre, string> = {
  [Genre.CLASSICAL]: 'bg-amber-100 text-amber-800 border-amber-200',
  [Genre.JAZZ]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [Genre.POP]: 'bg-rose-100 text-rose-800 border-rose-200',
  [Genre.ROCK]: 'bg-slate-100 text-slate-800 border-slate-200',
  [Genre.BLUES]: 'bg-blue-100 text-blue-800 border-blue-200',
  [Genre.PRODUCTION]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  [Genre.ALL]: 'bg-slate-200 text-slate-700 border-slate-300',
};

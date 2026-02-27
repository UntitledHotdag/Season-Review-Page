import { useState } from 'react';
import { NameInputPage } from './components/NameInputPage';
import { MatchSelectionPage } from './components/MatchSelectionPage';
import { ResultsPage } from './components/ResultsPage';

type Page = 'name' | 'matches' | 'results';

export default function App() {
  const [page, setPage] = useState<Page>('name');
  const [userName, setUserName] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  return (
    <div
      className="min-h-screen w-full min-w-0 mx-auto relative max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl sm:px-4 md:px-6"
      style={{ background: '#0f0f0f', fontFamily: "'Noto Sans TC', sans-serif" }}
    >
      {/* Comic scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)',
        }}
      />

      {page === 'name' && (
        <NameInputPage
          onNext={(name) => {
            setUserName(name);
            setPage('matches');
          }}
        />
      )}

      {page === 'matches' && (
        <MatchSelectionPage
          userName={userName}
          onSubmit={(games) => {
            setSelectedGames(games);
            setPage('results');
          }}
        />
      )}

      {page === 'results' && (
        <ResultsPage
          userName={userName}
          selectedGames={selectedGames}
          onBack={() => setPage('matches')}
        />
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { PlayerData } from './types';
import Image from 'next/image';

export default function Home() {
  const [playerTag, setPlayerTag] = useState('');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details?: any } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'troops' | 'achievements'>('overview');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlayerData(null);

    try {
      const url = new URL('/api/player', window.location.origin);
      url.searchParams.set('tag', playerTag);

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        setError({
          message: data.error || 'Failed to fetch player data',
          details: data.details
        });
        return;
      }
      
      setPlayerData(data);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'An error occurred',
        details: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Clash of Clans Player Tracker
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={playerTag}
              onChange={(e) => setPlayerTag(e.target.value)}
              placeholder="Enter player tag (e.g., #ABC123)"
              className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 shadow-sm transition-colors dark:disabled:bg-blue-800"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400">
            <p className="font-semibold">{error.message}</p>
            {error.details && (
              <pre className="mt-2 text-sm whitespace-pre-wrap">
                {JSON.stringify(error.details, null, 2)}
              </pre>
            )}
          </div>
        )}

        {playerData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {/* Player Header */}
            <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-4">
                {playerData.league?.iconUrls?.medium && (
                  <div className="relative w-[72px] h-[72px]">
                    <Image
                      src={playerData.league.iconUrls.medium}
                      alt={playerData.league.name}
                      fill
                      className="object-contain rounded-full"
                      sizes="72px"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">{playerData.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{playerData.tag}</p>
                  {playerData.league && (
                    <p className="text-blue-600 dark:text-blue-400">{playerData.league.name}</p>
                  )}
                </div>
              </div>
              {playerData.clan && (
                <div className="ml-auto flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold dark:text-white">{playerData.clan.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clan Level {playerData.clan.clanLevel}
                    </p>
                  </div>
                  {playerData.clan.badgeUrls?.medium && (
                    <div className="relative w-[64px] h-[64px]">
                      <Image
                        src={playerData.clan.badgeUrls.medium}
                        alt={playerData.clan.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'overview'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('troops')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'troops'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Troops
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'achievements'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Achievements
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: 'Town Hall Level', value: playerData.townHallLevel },
                  { label: 'Experience Level', value: playerData.expLevel },
                  { label: 'Trophies', value: playerData.trophies },
                  { label: 'Best Trophies', value: playerData.bestTrophies },
                  { label: 'War Stars', value: playerData.warStars },
                  { label: 'Attack Wins', value: playerData.attackWins },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400">{label}</p>
                    <p className="text-xl font-bold dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'troops' && (
              <div className="space-y-8">
                {/* Home Village Troops */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Home Village Troops</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {playerData.troops
                      ?.filter(troop => troop.village === 'home' && !troop.name.startsWith('Super'))
                      .map((troop) => (
                        <div
                          key={troop.name}
                          className={`p-3 rounded-lg transition-all ${
                            troop.level === troop.maxLevel
                              ? 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-2 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                              : 'bg-gray-50 dark:bg-gray-700/50'
                          }`}
                        >
                          <p className={`font-semibold ${
                            troop.level === troop.maxLevel
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : 'dark:text-white'
                          }`}>
                            {troop.name}
                          </p>
                          <div className="flex justify-between mt-2">
                            <span className={
                              troop.level === troop.maxLevel
                                ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                : 'dark:text-gray-300'
                            }>
                              Level {troop.level}
                            </span>
                            <span className={
                              troop.level === troop.maxLevel
                                ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                : 'text-gray-500 dark:text-gray-400'
                            }>
                              Max: {troop.maxLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Super Troops */}
                {playerData.troops?.some(troop => troop.name.startsWith('Super')) && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Super Troops</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {playerData.troops
                        ?.filter(troop => troop.name.startsWith('Super'))
                        .map((troop) => (
                          <div
                            key={troop.name}
                            className={`p-3 rounded-lg transition-all ${
                              troop.level === troop.maxLevel
                                ? 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-2 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                                : 'bg-gray-50 dark:bg-gray-700/50'
                            }`}
                          >
                            <p className={`font-semibold ${
                              troop.level === troop.maxLevel
                                ? 'text-yellow-700 dark:text-yellow-300'
                                : 'dark:text-white'
                            }`}>
                              {troop.name}
                            </p>
                            <div className="flex justify-between mt-2">
                              <span className={
                                troop.level === troop.maxLevel
                                  ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                  : 'dark:text-gray-300'
                              }>
                                Level {troop.level}
                              </span>
                              <span className={
                                troop.level === troop.maxLevel
                                  ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                  : 'text-gray-500 dark:text-gray-400'
                              }>
                                Max: {troop.maxLevel}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Builder Base Troops */}
                {playerData.troops?.some(troop => troop.village === 'builderBase') && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Builder Base Troops</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {playerData.troops
                        ?.filter(troop => troop.village === 'builderBase')
                        .map((troop) => (
                          <div
                            key={troop.name}
                            className={`p-3 rounded-lg transition-all ${
                              troop.level === troop.maxLevel
                                ? 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-2 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                                : 'bg-gray-50 dark:bg-gray-700/50'
                            }`}
                          >
                            <p className={`font-semibold ${
                              troop.level === troop.maxLevel
                                ? 'text-yellow-700 dark:text-yellow-300'
                                : 'dark:text-white'
                            }`}>
                              {troop.name}
                            </p>
                            <div className="flex justify-between mt-2">
                              <span className={
                                troop.level === troop.maxLevel
                                  ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                  : 'dark:text-gray-300'
                              }>
                                Level {troop.level}
                              </span>
                              <span className={
                                troop.level === troop.maxLevel
                                  ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                  : 'text-gray-500 dark:text-gray-400'
                              }>
                                Max: {troop.maxLevel}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Heroes */}
                {playerData.heroes && playerData.heroes.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Heroes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {playerData.heroes.map((hero) => (
                        <div
                          key={hero.name}
                          className={`p-3 rounded-lg transition-all ${
                            hero.level === hero.maxLevel
                              ? 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-2 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                              : 'bg-gray-50 dark:bg-gray-700/50'
                          }`}
                        >
                          <p className={`font-semibold ${
                            hero.level === hero.maxLevel
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : 'dark:text-white'
                          }`}>
                            {hero.name}
                          </p>
                          <div className="flex justify-between mt-2">
                            <span className={
                              hero.level === hero.maxLevel
                                ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                : 'dark:text-gray-300'
                            }>
                              Level {hero.level}
                            </span>
                            <span className={
                              hero.level === hero.maxLevel
                                ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                : 'text-gray-500 dark:text-gray-400'
                            }>
                              Max: {hero.maxLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spells */}
                {playerData.spells && playerData.spells.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Spells</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {playerData.spells.map((spell) => (
                        <div
                          key={spell.name}
                          className={`p-3 rounded-lg transition-all ${
                            spell.level === spell.maxLevel
                              ? 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border-2 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                              : 'bg-gray-50 dark:bg-gray-700/50'
                          }`}
                        >
                          <p className={`font-semibold ${
                            spell.level === spell.maxLevel
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : 'dark:text-white'
                          }`}>
                            {spell.name}
                          </p>
                          <div className="flex justify-between mt-2">
                            <span className={
                              spell.level === spell.maxLevel
                                ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                : 'dark:text-gray-300'
                            }>
                              Level {spell.level}
                            </span>
                            <span className={
                              spell.level === spell.maxLevel
                                ? 'text-yellow-600 dark:text-yellow-200 font-semibold'
                                : 'text-gray-500 dark:text-gray-400'
                            }>
                              Max: {spell.maxLevel}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-4">
                {playerData.achievements?.map((achievement, index) => (
                  <div key={`${achievement.name}-${achievement.stars}-${achievement.value}-${index}`} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold dark:text-white">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.info}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold dark:text-white">{achievement.stars} ⭐</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.value} / {achievement.target}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (achievement.value / achievement.target) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

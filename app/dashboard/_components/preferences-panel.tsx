"use client";

import { useState } from "react";
import { setDailyBriefing, setTopicInterest } from "@/lib/actions/preferences";

type Topic = { name: string; slug: string };

type PreferencesPanelProps = {
  topics: Topic[];
  favorites: string[];
  dailyBriefing: boolean;
};

export default function PreferencesPanel({
  topics,
  favorites,
  dailyBriefing,
}: PreferencesPanelProps) {
  const [favs, setFavs] = useState(() => new Set(favorites));
  const [briefing, setBriefing] = useState(dailyBriefing);

  const toggleTopic = (slug: string) => {
    const next = new Set(favs);
    const enabled = !next.has(slug);
    if (enabled) next.add(slug);
    else next.delete(slug);
    setFavs(next);
    void setTopicInterest(slug, enabled);
  };

  const toggleBriefing = () => {
    const next = !briefing;
    setBriefing(next);
    void setDailyBriefing(next);
  };

  return (
    <>
      {/* Topic Interests */}
      <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-8">
        <h3 className="mb-3 text-[16px] font-medium uppercase tracking-[0.1em] text-on-surface-variant">
          Topic Interests
        </h3>
        <div className="space-y-4">
          {topics.map((topic) => (
            <label
              key={topic.slug}
              className="flex cursor-pointer items-center justify-between rounded border border-transparent p-3 transition-colors hover:border-outline-variant/20 hover:bg-surface-container"
            >
              <span className="text-[16px]">{topic.name}</span>
              <input
                type="checkbox"
                checked={favs.has(topic.slug)}
                onChange={() => toggleTopic(topic.slug)}
                className="size-4 rounded accent-primary"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-8">
        <h3 className="mb-3 text-[16px] font-medium uppercase tracking-[0.1em] text-on-surface-variant">
          Notifications
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-3">
            <div>
              <h4 className="text-[16px]">The Daily Briefing</h4>
              <p className="text-[12px] text-on-surface-variant">
                Top headlines every morning
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={briefing}
                onChange={toggleBriefing}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-outline-variant after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

import React from 'react';
import Card from './shared/Card';
import { PlayIcon } from './icons/Icons';

interface ContentItemProps {
  category: string;
  title: string;
  author: string;
  type: 'Article' | 'Video' | 'Podcast';
  imageUrl: string;
}

const ContentItem: React.FC<ContentItemProps> = ({ category, title, author, type, imageUrl }) => {
    return (
      <div className="group relative overflow-hidden rounded-xl">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{category}</p>
          <h3 className="text-lg font-bold text-white mt-1">{title}</h3>
          <p className="text-sm text-gray-300 mt-1">by {author}</p>
          {type !== 'Article' && (
            <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
              <PlayIcon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>
    );
};


const PremiumHub: React.FC = () => {
    // FIX: Explicitly typed the content array to ensure the 'type' property is correctly inferred.
    const content: ContentItemProps[] = [
        { category: "Trade Planning", title: "Day-Ahead Plan: ES & NQ Key Levels", author: "Expert Trader", type: "Article", imageUrl: "https://picsum.photos/seed/plan/400/300" },
        { category: "Event Playbook", title: "How to Trade the FOMC Announcement", author: "Market Pro", type: "Video", imageUrl: "https://picsum.photos/seed/fomc/400/300" },
        { category: "Daily Briefing", title: "Market Outlook: Pre-Market Analysis", author: "Lead Analyst", type: "Podcast", imageUrl: "https://picsum.photos/seed/podcast/400/300" },
        { category: "Pro Analysis", title: "Breaking Down a Winning NQ Trade", author: "Funded Trader", type: "Video", imageUrl: "https://picsum.photos/seed/analysis/400/300" },
        { category: "Event Playbook", title: "Navigating CPI Volatility", author: "Market Pro", type: "Article", imageUrl: "https://picsum.photos/seed/cpi/400/300" },
        { category: "Pro Analysis", title: "Gold Trade Review & Market Structure", author: "Funded Trader", type: "Video", imageUrl: "https://picsum.photos/seed/gold/400/300" },
    ];
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Premium Content & Media Hub</h2>
        <p className="text-sm text-indigo-400 font-medium">Exclusive Access</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item, index) => (
          <ContentItem key={index} {...item} />
        ))}
      </div>
    </Card>
  );
};

export default PremiumHub;
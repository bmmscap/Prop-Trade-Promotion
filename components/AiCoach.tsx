import React, { useState, useCallback, useRef } from 'react';
import { Account, AiCoachTab, GroundingSource } from '../types';
import Tabs from './shared/Tabs';
import Card from './shared/Card';
import Button from './shared/Button';
import Spinner from './shared/Spinner';
import {
  getPerformanceReview,
  getPreMarketPlan,
  getMarketBriefing,
  getJournalAnalysis,
  getChartReview,
  getTextToSpeechAudio
} from '../services/geminiService';
import { PlayIcon, StopIcon, UploadIcon } from './icons/Icons';
import { decode, decodeAudioData } from '../utils/audio';

// Define AiCoachTab enum values as an array
const TABS = Object.values(AiCoachTab);

const AiCoach: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  const [activeTab, setActiveTab] = useState<AiCoachTab>(AiCoachTab.PERFORMANCE_REVIEW);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<GroundingSource[]>([]);

  // States for Chart Review
  const [chartFile, setChartFile] = useState<File | null>(null);
  const [chartQuestion, setChartQuestion] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Journal Analysis
  const [journalText, setJournalText] = useState('');

  // States for TTS
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);


  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setResult('');
    setSources([]);
    
    try {
      let response: string | { text: string; sources: any[] };
      const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

      switch (activeTab) {
        case AiCoachTab.PERFORMANCE_REVIEW:
          if (selectedAccount) response = await getPerformanceReview(selectedAccount);
          else response = 'Please select an account.';
          break;
        case AiCoachTab.PRE_MARKET_PLAN:
          if (selectedAccount) response = await getPreMarketPlan(selectedAccount);
          else response = 'Please select an account.';
          break;
        case AiCoachTab.MARKET_BRIEFING:
          response = await getMarketBriefing();
          break;
        case AiCoachTab.JOURNAL_ANALYSIS:
            if(!journalText) {
                response = 'Please enter some text in your journal.';
                break;
            }
            response = await getJournalAnalysis(journalText);
            break;
        case AiCoachTab.CHART_REVIEW:
            if (!chartFile || !chartQuestion) {
                response = 'Please upload a chart image and ask a question.';
                break;
            }
            response = await getChartReview(chartFile, chartQuestion);
            break;
        default:
          response = 'Feature not implemented.';
      }

      if (typeof response === 'string') {
        setResult(response);
      } else {
        setResult(response.text);
        setSources(response.sources);
      }

    } catch (error) {
      console.error("AI Coach Error:", error);
      setResult("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedAccountId, accounts, journalText, chartFile, chartQuestion]);
  
  const handlePlayBriefing = async () => {
    if (isPlaying) {
        audioSourceRef.current?.stop();
        setIsPlaying(false);
        return;
    }

    if (!result) return;
    setIsSynthesizing(true);
    try {
        const audioData = await getTextToSpeechAudio(result);
        if (audioData) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const context = audioContextRef.current;
            const decodedData = decode(audioData);
            const audioBuffer = await decodeAudioData(decodedData, context, 24000, 1);
            
            const source = context.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(context.destination);
            source.onended = () => setIsPlaying(false);
            source.start(0);
            
            audioSourceRef.current = source;
            setIsPlaying(true);
        }
    } catch(error) {
        console.error("Error playing audio:", error);
    } finally {
        setIsSynthesizing(false);
    }
  };


  const renderInputs = () => {
    switch (activeTab) {
      case AiCoachTab.PERFORMANCE_REVIEW:
      case AiCoachTab.PRE_MARKET_PLAN:
        return (
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full sm:w-1/2 bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.firm} - {acc.id}</option>
            ))}
          </select>
        );
      case AiCoachTab.JOURNAL_ANALYSIS:
        return (
            <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Paste your raw trading journal text here..."
                rows={5}
                className="w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
            />
        );
      case AiCoachTab.CHART_REVIEW:
          return (
              <div className="space-y-4">
                  <input
                      type="text"
                      value={chartQuestion}
                      onChange={(e) => setChartQuestion(e.target.value)}
                      placeholder="Ask a question about your chart..."
                      className="w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setChartFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                  />
                  <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full">
                      <UploadIcon className="w-5 h-5 mr-2" />
                      {chartFile ? chartFile.name : 'Upload Chart Image'}
                  </Button>
              </div>
          );
      default:
        return null;
    }
  };

  return (
    <Card className='h-full flex flex-col'>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-white">AI Coach</h2>
          <div className="sm:w-1/2">
            <Tabs tabs={TABS} activeTab={activeTab} onTabClick={(tab) => {
                setActiveTab(tab);
                setResult('');
                setSources([]);
            }} />
          </div>
      </div>

      <div className="mt-6 flex-grow flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 space-y-4">
            <p className="text-gray-400 text-sm">Configure your request and get AI-powered insights.</p>
            {renderInputs()}
            <Button onClick={handleGenerate} isLoading={isLoading} className="w-full">
                Generate {activeTab}
            </Button>
        </div>
        <div className="lg:w-2/3 bg-gray-900 rounded-lg p-4 h-96 lg:h-auto overflow-y-auto">
            {isLoading ? <Spinner /> : (
                <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-ul:text-gray-300">
                    {result ? <div dangerouslySetInnerHTML={{__html: result.replace(/\n/g, '<br />')}} /> : <p className="text-gray-500">Your AI-generated content will appear here.</p>}
                </div>
            )}
            {activeTab === AiCoachTab.MARKET_BRIEFING && result && !isLoading && (
              <div className="mt-4">
                <Button onClick={handlePlayBriefing} isLoading={isSynthesizing} disabled={isLoading} variant="secondary">
                  {isPlaying ? <StopIcon/> : <PlayIcon />}
                  <span className="ml-2">{isPlaying ? 'Stop' : 'Play Briefing'}</span>
                </Button>
              </div>
            )}

            {sources.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <h4 className="font-semibold text-gray-300 mb-2">Sources:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {sources.map((source, index) => (
                           source.web && <li key={index} className="text-sm">
                                <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                    {source.web.title || source.web.uri}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </div>
    </Card>
  );
};

export default AiCoach;

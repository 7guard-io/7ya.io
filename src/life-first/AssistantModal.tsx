'use client';
import {useState} from 'react';

const paths = [
  'להגיד את הסיפור',
  'לעבוד יחד',
  'להזמין את איגור',
  'מחקר ורעיונות',
  'לבנות אישית',
  'לבדוק את המקורות',
] as const;

export function AssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState<(typeof paths)[number] | null>(null);
  return (
    <>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        className='fixed bottom-52 left-4 z-30 rounded-full border border-neutral-700 bg-neutral-950/95 px-4 py-3 text-xs font-semibold text-white shadow-[0_16px_44px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors hover:border-white md:bottom-8'
      >
        7YA Agent
      </button>
      {isOpen ? (
        <div className='fixed inset-0 z-[60] flex items-end bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6'>
          <section
            role='dialog'
            aria-modal='true'
            aria-labelledby='assistant-title'
            className='relative w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-950/95 text-white shadow-[0_28px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl'
          >
            <div
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_0%,rgba(255,255,255,0.12),transparent_42%),radial-gradient(ellipse_at_86%_100%,rgba(115,115,115,0.15),transparent_46%)]'
            />
            <div className='relative border-b border-neutral-800 px-5 py-5 sm:px-6'>
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                aria-label='Close 7YA Agent'
                className='absolute left-4 top-4 grid size-8 place-items-center rounded-full border border-neutral-700 text-neutral-300 transition-colors hover:border-white hover:text-white'
              >
                ×
              </button>
              <p className='pr-10 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500'>7YA Agent</p>
              <h2 id='assistant-title' className='mt-2 text-2xl font-black tracking-[-0.04em]'>
                לאן נפתח את הדרך?
              </h2>
              <p className='mt-2 text-sm leading-6 text-neutral-400'>חיים, תוכן, השפעה ומערכות — מתוך הסיפור עצמו.</p>
            </div>
            <div className='relative grid gap-2 p-4 sm:grid-cols-2 sm:p-6'>
              {paths.map((path) => (
                <button
                  key={path}
                  type='button'
                  onClick={() => setSelectedPath(path)}
                  className={`rounded-xl border px-4 py-4 text-right text-sm font-semibold transition-colors ${
                    selectedPath === path
                      ? 'border-white bg-white text-black'
                      : 'border-neutral-800 bg-black/35 text-white hover:border-neutral-500'
                  }`}
                >
                  {path}
                </button>
              ))}
            </div>
            {selectedPath ? <p className='relative border-t border-neutral-800 px-5 py-4 text-sm text-neutral-300 sm:px-6'>{selectedPath}</p> : null}
          </section>
        </div>
      ) : null}
    </>
  );
}

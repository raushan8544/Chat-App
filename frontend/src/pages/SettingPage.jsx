import { THEMES} from '../theme/Theme'
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from 'react';

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { animationsEnabled, setAnimationsEnabled } = useThemeStore();
  const [currentAttr, setCurrentAttr] = useState(() => typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : theme);
  const [primaryBg, setPrimaryBg] = useState(null);
  const sampleRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const attr = document.documentElement.getAttribute('data-theme');
      setCurrentAttr(attr);
      if (sampleRef.current) {
        const style = getComputedStyle(sampleRef.current);
        setPrimaryBg(style.backgroundColor || null);
      }
      try {
        // print a small snapshot of style sheet content to console to help debugging
        const hrefs = Array.from(document.styleSheets).slice(0,6).map(s=> s.href || s.ownerNode?.textContent?.slice?.(0,80) || 'inline').join('\n');
        console.debug('SettingPage: stylesheet snapshot (first few hrefs/text heads):\n', hrefs);
      } catch (e) {
        console.debug('SettingPage: stylesheet snapshot error', e);
      }
    };
    // update initially and when theme changes
    update();
    // small interval to catch any asynchronous style updates
    const id = setInterval(update, 300);
    return () => clearInterval(id);
  }, [theme]);

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="checkbox" checked={animationsEnabled} onChange={(e) => setAnimationsEnabled(e.target.checked)} />
            <span className="text-sm">Enable animations</span>
          </label>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"}
              `}
              onClick={() => setTheme(t)}
              onMouseDown={() => console.debug('SettingPage: theme button mousedown', t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Debug indicator: shows current data-theme and computed primary button color */}
        <div className="mt-4 p-3 border rounded-md bg-base-100">
          <h4 className="text-sm font-medium mb-2">Theme debug</h4>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-base-content/70">document.data-theme</div>
              <div className="font-mono text-sm">{currentAttr}</div>
            </div>
            <div>
              <div className="text-xs text-base-content/70">Computed .btn.btn-primary bg</div>
              <div className="font-mono text-sm">{primaryBg || '—'}</div>
            </div>
            <div className="ml-4">
              <button ref={sampleRef} className="btn btn-primary">Sample</button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat UI */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                          `}
                        >
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingPage;
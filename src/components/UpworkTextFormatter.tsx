import React, { useState, useEffect, useRef } from "react";
import {
  Copy,
  Sparkles,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  List,
  Smile,
  CheckCircle,
  Zap,
  Target,
  Star,
} from "lucide-react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

/**
 * Unicode characters that mimic various text styles.
 * These are used to convert standard characters into their styled counterparts.
 */
const unicodeBold: Record<string, string> = {
  A: "𝗔",
  B: "𝗕",
  C: "𝗖",
  D: "𝗗",
  E: "𝗘",
  F: "𝗙",
  G: "𝗚",
  H: "𝗛",
  I: "𝗜",
  J: "𝗝",
  K: "𝗞",
  L: "𝗟",
  M: "𝗠",
  N: "𝗡",
  O: "𝗢",
  P: "𝗣",
  Q: "𝗤",
  R: "𝗥",
  S: "𝗦",
  T: "𝗧",
  U: "𝗨",
  V: "𝗩",
  W: "𝗪",
  X: "𝗫",
  Y: "𝗬",
  Z: "𝗭",
  a: "𝗮",
  b: "𝗯",
  c: "𝗰",
  d: "𝗱",
  e: "𝗲",
  f: "𝗳",
  g: "𝗴",
  h: "𝗵",
  i: "𝗶",
  j: "𝗷",
  k: "𝗸",
  l: "𝗹",
  m: "𝗺",
  n: "𝗻",
  o: "𝗼",
  p: "𝗽",
  q: "𝗾",
  r: "𝗿",
  s: "𝘀",
  t: "𝘁",
  u: "𝘂",
  v: "𝘃",
  w: "𝘄",
  x: "𝘅",
  y: "𝘆",
  z: "𝘇",
  "0": "𝟬",
  "1": "𝟭",
  "2": "𝟮",
  "3": "𝟯",
  "4": "𝟰",
  "5": "𝟱",
  "6": "𝟲",
  "7": "𝟳",
  "8": "𝟴",
  "9": "𝟵",
};

const unicodeItalic: Record<string, string> = {
  A: "𝘈",
  B: "𝘉",
  C: "𝘊",
  D: "𝘋",
  E: "𝘌",
  F: "𝘍",
  G: "𝘎",
  H: "𝘏",
  I: "𝘐",
  J: "𝘑",
  K: "𝘒",
  L: "𝘓",
  M: "𝘔",
  N: "𝘕",
  O: "𝘖",
  P: "𝘗",
  Q: "𝘘",
  R: "𝘙",
  S: "𝘚",
  T: "𝘛",
  U: "𝘜",
  V: "𝘝",
  W: "𝘞",
  X: "𝘟",
  Y: "𝘠",
  Z: "𝘡",
  a: "𝘢",
  b: "𝘣",
  c: "𝘤",
  d: "𝘥",
  e: "𝘦",
  f: "𝘧",
  g: "𝘨",
  h: "𝘩",
  i: "𝘪",
  j: "𝘫",
  k: "𝘬",
  l: "𝘭",
  m: "𝘮",
  n: "𝘯",
  o: "𝘰",
  p: "𝘱",
  q: "𝘲",
  r: "𝘳",
  s: "𝘴",
  t: "𝘵",
  u: "𝘶",
  v: "𝘷",
  w: "𝘸",
  x: "𝘹",
  y: "𝘺",
  z: "𝘻",
};

const UpworkTextFormatter = () => {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [upworkText, setUpworkText] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<number>(0);

  /**
   * Converts a string into its Unicode bold counterpart.
   */
  const toUnicodeBold = (str: string): string => {
    return str
      .split("")
      .map((char) => unicodeBold[char] || char)
      .join("");
  };

  /**
   * Converts a string into its Unicode italic counterpart.
   */
  const toUnicodeItalic = (str: string): string => {
    return str
      .split("")
      .map((char) => unicodeItalic[char] || char)
      .join("");
  };

  /**
   * Adds a combining low line character to each character to simulate underline.
   */
  const toUnicodeUnderline = (str: string): string => {
    return str
      .split("")
      .map((char) => char + "\u0332")
      .join("");
  };

  /**
   * Helper function to insert formatted text at the cursor position.
   */
  const insertFormattedText = (prefix: string, suffix = ""): void => {
    const textarea = markdownRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdownText.substring(start, end);
    const newText =
      markdownText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      markdownText.substring(end);
    setMarkdownText(newText);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.selectionEnd = start + prefix.length + selectedText.length;
      }
    }, 0);
  };

  const handleBold = (): void => insertFormattedText("**", "**");
  const handleItalic = (): void => insertFormattedText("*", "*");
  const handleUnderline = (): void => insertFormattedText("__", "__");

  /** Handles emoji selection from the picker. */
  const onEmojiClick = (emojiData: EmojiClickData): void => {
    const textarea = markdownRef.current;
    if (!textarea) return;

    // Save current scroll position
    const scrollTop = textarea.scrollTop;

    // Use the last known cursor position to insert the emoji
    const start = cursorPositionRef.current;
    const newText =
      markdownText.substring(0, start) +
      emojiData.emoji +
      markdownText.substring(start);
    setMarkdownText(newText);

    // Move cursor to the end of the newly inserted emoji
    const newCursorPosition = start + emojiData.emoji.length;

    setTimeout(() => {
      if (textarea) {
        textarea.focus({ preventScroll: true }); // 👈 prevent auto-scrolling
        textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
        textarea.scrollTop = scrollTop; // 👈 restore scroll position
      }
    }, 0);

    setShowEmojiPicker(false);
  };

  const handleBullet = (): void => {
    const textarea = markdownRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const text = markdownText;
    let newText = text;
    let newCursorPosition = selectionEnd;

    const lineStart = text.lastIndexOf("\n", selectionStart - 1) + 1;
    const selectedLines = text.substring(lineStart, selectionEnd);

    const alreadyBulleted = selectedLines
      .split("\n")
      .every((line) => line.trim().startsWith("-"));

    if (alreadyBulleted) {
      newText =
        text.substring(0, lineStart) +
        selectedLines
          .split("\n")
          .map((line) => line.replace(/^- /, ""))
          .join("\n") +
        text.substring(selectionEnd);
      newCursorPosition = selectionEnd - selectedLines.split("\n").length * 2;
    } else {
      newText =
        text.substring(0, lineStart) +
        selectedLines
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n") +
        text.substring(selectionEnd);
      newCursorPosition = selectionEnd + selectedLines.split("\n").length * 2;
    }

    setMarkdownText(newText);
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
      }
    }, 0);
  };

  // Add click outside handler to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        !(event.target as Element).closest(".EmojiPickerReact")
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  /** Converts Markdown to Upwork-compatible Unicode. */
  useEffect(() => {
    let convertedText = markdownText;

    convertedText = convertedText.replace(/\*\*(.*?)\*\*/g, (_match, p1) =>
      toUnicodeBold(p1)
    );
    convertedText = convertedText.replace(/\*(.*?)\*/g, (_match, p1) =>
      toUnicodeItalic(p1)
    );
    convertedText = convertedText.replace(/__(.*?)__/g, (_match, p1) =>
      toUnicodeUnderline(p1)
    );
    convertedText = convertedText.replace(/^- (.*)$/gm, "• $1");

    setUpworkText(convertedText);
  }, [markdownText]);

  const handleCopy = (): void => {
    if (upworkText) {
      try {
        navigator.clipboard.writeText(upworkText).then(() => {
          setMessage("Successfully copied to clipboard!");
          setIsCopied(true);
          setTimeout(() => {
            setMessage("");
            setIsCopied(false);
          }, 3000);
        });
      } catch (err) {
        console.error("Failed to copy text:", err);
        setMessage("Failed to copy. Please try again.");
      }
    }
  };

  /** Handle tracking of cursor position */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
    cursorPositionRef.current = e.target.selectionEnd;
  };

  const features = [
    {
      icon: Bold,
      title: "Text Formatting",
      desc: "Bold, italic, and underline support",
    },
    {
      icon: Smile,
      title: "Emoji Support",
      desc: "Add emojis to make your profile pop",
    },
    {
      icon: List,
      title: "Bullet Points",
      desc: "Organize your skills and experience",
    },
    {
      icon: Zap,
      title: "Instant Conversion",
      desc: "Real-time markdown to Unicode",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">
              Upwork Profile Formatter
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your ordinary text into eye-catching, professionally
              formatted Upwork profiles that stand out from the crowd
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  No signup required
                </span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <Zap className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Instant results
                </span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  Free forever
                </span>
              </div>
            </div>
          </div>

          {/* Main Editor Section */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Input Side */}
              <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Target className="w-6 h-6 text-indigo-500 mr-3" />
                    Write Your Story
                  </h2>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-2xl relative">
                  <button
                    onMouseDown={(e) => e.preventDefault()} // 👈 This is the key fix to prevent focus loss
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center justify-center w-10 h-10 bg-white hover:bg-yellow-50 border border-gray-200 hover:border-yellow-300 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                    aria-label="Insert Emoji"
                  >
                    <Smile className="w-5 h-5 text-yellow-600" />
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleBold}
                    className="flex items-center justify-center w-10 h-10 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                    aria-label="Bold"
                  >
                    <Bold className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleItalic}
                    className="flex items-center justify-center w-10 h-10 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                    aria-label="Italic"
                  >
                    <Italic className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleUnderline}
                    className="flex items-center justify-center w-10 h-10 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                    aria-label="Underline"
                  >
                    <Underline className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleBullet}
                    className="flex items-center justify-center w-10 h-10 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm"
                    aria-label="Bullet Points"
                  >
                    <List className="w-5 h-5 text-gray-700" />
                  </button>

                  {/* React Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute z-50 top-full mt-2 left-0 w-full sm:w-auto">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        skinTonesDisabled
                        lazyLoadEmojis
                      />
                    </div>
                  )}
                </div>

                <textarea
                  ref={markdownRef}
                  className="w-full h-80 lg:h-96 p-6 rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-200 resize-none text-gray-900 text-lg leading-relaxed placeholder-gray-400"
                  placeholder="🚀 Start crafting your compelling profile story here...

**Example:**
I'm a **passionate freelancer** with *5+ years* of experience in:
- Web Development
- UI/UX Design  
- Digital Marketing

Ready to help you achieve your goals! 💪"
                  value={markdownText}
                  onChange={handleTextareaChange}
                  onSelect={(e) => {
                    cursorPositionRef.current = (
                      e.target as HTMLTextAreaElement
                    ).selectionStart;
                  }}
                />
              </div>

              {/* Output Side */}
              <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Sparkles className="w-6 h-6 text-purple-500 mr-3" />
                    Formatted Output
                  </h2>
                  <button
                    onClick={handleCopy}
                    disabled={!upworkText.trim()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isCopied
                        ? "bg-green-500 text-white shadow-green-200"
                        : upworkText.trim()
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-indigo-200"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isCopied ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    {isCopied ? "Copied!" : "Copy Text"}
                  </button>
                </div>

                <div className="relative">
                  <div
                    className="w-full h-80 lg:h-96 p-6 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 overflow-y-auto whitespace-pre-wrap text-lg leading-relaxed shadow-sm"
                    dangerouslySetInnerHTML={{
                      __html:
                        upworkText.replace(/\n/g, "<br />") ||
                        '<span class="text-gray-400">Your formatted text will appear here...</span>',
                    }}
                  />
                  {!upworkText.trim() && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 font-medium">
                          Start typing to see the magic happen!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {message && (
                  <div
                    className={`mt-4 p-4 rounded-xl flex items-center font-medium transition-all duration-300 ${
                      isCopied
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {isCopied ? (
                      <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    )}
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          {/* How to Use Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 lg:p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  How It Works
                </h2>
                <p className="text-xl opacity-90">
                  Transform your profile in 3 simple steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-black">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Write Your Content</h3>
                  <p className="opacity-90">
                    Type your profile description using simple markdown syntax
                    like **bold** and *italic*
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-black">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">See the Magic</h3>
                  <p className="opacity-90">
                    Watch as your text transforms into beautiful Unicode
                    formatting in real-time
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-black">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Copy & Paste</h3>
                  <p className="opacity-90">
                    Copy the formatted text and paste it directly into your
                    Upwork profile
                  </p>
                </div>
              </div>

              <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 bg-opacity-10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">
                  💡 Pro Tips for Better Profiles
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-2">
                      ✨ Use **bold** for important skills and achievements
                    </p>
                    <p className="mb-2">
                      🎯 Add bullet points to organize your experience
                    </p>
                  </div>
                  <div>
                    <p className="mb-2">
                      😊 Include relevant emojis to add personality
                    </p>
                    <p className="mb-2">
                      📊 Highlight specific numbers and results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-16 py-8 border-t border-gray-200">
            <p className="text-gray-600 mb-2">
              Built with ❤️ for freelancers worldwide
            </p>
            <p className="text-sm text-gray-500">
              Powered by React & Tailwind CSS • Free forever
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default UpworkTextFormatter;

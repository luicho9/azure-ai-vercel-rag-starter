"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Message } from "ai";
import { useChat } from "ai/react";
import { useRef, useEffect, useState, useMemo, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Moon, Send, Sun } from "lucide-react";
import ReactMarkdown, { Options } from "react-markdown";
import ProjectOverview from "./project-overview";

import { useTheme } from "next-themes";

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle dark mode"
        className="data-[state=checked]:bg-muted-foreground data-[state=unchecked]:bg-muted-foreground"
      />
      <Moon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle dark mode</span>
    </div>
  );
};

export default function ChatInterface() {
  const [toolCall, setToolCall] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      maxToolRoundtrips: 4,
      onToolCall({ toolCall }: { toolCall: { toolName: string } }) {
        setToolCall(toolCall.toolName);
      },
      onError: (error: any) => {
        setError(
          JSON.parse(error.message)?.error ||
          "An error occurred, please try again later!"
        );
      },
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmitWithErrorReset = (event: React.FormEvent) => {
    setError(null);
    handleSubmit(event);
  };

  return (
    <div className="flex flex-col min-w-0 h-screen bg-background">
      <div className="flex flex-row justify-between items-center p-4">
        <ThemeChanger />
        <a href="https://github.com/Azure-Samples/azure-ai-vercel-rag-starter" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200" target="_blank" rel="noopener noreferrer">
          Source Code
        </a>
      </div>
      {/* Header */}
      <div className="text-center mb-4 md:mb-8">
        <h1 className="text-2xl font-bold mb-2">AI Chat</h1>
        <p className="text-sm text-muted-foreground">
          A minimal RAG chat application built with Azure AI Search, Azure
          OpenAI, and the Vercel AI SDK
        </p>
      </div>

      {/* if messages is empty, show project overview message*/}
      {messages.length === 0 && (
        <div className="flex p-2 overflow-y-auto mb-4 space-y-4 justify-center items-center">
          <ProjectOverview />
        </div>
      )}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 w-full">
        <AnimatePresence initial={false}>
          {messages.map(
            (message: Message) =>
              message.content && (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`max-w-3xl mx-auto px-4 flex ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[85%] ${message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                      }`}
                  >
                    <div className="whitespace-pre-wrap overflow-wrap-break-word">
                      <MemoizedReactMarkdown>
                        {message.content}
                      </MemoizedReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-lg px-4 py-2 bg-red-500 text-white">
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-lg px-4 py-2 bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {toolCall === "getInformation"
                  ? "Getting information..."
                  : "Thinking..."}
              </span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="sticky bottom-0 bg-background w-full p-4 max-w-3xl mx-auto">
        <form onSubmit={handleSubmitWithErrorReset} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Send a message..."
            className="flex-1 border-2"
          />
          <Button
            disabled={isLoading || !input}
            type="submit"
            className="flex-shrink-0 p-2"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

const MemoizedReactMarkdown: React.FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);

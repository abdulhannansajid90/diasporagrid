import { ChatInterface } from "@/components/rooh-network/ChatInterface";

export default function RoohNetworkPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Rooh-Network
        </h2>
        <p className="text-muted-foreground mt-2">
          Your private, AI-powered emotional support system. You are not alone.
        </p>
      </div>

      <ChatInterface />
    </div>
  );
}

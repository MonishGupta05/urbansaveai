import { useState, useEffect } from "react";
import { backend, OperationLog } from "@/services/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bug,
  X,
  Database,
  Activity,
  HardDrive,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [storageSize, setStorageSize] = useState("0 B");

  const refreshData = () => {
    setData(backend.getAllData());
    setLogs(backend.getOperationLogs());
    setStorageSize(backend.getFormattedStorageSize());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      const interval = setInterval(refreshData, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const operationColors = {
    CREATE: "bg-green-500/20 text-green-400 border-green-500/30",
    READ: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    UPDATE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 gap-2 bg-background/80 backdrop-blur-sm border-primary/30 shadow-lg hover:bg-primary/10"
      >
        <Bug className="h-4 w-4" />
        Dev Tools
      </Button>
    );
  }

  return (
    <Card
      className={`fixed right-4 z-50 w-96 shadow-2xl border-primary/30 bg-background/95 backdrop-blur-sm transition-all duration-300 ${
        isMinimized ? "bottom-4 h-12" : "bottom-4 max-h-[70vh]"
      }`}
    >
      <CardHeader className="py-2 px-4 flex flex-row items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold">Data Inspector</CardTitle>
          <Badge variant="outline" className="text-xs">
            {storageSize}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={refreshData}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0">
          <Tabs defaultValue="data" className="w-full">
            <TabsList className="w-full rounded-none border-b bg-transparent h-9">
              <TabsTrigger value="data" className="text-xs gap-1 flex-1">
                <HardDrive className="h-3 w-3" />
                Stored Data
              </TabsTrigger>
              <TabsTrigger value="logs" className="text-xs gap-1 flex-1">
                <Activity className="h-3 w-3" />
                Operations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="mt-0">
              <ScrollArea className="h-[45vh]">
                <div className="p-3 space-y-3">
                  {Object.entries(data).length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No data stored yet
                    </p>
                  ) : (
                    Object.entries(data).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs font-mono">
                            {key}
                          </Badge>
                        </div>
                        <pre className="text-xs bg-muted/50 rounded-md p-2 overflow-x-auto text-muted-foreground font-mono">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="logs" className="mt-0">
              <ScrollArea className="h-[45vh]">
                <div className="p-3 space-y-2">
                  {logs.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      No operations logged yet
                    </p>
                  ) : (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-2 p-2 rounded-md bg-muted/30 border border-border/50"
                      >
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono shrink-0 ${
                            operationColors[log.operation]
                          }`}
                        >
                          {log.operation}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {log.collection}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                          {log.data && (
                            <pre className="text-[10px] text-muted-foreground mt-1 truncate font-mono">
                              {JSON.stringify(log.data).slice(0, 50)}...
                            </pre>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}

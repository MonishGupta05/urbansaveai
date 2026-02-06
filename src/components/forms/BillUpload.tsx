import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { backend } from "@/services/backend";
import {
  Upload,
  FileText,
  Image,
  X,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";

interface BillUploadProps {
  onExtract: (data: { consumption: number; billAmount: number }) => void;
}

export function BillUpload({ onExtract }: BillUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    // Simulate OCR analysis
    setIsAnalyzing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock extracted data (random realistic values)
    const mockConsumption = Math.floor(3000 + Math.random() * 5000);
    const mockBillAmount = Math.floor(mockConsumption * 6.5 + Math.random() * 2000);

    await backend.saveBillUpload(
      selectedFile.name,
      selectedFile.type,
      { consumption: mockConsumption, billAmount: mockBillAmount }
    );

    setIsAnalyzing(false);
    setIsExtracted(true);

    onExtract({
      consumption: mockConsumption,
      billAmount: mockBillAmount,
    });
  };

  const removeFile = async () => {
    setFile(null);
    setPreview(null);
    setIsExtracted(false);
  };

  const FileIcon = file?.type === "application/pdf" ? FileText : Image;

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-3">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                isDragging ? "gradient-primary" : "bg-muted"
              }`}
            >
              <Upload
                className={`h-7 w-7 ${
                  isDragging ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              />
            </div>
            <div>
              <p className="font-medium">
                {isDragging ? "Drop your bill here" : "Upload Electricity Bill"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop or click to select (JPG, PNG, PDF)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-4 bg-muted/30">
          <div className="flex items-start gap-4">
            {/* Preview */}
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="Bill preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{file.name}</p>
                {isExtracted && (
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/30 gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Data extracted
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>

              {isAnalyzing && (
                <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing bill with AI...</span>
                </div>
              )}

              {isExtracted && (
                <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                  <Check className="h-4 w-4" />
                  <span>Values auto-filled from bill</span>
                </div>
              )}
            </div>

            {/* Remove button */}
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-8 w-8"
              onClick={removeFile}
              disabled={isAnalyzing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export interface GeneratedImage {
  data: string; // Base64 string
  mimeType: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  result: GeneratedImage | null;
}

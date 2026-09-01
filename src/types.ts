export type BlockType = 'text' | 'code' | 'image' | 'file' | 'link';

export type CodeLanguage = 
  | 'bat' 
  | 'html' 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'css' 
  | 'bash' 
  | 'json' 
  | 'php' 
  | 'sql' 
  | 'cpp' 
  | 'java'
  | 'powershell'
  | 'yaml'
  | 'markdown'
  | 'plain';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // Markdown / formatted content
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  title: string; // e.g. "backup_data.bat" or "index.html"
  language: CodeLanguage;
  code: string;
  showLineNumbers?: boolean;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string; // Google Drive link or direct URL
  caption?: string;
}

export interface FileBlock extends BaseBlock {
  type: 'file';
  title: string; // e.g. "Script_Otomasi_V1.bat" or "Paket_Web_Lengkap.zip"
  url: string; // Google Drive link or direct download URL
  fileSize?: string; // e.g. "1.2 MB" or "15 KB"
  description?: string;
}

export interface LinkBlock extends BaseBlock {
  type: 'link';
  title: string; // e.g. "Dokumentasi Resmi Google Colab"
  url: string; // e.g. "https://colab.research.google.com"
  description?: string; // Optional short summary
}

export type ContentBlock = TextBlock | CodeBlock | ImageBlock | FileBlock | LinkBlock;

export interface Note {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImage?: string; // Google Drive or direct image URL
  fileDownloadUrl?: string; // Direct Google Drive file or source file download
  fileDownloadName?: string; // Custom filename for the direct download
  blocks: ContentBlock[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface AppSettings {
  adminUsername: string;
  adminPasswordHash: string; // Plain/hash for auth
  adminPassword?: string; // Alias for Sheet representation
  googleSheetsWebAppUrl: string;
  isSheetsConnected: boolean;
  lastSyncedAt?: string;
  siteName: string;
  authorName: string;
  theme?: 'light' | 'dark';
  categories?: string[];
}

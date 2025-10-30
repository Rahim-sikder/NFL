import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface FileMeta {
  name: string;
  size: number;
  type: string;
  uri: string;
}

export async function pickImageOrDoc(accept: string[] = ['image/*', 'application/pdf']): Promise<FileMeta | null> {
  try {
    const isImageOnly = accept.every(type => type.startsWith('image/'));
    
    if (isImageOnly) {
      // Use ImagePicker for image-only selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          name: asset.fileName || 'image.jpg',
          size: asset.fileSize || 0,
          type: asset.type || 'image/jpeg',
          uri: asset.uri,
        };
      }
    } else {
      // Use DocumentPicker for mixed file types
      const result = await DocumentPicker.getDocumentAsync({
        type: accept,
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          name: asset.name,
          size: asset.size || 0,
          type: asset.mimeType || 'application/octet-stream',
          uri: asset.uri,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('File picker error:', error);
    return null;
  }
}

export function fileToMeta(file: any): FileMeta {
  return {
    name: file.name || file.fileName || 'unknown',
    size: file.size || file.fileSize || 0,
    type: file.type || file.mimeType || 'application/octet-stream',
    uri: file.uri,
  };
}

export function validateExt(typeOrName: string, allowedExts: string[]): boolean {
  const ext = getFileExtension(typeOrName);
  return allowedExts.includes(ext.toLowerCase());
}

function getFileExtension(typeOrName: string): string {
  // If it's a MIME type
  if (typeOrName.includes('/')) {
    const mimeToExt: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg', // Map image/jpeg to 'jpg' to match validation schema
      'image/jpg': 'jpg',
      'image/webp': 'webp',
      'application/pdf': 'pdf',
    };
    return mimeToExt[typeOrName] || '';
  }
  
  // If it's a filename
  const parts = typeOrName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImageToCloudinary(localUri: string): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured — check EXPO_PUBLIC_CLOUDINARY_* env vars');
  }

  const filename = localUri.split('/').pop() ?? 'upload.jpg';
  const extensionMatch = /\.(\w+)$/.exec(filename);
  const type = extensionMatch ? `image/${extensionMatch[1]}` : 'image/jpeg';

  const formData = new FormData();
  // React Native-এর fetch polyfill এই { uri, name, type } শেপটা file হিসেবে চেনে —
  // এটা আসল web Blob না, তাই টাইপ কাস্ট করতে হয়েছে।
  formData.append('file', { uri: localUri, name: filename, type } as unknown as Blob);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const data = await response.json();
  return data.secure_url as string;
}

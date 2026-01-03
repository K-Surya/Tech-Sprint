// Node.js 22 has built-in fetch, so we don't need to import node-fetch


export const uploadToGoogleDrive = async (file, accessToken, fileName) => {
  const boundary = "Benchmate_Multipart_Boundary_2024";
  const metadata = JSON.stringify({
    name: fileName,
    mimeType: "application/pdf",
  });

  // Construct multipart body
  // Since we are receiving a buffer from multer, we can combine it
  const part1 = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${metadata}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/pdf\r\n\r\n`,
    'utf-8'
  );
  const part2 = file.buffer;
  const part3 = Buffer.from(`\r\n--${boundary}--`, 'utf-8');

  const body = Buffer.concat([part1, part2, part3]);

  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("❌ [Google Drive API Error]:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    const serverMsg = errorData.error?.message || errorData.error || errorData.details || response.statusText;
    throw new Error(serverMsg);
  }

  return await response.json();
};

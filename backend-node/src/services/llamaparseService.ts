import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const BASE = process.env.LLAMA_CLOUD_BASE_URL;
const API_Key = process.env.LLAMA_CLOUD_API_KEY;

const UPLOAD_ENDPOINT = `${BASE}/parsing/upload`;
const JOB_DETAILS = `${BASE}/parsing/job`;
const JOB_RESULT_MARKDOWN = (jobId: string) =>
  `${BASE}/parsing/job/${jobId}/result/markdown`;
const JOB_RESULT_RAW_MD = (jobId: string) =>
  `${BASE}/parsing/job/${jobId}/result/raw/markdown`;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function parseWithLlamaCloud(
  buffer: Buffer,
  filename = "file.pdf",
  opts: { resultType?: string; pageSeparator?: string; timeoutMs?: number } = {}
) {
  if (!buffer || buffer.length === 0) throw new Error("Empty PDF buffer");

  const form = new FormData();
  form.append("file", buffer, { filename, contentType: "application/pdf" });

  form.append("result_type", opts.resultType || "markdown");
  form.append(
    "page_separator",
    opts.pageSeparator || "\n===PAGE {pageNumber}===\n"
  );
  form.append("parse_images", "false");

  const headers = {
    Authorization: `Bearer ${API_Key}`,
    ...form.getHeaders(),
  };

  const uploadResp = await axios.post(UPLOAD_ENDPOINT, form as any, {
    headers,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });
  const data = uploadResp.data || {};
  const jobId =
    data.job_id || data.id || data.job?.id || data.file_id || data.job?.job_id;

  // If direct markdown is returned
  if (
    !jobId &&
    (data.result?.markdown || data.markdown || data.text || data.raw_markdown)
  ) {
    const md =
      data.result?.markdown || data.markdown || data.raw_markdown || data.text;
    return parsePagesFromMarkdown(
      md,
      opts.pageSeparator || "\n===PAGE {pageNumber}===\n"
    );
  }

  if (!jobId) {
    throw new Error(
      "LlamaParse: upload returned no job id. Response keys: " +
        Object.keys(data).join(", ")
    );
  }

  const timeoutMs = opts.timeoutMs || 600000;
  const start = Date.now();
  while (true) {
    const details = await axios
      .get(`${JOB_DETAILS}/${jobId}`, { headers })
      .then((r) => r.data)
      .catch(() => null);
    const status = details?.status || details?.job?.status || details?.state;

    if (
      status === "completed" ||
      status === "SUCCESS" ||
      status === "succeeded" ||
      status === "finished"
    )
      break;
    if (status === "failed" || status === "error")
      throw new Error(`LlamaParse job failed (jobId=${jobId})`);
    if (Date.now() - start > timeoutMs)
      throw new Error(
        `LlamaParse job timeout after ${timeoutMs}ms (jobId=${jobId})`
      );

    await sleep(3000);
  }

  let mdBody: string | undefined;
  try {
    const mdResp = await axios.get(JOB_RESULT_MARKDOWN(jobId), {
      headers,
      responseType: "text",
    });
    mdBody = mdResp.data;
  } catch (err) {
    const mdResp2 = await axios.get(JOB_RESULT_RAW_MD(jobId), {
      headers,
      responseType: "text",
    });
    mdBody = mdResp2.data;
  }

  if (!mdBody) throw new Error("LlamaParse returned empty markdown result");

  return parsePagesFromMarkdown(
    mdBody,
    opts.pageSeparator || "\n===PAGE {pageNumber}===\n"
  );
}

function parsePagesFromMarkdown(
  markdown: string,
  pageSeparatorToken = "\n===PAGE {pageNumber}===\n"
) {
  // The llama cloud often returns JSON string with .markdown field. Try to parse safely.
  // If it's a raw markdown string, handle accordingly.
  let content = markdown;
  try {
    const parsed = JSON.parse(markdown);
    // if parsed has markdown field
    if (parsed && typeof parsed === "object" && parsed.markdown)
      content = parsed.markdown;
  } catch {
    // not JSON, treat as text
    content = markdown;
  }

  const sepPrefix = pageSeparatorToken.split("{pageNumber}")[0];
  const parts = String(content).split(sepPrefix);

  const pages: { page: number; text: string }[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i === 0 && !part.trim()) continue;
    const m = part.match(/^(\d+)===(?:\r?\n)?([\s\S]*)$/);
    if (m) {
      const pageNum = Number(m[1]);
      const text = m[2].trim();
      pages.push({ page: pageNum, text });
    } else {
      const fallbackPage = pages.length + 1;
      if (part && part.trim())
        pages.push({ page: fallbackPage, text: part.trim() });
    }
  }

  return pages.filter((p) => p.text && p.text.length > 0);
}

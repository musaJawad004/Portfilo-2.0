import type { AuthoredArticle } from "../newsletter-articles";

// Restrained, Nothing-style vocabulary: monochrome ink is the canvas, colour is
// an event. Only two accents, and only to encode status:
//   ink  = neutral component (the default)
//   good = success / kept / the recommended path
//   bad  = loss / error / danger
// Defined per-diagram because Mermaid classDefs are diagram-scoped.
const palette = `
    classDef ink fill:#eeede6,stroke:#1c1c1c,color:#1c1c1c;
    classDef good fill:#e8f1ea,stroke:#2f7d3a,color:#1e4025;
    classDef bad fill:#f6e7e3,stroke:#b23124,color:#5f1a12;`;

export const quantizationArticle: AuthoredArticle = {
  slug: "quantization",
  title: "Quantization, Drawn Out",
  excerpt:
    "Why an 8B model eats 16 GB, what actually gets compressed when you drop to 4-bit, and how NF4, GPTQ, AWQ and GGUF each make that trade. With the memory math worked out.",
  readingMinutes: 12,
  blocks: [
    {
      kind: "lead",
      text:
        "You download an 8-billion-parameter model, and before you run a single token it wants **~16 GB** of memory. Your GPU has 12. Quantization is the trick that makes it fit, and the reason your laptop can run a model that shipped for a data center. This is what it actually does to the numbers inside the file.",
    },

    { kind: "h2", text: "Why is an 8B model 16 GB?" },
    {
      kind: "p",
      text:
        "A model is mostly a giant pile of weights, and each weight is a number stored in some precision. The default for shipped weights is 16-bit float (FP16 or BF16), which is **2 bytes per weight**. So the memory is not mysterious, it is just multiplication:",
    },
    {
      kind: "callout",
      tone: "ink",
      label: "the formula",
      text: "bytes = parameters × (bits ÷ 8).  So 8B params × 2 bytes = 16 GB just for the weights.",
    },
    {
      kind: "figure",
      caption:
        "Weights-only memory for an 8B model at each precision. Calculated values (1 GB = 10⁹ bytes), before runtime overhead.",
      diagram: `xychart-beta
    title "Cut the bits, cut the bytes (8B weights)"
    x-axis ["FP32", "FP16", "INT8", "INT4"]
    y-axis "Gigabytes" 0 --> 32
    bar [32, 16, 8, 4]`,
    },
    {
      kind: "p",
      text:
        "Every time you halve the bits per weight, you halve the file. FP32 to FP16 is free-ish and everyone already does it. The interesting move is going below 16, into integers: **INT8 halves it again, INT4 halves it once more.** That 8B model drops from 16 GB to 4 GB, and now it fits.",
    },

    { kind: "h2", text: "What a single number actually costs" },
    {
      kind: "p",
      text:
        "Before compressing anything, it helps to see what these formats are. A float spends its bits on a sign, an exponent (dynamic range), and a mantissa (precision). An integer format throws the floating point away and stores a plain whole number that you rescale later.",
    },
    {
      kind: "table",
      caption: "The precision ladder. FP8 needs recent hardware (H100/H200, MI300) to actually be fast.",
      columns: ["Format", "Bits", "Bytes / weight", "What it is"],
      rows: [
        ["FP32", "32", "4", "Full float. Training-grade, rarely shipped for inference."],
        ["FP16 / BF16", "16", "2", "The usual shipped precision. BF16 keeps FP32's range."],
        ["FP8 (E4M3 / E5M2)", "8", "1", "Float with fewer bits. Great range, needs newer GPUs."],
        ["INT8", "8", "1", "Integer + a scale. ~4× smaller than FP32."],
        ["INT4", "4", "0.5", "16 levels only. Packed two-per-byte. Biggest savings, biggest risk."],
      ],
    },
    {
      kind: "callout",
      tone: "ink",
      label: "note",
      text:
        "INT4 has exactly **16 representable values** (signed, that's −8..7). The whole game of quantization is deciding which 16 real numbers those slots should mean.",
    },

    { kind: "h2", text: "Squeezing floats into a handful of bins" },
    {
      kind: "p",
      text:
        "The standard method is **affine quantization**. You take a group of float weights, find their min and max, and map that range onto the integer range. Two constants define the mapping: a **scale** `S` (how much real value one integer step is worth) and a **zero-point** `Z` (which integer means 0.0).",
    },
    {
      kind: "figure",
      caption:
        "The round trip for one weight. Quantize with q = round(x/S + Z), store the small integer, then dequantize back with x′ ≈ S·(q − Z). The gap between x and x′ is the quantization error.",
      diagram: `flowchart LR
    A["x = 0.734 (fp32)"]:::ink -->|"q = round(x / S + Z)"| C["q = 11 (int4)"]:::ink
    C -->|"x′ = S · (q − Z)"| E["x′ = 0.71"]:::ink
    E -->|"the gap"| R["error = 0.024"]:::bad
${palette}`,
    },
    {
      kind: "p",
      text:
        "Two flavors exist. **Symmetric** assumes the values are centered on zero, so `Z = 0` and you only store a scale. **Asymmetric** stores both `S` and `Z` so it can hug a lopsided range more tightly. The error you saw in red is unavoidable: 16 bins cannot represent every float. The craft is making that error land where the model does not care.",
    },
    {
      kind: "callout",
      tone: "red",
      label: "the tradeoff",
      text:
        "Fewer bits → coarser bins → bigger rounding error → the model's outputs drift. Everything below is about buying back that error cheaply.",
    },

    { kind: "h2", text: "One scale for everything is the rookie mistake" },
    {
      kind: "p",
      text:
        "If you compute a single `S` and `Z` for an entire weight matrix (**per-tensor**), one outlier weight stretches the range and wastes most of your 16 bins on empty space. The fix is **granularity**: compute separate scales for smaller groups.",
    },
    {
      kind: "figure",
      caption:
        "Per-tensor uses one scale for millions of weights. Per-block gives each small group its own scale, so a fat outlier only wrecks its own block. llama.cpp quantizes in blocks of 32; its K-quants nest those inside super-blocks of 256.",
      diagram: `flowchart TB
    subgraph PT["per-tensor · one scale for all"]
      direction LR
      t1["w"]:::ink --- t2["w"]:::ink --- t3["OUTLIER"]:::bad --- t4["w"]:::ink --- t5["w"]:::ink
    end
    subgraph PB["per-block · one scale each"]
      direction LR
      b1["block · scale₁"]:::good --- b2["block · scale₂"]:::good --- b3["block · scale₃"]:::good
    end
    PT -->|"add granularity"| PB
${palette}`,
    },
    {
      kind: "p",
      text:
        "This is why real 4-bit files are never exactly 4 bits per weight. You are also storing a scale (and maybe a zero-point) for every block. Those constants are the difference between the clean `0.5 bytes` math and what actually lands on disk.",
    },

    { kind: "h2", text: "The INT4 packing trick" },
    {
      kind: "p",
      text:
        "Hardware has no native 4-bit type, so two INT4 values get **packed into one byte**: one in the low nibble, one in the high nibble. That is the literal `(v1 & 0x0F) | (v2 << 4)` you'll see in kernels.",
    },
    {
      kind: "figure",
      caption:
        "Two 4-bit weights share a single byte. Loading packed INT4 moves half the bytes of INT8, which is the real win: LLM inference is usually memory-bandwidth bound, so fewer bytes off memory means faster tokens even when the math still happens in FP16.",
      diagram: `flowchart LR
    subgraph BYTE["one byte · 8 bits"]
      direction LR
      L["v₁ · low nibble"]:::ink
      H["v₂ · high nibble"]:::ink
    end
    BYTE -->|"unpack on the fly"| GPU["FP16 compute"]:::ink
${palette}`,
    },
    {
      kind: "callout",
      tone: "ink",
      label: "counter-intuitive",
      text:
        "4-bit is often faster than 8-bit even without 4-bit math units, purely because there are fewer bytes to drag out of VRAM. The bottleneck is memory, not multiply.",
    },

    { kind: "h2", text: "So does 4-bit wreck the model?" },
    {
      kind: "p",
      text:
        "Mostly no, if you do it well. The community-standard evidence comes from llama.cpp's GGUF formats, measured on the same model so the sizes and quality are comparable. Here is Llama-3.1-8B across the common quants:",
    },
    {
      kind: "table",
      caption:
        "Measured on Llama-3.1-8B (llama.cpp). Note the effective bits-per-weight is above the nominal number because of block scales. Q8_0 is effectively lossless; Q4_K_M is the usual sweet spot; below ~3 bpw quality starts to visibly slide.",
      columns: ["GGUF type", "Bits / weight", "Size (GiB)", "Typical use"],
      rows: [
        ["Q2_K", "3.16", "2.95", "Emergency-fit only, quality drops"],
        ["Q3_K_M", "3.99", "3.74", "Tight memory, acceptable"],
        ["**Q4_K_M**", "**4.89**", "**4.58**", "**Default sweet spot**"],
        ["Q5_K_M", "5.70", "5.33", "A little safer than Q4"],
        ["Q6_K", "6.56", "6.14", "Near-FP16 quality"],
        ["Q8_0", "8.50", "7.95", "Effectively lossless baseline"],
        ["F16", "16.00", "14.96", "Unquantized reference"],
      ],
    },
    {
      kind: "p",
      text:
        "See how `Q8_0` is `8.5` bits, not 8? A Q8_0 block stores 32 weights at 8 bits plus one 16-bit scale: `(32×8 + 16) / 32 = 8.5`. The half-bit is the scale, amortized. Same reason Q4_K_M lands near `4.9`, not `4.0`.",
    },

    { kind: "h2", text: "The named recipes: bitsandbytes, GPTQ, AWQ, GGUF" },
    {
      kind: "p",
      text:
        "You rarely implement affine quantization yourself. You pick a method, and each one makes a different bet about calibration data, hardware, and where to spend accuracy.",
    },
    {
      kind: "table",
      caption:
        "The four you'll actually meet. 'Calibration' means it needs a sample dataset to tune the quantization to real activations.",
      columns: ["Method", "Bits", "Calibration?", "The bet it makes"],
      rows: [
        [
          "bitsandbytes",
          "8 / 4 (NF4)",
          "No",
          "Quantize on load, no dataset. The default for QLoRA fine-tuning.",
        ],
        [
          "GPTQ",
          "4 (3/8)",
          "Yes",
          "Quantize each weight row to minimize error using second-order info. Fast GPU kernels.",
        ],
        [
          "AWQ",
          "4",
          "Yes",
          "Protect the ~1% of weights that matter (found via activations), scale the rest.",
        ],
        [
          "GGUF (llama.cpp)",
          "2 → 8",
          "Optional (imatrix)",
          "CPU/Mac/edge friendly, mixed-precision K-quants, huge format zoo.",
        ],
      ],
    },
    {
      kind: "p",
      text:
        "**GPTQ** is post-training: it walks the weight matrix and quantizes it to minimize the output error, restoring weights to FP16 on the fly during inference in a fused kernel. It needs a calibration set (the paper uses C4) and time. Quantizing a 175B model runs about **4 hours on an A100**, which is why you download pre-quantized checkpoints.",
    },
    {
      kind: "p",
      text:
        "**AWQ** starts from a sharp observation: not all weights are equal, and protecting just **~1% of salient weights greatly reduces error.** It finds those weights by looking at the *activations*, not the weights, then scales channels so the important ones survive 4-bit. No backprop, no reconstruction, so it generalizes past its calibration set. Its TinyChat runtime reports **>3× over FP16**, and it won MLSys 2024 best paper.",
    },
    {
      kind: "code",
      lang: "python",
      caption: "Load an 8B model in 4-bit with bitsandbytes (Hugging Face). NF4 + double-quant is the QLoRA default.",
      code: `from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

cfg = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",        # NormalFloat4, not plain int4
    bnb_4bit_use_double_quant=True,   # quantize the scales too
    bnb_4bit_compute_dtype=torch.bfloat16,  # math still runs in bf16
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B-Instruct",
    quantization_config=cfg,
    device_map="auto",
)
# 16 GB of FP16 weights now sit in ~4-5 GB of VRAM.`,
    },

    { kind: "h2", text: "NF4 and the double-quant that saved QLoRA" },
    {
      kind: "p",
      text:
        "Plain INT4 spaces its 16 levels evenly. But trained weights are roughly **normally distributed**, clustered near zero. **NF4 (4-bit NormalFloat)** places its 16 levels so each bin holds equal probability mass under a normal curve, which the QLoRA paper shows is information-theoretically optimal for that shape. More levels near zero where the weights actually live.",
    },
    {
      kind: "figure",
      caption:
        "Double Quantization: after the weights are NF4, the per-block scales are themselves quantized. The QLoRA paper reports this saves ≈0.37 bits per parameter, about 3 GB on a 65B model, with no measured quality loss.",
      diagram: `flowchart TB
    W["FP16 weights"]:::ink -->|"quantize"| N["NF4 weights · 4-bit"]:::good
    N --> S["per-block scales · fp32"]:::ink
    S -->|"quantize again"| DQ["scales stored as 8-bit"]:::ink
    DQ --> R["≈ 0.37 bits/param saved"]:::good
${palette}`,
    },
    {
      kind: "callout",
      tone: "green",
      label: "why it mattered",
      text:
        "These two tricks are what let QLoRA fine-tune a **65B model on a single 48 GB GPU** while matching 16-bit fine-tuning quality. Not a demo, the actual result in the paper.",
    },

    { kind: "h2", text: "Where the memory really goes at run time" },
    {
      kind: "p",
      text:
        "Here is the trap. Quantization shrinks **weights**. But at inference the weights are not the only thing in VRAM. There is the **KV cache**, which grows with context length and batch size, plus activations and framework overhead. Quantizing weights does nothing for those.",
    },
    {
      kind: "figure",
      caption:
        "Weight numbers are calculated for an 8B model; the KV-cache bar is illustrative and scales with context length and batch size. The point: quantizing weights (16 GB → 4 GB) does nothing to the KV cache, which becomes the biggest single consumer at long context.",
      diagram: `xychart-beta
    title "Weight quant shrinks weights, not the KV cache"
    x-axis ["Weights FP16", "Weights INT4", "KV cache long-ctx"]
    y-axis "Gigabytes" 0 --> 16
    bar [16, 4, 9]`,
    },
    {
      kind: "callout",
      tone: "ink",
      label: "so remember",
      text:
        "\"Quantize the model to fit\" only fixes the weights line. If you're serving long contexts, budget for the KV cache separately, or quantize that too.",
    },

    { kind: "h2", text: "Picking a setup without a science project" },
    {
      kind: "p",
      text:
        "You do not need to benchmark all of these. The choice falls out of two questions: are you fine-tuning or serving, and what hardware runs it.",
    },
    {
      kind: "figure",
      caption: "A working default for most people. When quality is non-negotiable, step up to Q6_K/Q8_0 or FP8 and pay the memory.",
      diagram: `flowchart TB
    Q1{"fine-tuning or inference?"}:::ink
    Q1 -->|"fine-tune on one GPU"| BNB["bnb · NF4 + QLoRA"]:::good
    Q1 -->|"inference"| Q2{"what hardware?"}:::ink
    Q2 -->|"NVIDIA · many users"| AWQ["AWQ or GPTQ · 4-bit"]:::ink
    Q2 -->|"laptop / CPU / Mac"| GGUF["GGUF Q4_K_M"]:::good
    Q2 -->|"quality critical"| HI["Q6_K · Q8_0 · FP8"]:::ink
${palette}`,
    },
    {
      kind: "p",
      text:
        "Rule of thumb: start at **Q4_K_M / NF4**, measure your actual task (not perplexity, your task), and only spend more bits if it regresses. Quantization is not lossy-until-proven-safe, it is a dial. Most production LLM serving today runs 4-bit and nobody notices.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Concept guide",
          label: "Hugging Face, Quantization concepts (affine, scale/zero-point, PTQ vs QAT, INT4 packing)",
          url: "https://huggingface.co/docs/transformers/main/en/quantization/concept_guide",
        },
        {
          type: "Original paper",
          label: "Dettmers et al., QLoRA: Efficient Finetuning of Quantized LLMs (NF4, Double Quantization)",
          url: "https://arxiv.org/abs/2305.14314",
        },
        {
          type: "Original paper",
          label: "Lin et al., AWQ: Activation-aware Weight Quantization (MLSys 2024)",
          url: "https://arxiv.org/abs/2306.00978",
        },
        {
          type: "Docs",
          label: "Hugging Face, GPTQ integration (calibration, on-the-fly dequant)",
          url: "https://huggingface.co/docs/transformers/en/quantization/gptq",
        },
        {
          type: "Reference",
          label: "llama.cpp, GGUF quantization types and measured sizes",
          url: "https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md",
        },
      ],
    },
  ],
};

import type { AuthoredArticle } from "../newsletter-articles";

// Same restrained, Nothing-style status palette as the pilot article. Monochrome
// ink is the canvas; colour only encodes status.
//   ink  = neutral component (the default)
//   good = the recommended path / success
//   bad  = the failure / cost / danger
// Defined here because Mermaid classDefs are diagram-scoped.
const palette = `
    classDef ink fill:#eeede6,stroke:#1c1c1c,color:#1c1c1c;
    classDef good fill:#e8f1ea,stroke:#2f7d3a,color:#1e4025;
    classDef bad fill:#f6e7e3,stroke:#b23124,color:#5f1a12;`;

// --------------------------------------------------------------------------
// 1. Flutter isolates
// --------------------------------------------------------------------------
const flutterIsolates: AuthoredArticle = {
  slug: "flutter-isolates",
  title: "Flutter Isolates: Getting Work Off the UI Thread",
  excerpt:
    "Dart runs your whole app on one thread, so one slow JSON parse drops frames. Here is what an isolate actually is, why it copies your data instead of sharing it, and when to reach for one.",
  readingMinutes: 9,
  blocks: [
    {
      kind: "lead",
      text:
        "Your Flutter app has one thread doing the drawing, and Dart hands your code to that same thread. So the moment you parse a **2 MB JSON** response or decode an image synchronously, the UI has nothing to draw and the frame is dropped. Isolates are how you move that work somewhere else. They are not threads, and that difference is the whole story.",
    },

    { kind: "h2", text: "The 16 millisecond budget" },
    {
      kind: "p",
      text:
        "A 60 Hz screen gives you **16.67 ms** per frame. A 120 Hz screen gives you **8.33 ms**. In that window Flutter has to run `build`, lay out, paint, and hand the scene to the GPU. If your Dart code is busy doing something else when the frame is due, the frame is late, and the user sees jank.",
    },
    {
      kind: "p",
      text:
        "`async` and `await` do not help here. Async is for waiting on IO, like a network call or disk read, where the thread is idle anyway. A big `jsonDecode`, a hash, an image resize, or sorting 50k items is **CPU-bound**: the thread is not idle, it is working, and awaiting it changes nothing. That is exactly the work an isolate is for.",
    },
    {
      kind: "callout",
      tone: "ink",
      label: "the rule",
      text:
        "Use async for work that waits. Use an isolate for work that computes. Awaiting a CPU-bound function still blocks the UI thread.",
    },

    { kind: "h2", text: "An isolate is a separate heap, not a shared thread" },
    {
      kind: "p",
      text:
        "In most languages a background thread shares memory with the main thread, which is why threads come with locks and data races. Dart made a different choice. Each isolate has its **own memory heap and its own event loop**, and isolates cannot touch each other's objects. They communicate only by passing messages through ports, and the message is **copied**.",
    },
    {
      kind: "figure",
      caption:
        "The main isolate sends the raw payload to a worker, the worker parses it, and sends the result back. Both the input and the output are copied across the port boundary. No shared references, so no locks and no data races, but you pay for the copy.",
      diagram: `sequenceDiagram
    participant UI as Main isolate (UI)
    participant W as Worker isolate
    UI->>W: SendPort: raw 2 MB string (copied)
    Note over W: jsonDecode + map to models<br/>runs off the UI thread
    W-->>UI: ReceivePort: parsed list (copied)
    Note over UI: frames kept rendering<br/>the whole time`,
    },
    {
      kind: "p",
      text:
        "That copy is the cost you are trading against. Moving a huge object to an isolate, doing five microseconds of work, and moving it back can be slower than just doing it inline. Isolates win when the compute clearly dominates the copy: parsing, decoding, compression, crypto, and large transforms.",
    },

    { kind: "h2", text: "The one-liner: Isolate.run" },
    {
      kind: "p",
      text:
        "Since Dart 2.19 you rarely wire up ports by hand. `Isolate.run` spawns a short-lived isolate, runs your function, returns the result as a `Future`, and shuts the isolate down. Flutter's older `compute` helper does the same thing. The function you pass must be top-level or static, because a closure that captures UI state cannot be copied across the boundary.",
    },
    {
      kind: "code",
      lang: "dart",
      caption:
        "Parsing off the UI thread. The heavy jsonDecode + mapping runs in a throwaway isolate, and the UI thread only wakes up to receive the finished list.",
      code: `// Top-level function: no captured state, safe to ship to an isolate.
List<Article> _parseArticles(String body) {
  final raw = jsonDecode(body) as List<dynamic>;
  return raw
      .map((j) => Article.fromJson(j as Map<String, dynamic>))
      .toList();
}

Future<List<Article>> loadArticles(String body) {
  // Runs _parseArticles in a background isolate, awaits the result.
  return Isolate.run(() => _parseArticles(body));
}`,
    },
    {
      kind: "callout",
      tone: "green",
      label: "do this",
      text:
        "Reach for Isolate.run when a synchronous call would take more than a frame (~16 ms). Keep the function pure and the payload as small as you can.",
    },

    { kind: "h2", text: "When an isolate is the wrong tool" },
    {
      kind: "table",
      caption:
        "The decision is really about whether the work waits or computes, and whether the copy is worth it.",
      columns: ["Work", "Right tool", "Why"],
      rows: [
        ["Network / file / DB read", "async + await", "The thread is idle while waiting, no isolate needed"],
        ["Decode a large JSON payload", "Isolate.run", "CPU-bound, blocks the UI thread if inline"],
        ["Resize or encode an image", "Isolate.run", "Heavy CPU, dominates the copy cost"],
        ["Update a counter, small map", "inline", "Copy overhead is larger than the work"],
        ["Continuous background stream", "long-lived isolate", "Amortize spawn cost across many messages"],
      ],
    },
    {
      kind: "p",
      text:
        "If you find yourself spawning an isolate inside a tight loop, you have the granularity wrong. Batch the work so each isolate call does something substantial, or keep a long-lived isolate alive and feed it messages through a port. Spawning has a real fixed cost, so a per-item isolate is usually slower than doing the loop inline.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "Flutter, Concurrency and isolates",
          url: "https://docs.flutter.dev/perf/isolates",
        },
        {
          type: "Docs",
          label: "Dart, Isolates and concurrent programming",
          url: "https://dart.dev/language/concurrency",
        },
        {
          type: "API",
          label: "Dart, Isolate.run",
          url: "https://api.dart.dev/stable/dart-isolate/Isolate/run.html",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 2. Flutter jank
// --------------------------------------------------------------------------
const flutterJank: AuthoredArticle = {
  slug: "flutter-jank",
  title: "Flutter Jank Is a Rebuild Problem",
  excerpt:
    "Most Flutter stutter is not the GPU. It is a build method that runs too often and rebuilds too much. Here is the frame pipeline, the two threads that matter, and the fixes that are basically free.",
  readingMinutes: 8,
  blocks: [
    {
      kind: "lead",
      text:
        "When a Flutter list stutters, the instinct is to blame the device or the framework. Open DevTools and the truth is usually duller: a `build` method near the top of the tree runs on every frame and rebuilds a subtree that did not change. Jank is mostly a rebuild-scope problem, and the fixes cost almost nothing.",
    },

    { kind: "h2", text: "Two threads, one budget" },
    {
      kind: "p",
      text:
        "Every frame runs across two threads. The **UI thread** runs your Dart: `build`, layout, and painting instructions. The **raster thread** turns those instructions into pixels on the GPU. Both have to finish inside the frame budget, **16.67 ms** at 60 Hz. DevTools colours them separately, and that colour tells you where to look.",
    },
    {
      kind: "figure",
      caption:
        "The frame pipeline. Build and layout and paint run on the UI thread; rasterizing runs on the raster thread. A jank spike is red on exactly one of them, and that tells you whether the fix is in your widgets or in expensive painting.",
      diagram: `flowchart LR
    B["build()<br/>your Dart"]:::ink --> L["layout"]:::ink
    L --> P["paint"]:::ink
    P --> R["rasterize<br/>GPU"]:::ink
    B -.->|"long here"| U["fix widgets<br/>+ rebuild scope"]:::good
    R -.->|"long here"| G["fix painting<br/>opacity, clips, saveLayer"]:::bad
${palette}`,
    },
    {
      kind: "p",
      text:
        "If the UI thread is the slow one, you are rebuilding or laying out too much. If the raster thread is slow, you are painting something expensive: `Opacity` over a big subtree, an unnecessary `ClipRRect`, shadows, or an explicit `saveLayer`. The two problems have completely different fixes, so read the thread first.",
    },

    { kind: "h2", text: "setState is a scope decision" },
    {
      kind: "p",
      text:
        "`setState` marks the whole enclosing `State` dirty, so its entire `build` runs again. Put it high in the tree and you rebuild everything below it 60 times a second. The fix is to push the changing state **down** into the smallest widget that actually depends on it, so the rebuild touches a leaf instead of a page.",
    },
    {
      kind: "code",
      lang: "dart",
      caption:
        "The const on the children is the fix. Flutter skips rebuilding const subtrees entirely, so an animating parent no longer drags a static header and footer through build on every frame.",
      code: `@override
Widget build(BuildContext context) {
  return Column(
    children: const [
      // const: built once, reused every frame, never rebuilt.
      _ExpensiveHeader(),
      _StaticFooter(),
    ],
  );
}`,
    },
    {
      kind: "callout",
      tone: "green",
      label: "free wins",
      text:
        "const constructors, ListView.builder instead of a full ListView, and splitting big widgets into smaller ones. None of these need a package, and all three cut rebuild work.",
    },

    { kind: "h2", text: "Build a list lazily or pay for the whole thing" },
    {
      kind: "p",
      text:
        "`ListView(children: [...])` builds every child up front, even the thousands off-screen. `ListView.builder` builds only what is visible plus a small cache, so scrolling a 10k-row list costs the same as scrolling a 20-row one. This single swap is the most common fix for a list that hitches on the first scroll.",
    },
    {
      kind: "figure",
      caption:
        "UI-thread time per frame on a long list, before and after switching to ListView.builder and adding const. Illustrative shape, but the direction is what happens in practice: the eager build blows the 16 ms budget, the lazy build stays under it.",
      diagram: `xychart-beta
    title "Frame time on a 10k-row list (UI thread, ms)"
    x-axis ["ListView eager", "+ builder", "+ const children", "budget"]
    y-axis "Milliseconds" 0 --> 40
    bar [34, 12, 9, 16]`,
    },

    { kind: "h2", text: "Measure, do not guess" },
    {
      kind: "p",
      text:
        "Turn on the performance overlay (`showPerformanceOverlay: true`) or the DevTools timeline and reproduce the stutter. Profile in **profile mode**, never debug: debug builds are unoptimized and will lie to you about timings. Find the red frames, read which thread is red, and fix that. Guessing at optimizations usually adds complexity and helps nothing.",
    },
    {
      kind: "callout",
      tone: "red",
      label: "watch for",
      text:
        "Opacity and ClipRRect around large or animating subtrees are common raster-thread traps. Prefer AnimatedOpacity on a small widget, or bake the effect into the child, over wrapping a whole page.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "Flutter, Performance best practices",
          url: "https://docs.flutter.dev/perf/best-practices",
        },
        {
          type: "Docs",
          label: "Flutter, Using the performance view (DevTools)",
          url: "https://docs.flutter.dev/tools/devtools/performance",
        },
        {
          type: "Docs",
          label: "Flutter, Understanding the frame rendering pipeline",
          url: "https://docs.flutter.dev/perf/ui-performance",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 3. Flutter architecture
// --------------------------------------------------------------------------
const flutterArchitecture: AuthoredArticle = {
  slug: "flutter-architecture",
  title: "Flutter Architecture: Layers Before Libraries",
  excerpt:
    "Before you argue about Provider versus Bloc versus Riverpod, draw the layers. Flutter's own guidance is a plain layered app with unidirectional data flow, and the state library is a detail inside one layer.",
  readingMinutes: 8,
  blocks: [
    {
      kind: "lead",
      text:
        "Every Flutter architecture debate starts in the wrong place: which state management package to use. The package is a detail. What actually keeps an app maintainable is the **layering**, and Flutter's official architecture guidance is refreshingly boring about it: separate the UI from the data, make data flow one direction, and keep your widgets dumb.",
    },

    { kind: "h2", text: "Two layers, four roles" },
    {
      kind: "p",
      text:
        "The guide splits an app into a **UI layer** and a **data layer**. The UI layer holds Views (widgets) and ViewModels (the logic and state for a screen). The data layer holds Repositories (the source of truth for a kind of data) and Services (thin wrappers over an API or platform). Each role has one job, and nothing skips a layer.",
    },
    {
      kind: "figure",
      caption:
        "Unidirectional flow. The View reads state from its ViewModel and sends events back up. The ViewModel talks only to Repositories, and Repositories talk only to Services. A widget never calls an API directly, which is what keeps screens testable.",
      diagram: `flowchart TB
    V["View · widget"]:::ink -->|"events"| VM["ViewModel · screen state"]:::good
    VM -->|"state"| V
    VM --> R["Repository · source of truth"]:::ink
    R --> S["Service · API / platform"]:::ink
    S --> API["Backend / SDK"]:::ink
${palette}`,
    },
    {
      kind: "p",
      text:
        "The direction is the point. A View reads state and emits events. It never reaches past its ViewModel to call a Repository, and it never touches a Service. When that rule holds, you can test a ViewModel with a fake Repository, swap a Service without touching a screen, and reason about where a bug lives by which layer owns the data.",
    },

    { kind: "h2", text: "The ViewModel owns the screen, the widget just draws" },
    {
      kind: "p",
      text:
        "A widget should be close to a pure function of its state. All the interesting decisions, loading, error handling, retries, formatting for display, live in the ViewModel. This is why the state package barely matters: `ChangeNotifier`, Riverpod, and Bloc are all just different ways to hold ViewModel state and notify the View. Pick one and move on.",
    },
    {
      kind: "table",
      caption:
        "Each layer has one responsibility. The test in the last column is the fastest way to catch a layering violation in review.",
      columns: ["Layer", "Owns", "Must never"],
      rows: [
        ["View", "Layout and user events", "Call a Repository or Service directly"],
        ["ViewModel", "Screen state and logic", "Import a widget or BuildContext into logic"],
        ["Repository", "The truth for one data type", "Know which screen is asking"],
        ["Service", "One API or platform channel", "Contain business rules"],
      ],
    },

    { kind: "h2", text: "The Repository is where truth lives" },
    {
      kind: "p",
      text:
        "Repositories are the boundary between your app and the messy outside world. They decide what is cached, when to refetch, how to merge a local and a remote source, and what shape the rest of the app sees. Two screens showing the same user should read from **one** Repository, so they never disagree. When a screen has stale data, the Repository is almost always where the fix belongs.",
    },
    {
      kind: "callout",
      tone: "green",
      label: "the payoff",
      text:
        "Get the layers right and the state library becomes swappable. Get the layers wrong and no state library will save you, because your logic is trapped inside widgets.",
    },

    { kind: "h2", text: "Start small, add layers when they earn it" },
    {
      kind: "p",
      text:
        "A three-screen app does not need repositories for everything on day one. The value of the structure is that it **scales without a rewrite**: you begin with Views and ViewModels, and introduce Repositories and Services the moment a data source gets shared or complicated. The layering is a direction to grow in, not a checklist to fill on the first commit.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "Flutter, App architecture guide",
          url: "https://docs.flutter.dev/app-architecture",
        },
        {
          type: "Docs",
          label: "Flutter, Architecture case study (compose UI, data, logic)",
          url: "https://docs.flutter.dev/app-architecture/case-study",
        },
        {
          type: "Docs",
          label: "Flutter, State management options",
          url: "https://docs.flutter.dev/data-and-backend/state-mgmt/options",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 4. React Native new architecture
// --------------------------------------------------------------------------
const rnNewArchitecture: AuthoredArticle = {
  slug: "react-native-new-architecture",
  title: "React Native's New Architecture, in Plain Terms",
  excerpt:
    "The old bridge serialized every native call to JSON and sent it across async. The New Architecture replaces it with JSI, so JavaScript can call C++ directly and synchronously. Here is what actually changed and why it matters.",
  readingMinutes: 9,
  blocks: [
    {
      kind: "lead",
      text:
        "For years React Native's biggest bottleneck had a name: the bridge. Every call between JavaScript and native code was serialized to JSON, queued, and sent across asynchronously. The New Architecture, default since React Native **0.76**, removes the bridge and lets JavaScript hold direct references to native objects. That one change reshapes how the whole framework behaves.",
    },

    { kind: "h2", text: "What the bridge cost you" },
    {
      kind: "p",
      text:
        "The old model had three problems baked in. Everything was **asynchronous**, so JavaScript could not synchronously read a native value. Everything was **serialized to JSON**, so passing large or frequent data was expensive. And the bridge was a **single batched queue**, so a flood of messages (fast scrolling, gestures) could congest it and drop frames.",
    },
    {
      kind: "figure",
      caption:
        "Old versus new. The bridge turned every call into a JSON message across an async queue. JSI gives JavaScript a direct, synchronous handle to C++ host objects, so a layout read or a native method call no longer round-trips through serialization.",
      diagram: `flowchart TB
    subgraph OLD["Old · the bridge"]
      direction LR
      J1["JS"]:::ink -->|"JSON, async, batched"| BR["Bridge queue"]:::bad
      BR -->|"JSON, async"| N1["Native"]:::ink
    end
    subgraph NEW["New · JSI"]
      direction LR
      J2["JS"]:::ink -->|"direct C++ call, sync"| JSI["JSI host objects"]:::good
      JSI --> N2["Native"]:::ink
    end
    OLD -->|"0.76 makes new the default"| NEW
${palette}`,
    },

    { kind: "h2", text: "The four pieces with the scary names" },
    {
      kind: "p",
      text:
        "The New Architecture is really four cooperating parts. **JSI** (JavaScript Interface) is the C++ layer that lets JS call native directly. **TurboModules** are native modules loaded lazily on first use, built on JSI. **Fabric** is the new renderer, so layout can be read and committed synchronously. **Codegen** generates the typed C++ glue from your TypeScript specs so the two sides stay in sync.",
    },
    {
      kind: "table",
      caption:
        "The old name, the new name, and the practical difference you feel as a developer.",
      columns: ["Old", "New", "What changes"],
      rows: [
        ["Bridge (JSON queue)", "JSI (direct C++)", "Synchronous calls, no serialization tax"],
        ["Native Modules (eager)", "TurboModules (lazy)", "Faster startup, modules load on first use"],
        ["Paper renderer", "Fabric renderer", "Synchronous layout, concurrent React features"],
        ["Hand-written glue", "Codegen", "Typed interfaces, mismatches caught at build"],
      ],
    },
    {
      kind: "callout",
      tone: "green",
      label: "why it matters",
      text:
        "Synchronous layout is what unlocks React 18 concurrent features and Suspense in React Native. That was effectively impossible while everything had to cross an async bridge.",
    },

    { kind: "h2", text: "Bridgeless, and what you actually have to do" },
    {
      kind: "p",
      text:
        "React Native 0.76 turned on **bridgeless mode** by default: the bridge is gone entirely, not just bypassed. For most app developers the upgrade is mostly free, because the framework and popular libraries already speak the new interfaces. The work lands on **library authors**, who migrate native modules to TurboModules and views to Fabric with Codegen specs.",
    },
    {
      kind: "p",
      text:
        "The practical checklist for an app team is short: move to a recent React Native, update native dependencies to versions that support the New Architecture, and watch for any library still stuck on the old bridge. The interop layer keeps most legacy modules working during the transition, but a very old, unmaintained native module is the thing most likely to block you.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "React Native, About the New Architecture",
          url: "https://reactnative.dev/architecture/landing-page",
        },
        {
          type: "Docs",
          label: "React Native, Why a New Architecture",
          url: "https://reactnative.dev/architecture/xplat-implementation",
        },
        {
          type: "Blog",
          label: "React Native 0.76: New Architecture by default",
          url: "https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 5. React Native Hermes
// --------------------------------------------------------------------------
const rnHermes: AuthoredArticle = {
  slug: "react-native-hermes",
  title: "Hermes and the React Native Startup Budget",
  excerpt:
    "Hermes compiles your JavaScript to bytecode at build time instead of parsing it on the phone at launch. That is why it exists: to cut the time from tap to interactive. Here is the mechanism and the tradeoff.",
  readingMinutes: 7,
  blocks: [
    {
      kind: "lead",
      text:
        "A cold app launch is a budget nobody hands you, and the user spends it staring at a splash screen. A big chunk of that budget in React Native used to go to **parsing JavaScript on the device** every single launch. Hermes, the default engine since React Native 0.70, moves that work to build time. That is the entire pitch, and it is a good one.",
    },

    { kind: "h2", text: "Parse once at build, not every launch" },
    {
      kind: "p",
      text:
        "A normal JavaScript engine ships source text to the phone, then parses and compiles it at startup before anything runs. Hermes flips the order: at build time it compiles your bundle to **Hermes bytecode** (`.hbc`), and the phone loads bytecode it can execute almost immediately. The expensive parse happens on your CI machine once, not on every user's device every time.",
    },
    {
      kind: "figure",
      caption:
        "Where the compile happens. With Hermes, Metro bundles your JS and hermesc turns it into bytecode during the build. The device just memory-maps and runs it, which is why time-to-interactive drops.",
      diagram: `flowchart LR
    SRC["Your JS / TS"]:::ink --> METRO["Metro bundler"]:::ink
    METRO --> HC["hermesc<br/>(build time)"]:::good
    HC --> HBC["Hermes bytecode .hbc"]:::good
    HBC -->|"shipped in the app"| DEV["Device: mmap + run"]:::ink
${palette}`,
    },
    {
      kind: "figure",
      caption:
        "Illustrative time-to-interactive on a cold start. Directional, but it matches the pattern Hermes was built to produce: the on-device parse cost is gone because it already happened at build time.",
      diagram: `xychart-beta
    title "Cold start time-to-interactive (relative)"
    x-axis ["Legacy JSC", "Hermes bytecode"]
    y-axis "Relative TTI" 0 --> 100
    bar [100, 62]`,
    },

    { kind: "h2", text: "No JIT, and why that is fine here" },
    {
      kind: "p",
      text:
        "Hermes is ahead-of-time only: it has **no JIT compiler**. On a server that would be a real downside, because a JIT eventually optimizes hot loops beyond interpreted bytecode. But a mobile UI app spends most of its time idle waiting for input, and the wins that actually matter are **startup time and memory**, both of which favor small bytecode and no JIT warmup. It is a deliberate trade for the mobile shape of work.",
    },
    {
      kind: "table",
      caption:
        "The three numbers Hermes moves. All improve for a typical UI app; raw compute throughput is the one place a JIT engine could pull ahead.",
      columns: ["Metric", "Effect", "Why"],
      rows: [
        ["Time to interactive", "Lower", "No on-device parse; bytecode runs immediately"],
        ["Memory usage", "Lower", "Bytecode is compact and memory-mapped"],
        ["App download size", "Lower", "Bytecode is smaller than shipped source"],
        ["Peak compute throughput", "Neutral to lower", "No JIT to optimize hot loops"],
      ],
    },
    {
      kind: "callout",
      tone: "ink",
      label: "debugging note",
      text:
        "Because Hermes runs bytecode, you debug it through the Hermes debugger over the Chrome DevTools protocol, and stack traces rely on source maps. Ship source maps with your release builds or production crash reports will be unreadable.",
    },

    { kind: "h2", text: "What you actually configure" },
    {
      kind: "p",
      text:
        "On a current React Native, Hermes is already on, so the practical work is verification, not setup. Confirm it is enabled, measure your cold start with and without it if you are curious, and make sure your **source map upload** is wired into the release build so crashes map back to your code. If a dependency ships code Hermes cannot compile, that is your signal to check the bundle, but for the vast majority of apps this is a solved default you simply keep.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "React Native, Using Hermes",
          url: "https://reactnative.dev/docs/hermes",
        },
        {
          type: "Docs",
          label: "Hermes, JavaScript engine documentation",
          url: "https://hermesengine.dev/",
        },
        {
          type: "Docs",
          label: "React Native, Profiling and startup performance",
          url: "https://reactnative.dev/docs/performance",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 6. Node.js event loop
// --------------------------------------------------------------------------
const nodeEventLoop: AuthoredArticle = {
  slug: "nodejs-event-loop",
  title: "The Node.js Event Loop Is Your Real Bottleneck",
  excerpt:
    "Node runs your JavaScript on one thread. So one slow, synchronous handler does not just slow itself down, it stalls every other request on the server. Here are the loop phases and how to keep them moving.",
  readingMinutes: 9,
  blocks: [
    {
      kind: "lead",
      text:
        "Node.js can handle thousands of concurrent connections on a single thread, which sounds like magic until you write one synchronous `for` loop that runs for 200 ms. Now every other request waits behind it. The event loop is what makes Node fast and what makes that mistake so expensive, so it is worth understanding what it actually does.",
    },

    { kind: "h2", text: "One thread runs your code, libuv runs the waiting" },
    {
      kind: "p",
      text:
        "Your JavaScript executes on **one thread**. When you start IO (a query, a file read, an HTTP call), Node hands it to **libuv**, which uses the operating system and a small worker pool to do the waiting off that thread. When the IO finishes, its callback is queued back onto the loop. So Node is not doing many things at once; it is never sitting idle while waiting.",
    },
    {
      kind: "figure",
      caption:
        "The loop cycles through phases forever. Timers fire due callbacks, poll picks up completed IO, check runs setImmediate. Between every phase Node drains the microtask queue (promises) and process.nextTick.",
      diagram: `flowchart LR
    T["timers<br/>setTimeout"]:::ink --> PC["pending<br/>callbacks"]:::ink
    PC --> PO["poll<br/>IO callbacks"]:::ink
    PO --> CH["check<br/>setImmediate"]:::ink
    CH --> CL["close<br/>callbacks"]:::ink
    CL -->|"loop again"| T
    PO -.->|"between phases"| MT["microtasks<br/>promises + nextTick"]:::good
${palette}`,
    },
    {
      kind: "p",
      text:
        "The phase details matter less than the shape: the loop keeps turning as long as each callback returns quickly. Promises and `process.nextTick` are drained **between** phases, before the loop moves on, which is why a runaway recursive `nextTick` can starve the loop even though it looks async.",
    },

    { kind: "h2", text: "Blocking the loop blocks everyone" },
    {
      kind: "p",
      text:
        "Because there is one thread, a **CPU-bound** or synchronous call inside a request handler freezes the entire server for its duration. `JSON.parse` on a huge payload, `bcrypt` on the sync path, a big `Array.sort`, `fs.readFileSync`, or a regex with catastrophic backtracking: each one is a request that finishes by making all the others late.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption:
        "The top version blocks the loop for the whole hash, so concurrent requests stall. The bottom version moves the CPU work to a worker thread, keeping the loop free to serve everyone else.",
      code: `// BAD: synchronous CPU work on the event loop thread.
app.post("/hash", (req, res) => {
  const digest = expensiveHashSync(req.body.data); // blocks all requests
  res.json({ digest });
});

// GOOD: offload CPU-bound work to a worker thread.
import { Worker } from "node:worker_threads";

app.post("/hash", (req, res) => {
  const worker = new Worker("./hash-worker.js", { workerData: req.body.data });
  worker.once("message", (digest) => res.json({ digest }));
  worker.once("error", (err) => res.status(500).json({ error: String(err) }));
});`,
    },
    {
      kind: "callout",
      tone: "red",
      label: "the trap",
      text:
        "async does not make CPU work non-blocking. Awaiting a synchronous 200 ms function still holds the thread for 200 ms. async only helps when the work is IO that libuv can wait on for you.",
    },

    { kind: "h2", text: "Keep handlers short, offload the heavy stuff" },
    {
      kind: "table",
      caption:
        "The fix depends on whether the work waits or computes, the same split that governs all single-threaded runtimes.",
      columns: ["Work", "Fix", "Mechanism"],
      rows: [
        ["Database / HTTP / file IO", "Use the async API", "libuv waits off-thread"],
        ["Hashing, crypto, compression", "worker_threads", "Real OS thread for CPU work"],
        ["Big JSON parse / transform", "Stream or worker", "Chunk it or move it off the loop"],
        ["A slow endpoint under load", "Queue + background job", "Return fast, process out of band"],
      ],
    },
    {
      kind: "callout",
      tone: "green",
      label: "measure it",
      text:
        "Watch event loop lag (perf_hooks.monitorEventLoopDelay). If p99 loop delay climbs under load, a handler is doing synchronous work it should be offloading. Loop lag is the single most useful Node health metric.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "Node.js, The event loop, timers, and process.nextTick",
          url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
        },
        {
          type: "Docs",
          label: "Node.js, Do not block the event loop",
          url: "https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop",
        },
        {
          type: "Docs",
          label: "Node.js, Worker threads",
          url: "https://nodejs.org/api/worker_threads.html",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 7. Node streams / backpressure
// --------------------------------------------------------------------------
const nodeStreams: AuthoredArticle = {
  slug: "nodejs-streams-backpressure",
  title: "Node Streams and the Backpressure You're Ignoring",
  excerpt:
    "If you read faster than you write, the difference piles up in memory until the process falls over. Backpressure is the flow-control signal that stops that, and pipeline() gives it to you for free.",
  readingMinutes: 8,
  blocks: [
    {
      kind: "lead",
      text:
        "Copy a 4 GB file by reading it all into a buffer and your process dies. Stream it and it copies in constant memory. The difference is **backpressure**: the writable side telling the readable side to slow down. Get this wrong and a service that passed every test in development falls over the first time a real, large payload arrives.",
    },

    { kind: "h2", text: "Producer, buffer, consumer" },
    {
      kind: "p",
      text:
        "A stream pipeline has a producer (a Readable), a consumer (a Writable), and a bounded buffer between them called the **high water mark**. The consumer usually cannot keep up: disk and network are slower than reading from memory. When the buffer fills, someone has to tell the producer to pause, or the buffer grows without limit and takes the heap with it.",
    },
    {
      kind: "figure",
      caption:
        "The backpressure signal. write() returns false when the internal buffer is full; the producer pauses, and resumes only after the writable emits drain. That handshake keeps memory bounded no matter how large the source is.",
      diagram: `sequenceDiagram
    participant R as Readable (source)
    participant W as Writable (sink)
    R->>W: write(chunk)
    W-->>R: true (buffer has room)
    R->>W: write(chunk)
    W-->>R: false (buffer full, slow down)
    Note over R: pause reading
    Note over W: flush to disk / socket
    W-->>R: 'drain' event
    Note over R: resume reading`,
    },
    {
      kind: "p",
      text:
        "The `false` return from `write` is the whole mechanism. It means the buffer is full, stop pushing, wait for `drain`. Ignore that return value and keep writing, and you have manually defeated backpressure: chunks queue in memory faster than they leave. This is the classic Node memory leak that only shows up under real load.",
    },

    { kind: "h2", text: "pipe and pipeline do it for you" },
    {
      kind: "p",
      text:
        "You almost never handle `drain` by hand. `pipe` and the newer `pipeline` wire the backpressure handshake automatically, so the producer pauses and resumes correctly without any bookkeeping from you. `pipeline` also propagates errors and cleans up every stream in the chain, which manual `pipe` chains famously forget to do, leaking file descriptors on failure.",
    },
    {
      kind: "code",
      lang: "javascript",
      caption:
        "pipeline handles backpressure, error propagation, and cleanup across the whole chain. This gzips a large file in constant memory, and if any stage fails, every stream is destroyed.",
      code: `import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";

// Constant memory regardless of file size; backpressure is automatic.
await pipeline(
  createReadStream("huge.log"),   // producer
  createGzip(),                   // transform
  createWriteStream("huge.log.gz"), // consumer
);
// On any error, pipeline destroys all three streams for you.`,
    },
    {
      kind: "callout",
      tone: "red",
      label: "avoid",
      text:
        "await response.text() or reading a whole upload into a Buffer defeats streaming. Memory now scales with payload size, so one large request can take down the process. Stream through instead of buffering whole.",
    },

    { kind: "h2", text: "When streaming is the right call" },
    {
      kind: "table",
      caption:
        "Streaming wins whenever the data can be larger than you want to hold at once, or when you want the consumer to start before the producer finishes.",
      columns: ["Situation", "Buffer whole?", "Better"],
      rows: [
        ["File copy / transform", "No", "pipeline of read to write"],
        ["Proxying an upload", "No", "pipe request to upstream"],
        ["Large CSV import", "No", "Stream + parse row by row"],
        ["Small JSON config", "Yes, fine", "Read fully, it is tiny"],
      ],
    },
    {
      kind: "callout",
      tone: "green",
      label: "default",
      text:
        "Reach for stream/promises pipeline any time data flows from one place to another. It is the version that handles backpressure, errors, and cleanup, which is exactly the three things hand-rolled pipes get wrong.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "Node.js, Backpressuring in streams",
          url: "https://nodejs.org/en/learn/modules/backpressuring-in-streams",
        },
        {
          type: "Docs",
          label: "Node.js, Stream API (pipeline, high water mark)",
          url: "https://nodejs.org/api/stream.html",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 8. FastAPI async
// --------------------------------------------------------------------------
const fastapiAsync: AuthoredArticle = {
  slug: "fastapi-async",
  title: "FastAPI Async: Where await Actually Helps",
  excerpt:
    "FastAPI runs async def on the event loop and plain def in a threadpool. Put a blocking database call in an async def and you stall every request. The rule for choosing is simpler than it looks.",
  readingMinutes: 8,
  blocks: [
    {
      kind: "lead",
      text:
        "FastAPI gives you a choice on every endpoint: `async def` or plain `def`. Pick wrong and you either leave performance on the table or, worse, block the whole event loop with a synchronous database driver inside an `async def`. The mechanism that decides which is right is worth ten minutes, because it is the difference between a server that scales and one that mysteriously freezes under load.",
    },

    { kind: "h2", text: "Two paths through the server" },
    {
      kind: "p",
      text:
        "FastAPI runs on ASGI (usually Uvicorn), which has an event loop. An `async def` path operation runs **directly on that loop**. A plain `def` path operation is run in an **external threadpool** so it cannot block the loop. Starlette sizes that pool with AnyIO's default capacity limiter of **40 threads**. Both paths work; they just have different failure modes.",
    },
    {
      kind: "figure",
      caption:
        "The routing decision. async def runs on the event loop, which is great for async IO and fatal for blocking calls. def is dispatched to a worker thread, which safely absorbs blocking work at the cost of a bounded thread pool.",
      diagram: `flowchart TB
    REQ["Incoming request"]:::ink --> Q{"async def<br/>or def?"}:::ink
    Q -->|"async def"| EL["Event loop<br/>(one thread)"]:::good
    Q -->|"def"| TP["Threadpool<br/>(~40 threads)"]:::ink
    EL -->|"blocking call here"| BAD["Loop frozen<br/>for every request"]:::bad
    TP -->|"blocking call here"| OK["Only ties up<br/>one worker"]:::ink
${palette}`,
    },

    { kind: "h2", text: "The one rule that prevents the freeze" },
    {
      kind: "p",
      text:
        "Inside an `async def`, you may only `await` things or run fast, non-blocking code. The instant you call a **synchronous blocking** function there, a classic `psycopg2` query, `requests.get`, `time.sleep`, `open().read()` on a big file, you block the single event loop thread and every concurrent request stalls behind it. That is the freeze people report as FastAPI being slow, and it is really a blocking call in the wrong place.",
    },
    {
      kind: "code",
      lang: "python",
      caption:
        "Three correct choices. Async IO belongs in async def. Blocking IO belongs in plain def so FastAPI runs it in the threadpool. Never put a blocking call directly in an async def.",
      code: `# GOOD: async def with an async driver (asyncpg, httpx.AsyncClient).
@app.get("/users/{id}")
async def get_user(id: int):
    return await db.fetch_one("SELECT ... WHERE id = :id", {"id": id})

# GOOD: blocking driver? Use plain def, FastAPI runs it in the threadpool.
@app.get("/report/{id}")
def build_report(id: int):
    return blocking_orm_query(id)  # safe: not on the event loop

# BAD: blocking call inside async def freezes the loop for everyone.
@app.get("/bad/{id}")
async def bad(id: int):
    return blocking_orm_query(id)  # do not do this`,
    },
    {
      kind: "callout",
      tone: "red",
      label: "the mistake",
      text:
        "async def with a synchronous database driver is the most common FastAPI performance bug. If your driver is not async, use plain def and let the threadpool handle it.",
    },

    { kind: "h2", text: "A short decision table" },
    {
      kind: "table",
      caption:
        "Match the endpoint style to the kind of work. When in doubt with a blocking library, plain def is the safe default.",
      columns: ["Your endpoint does", "Use", "Reason"],
      rows: [
        ["await async IO (asyncpg, httpx)", "async def", "Runs efficiently on the event loop"],
        ["Blocking DB / requests / file IO", "def", "Threadpool keeps the loop free"],
        ["Pure CPU work (parsing, ML)", "def + offload", "Threads or a separate worker process"],
        ["Mix, but driver is sync", "def", "Safer than blocking the loop"],
      ],
    },
    {
      kind: "p",
      text:
        "Async is not automatically faster. It is faster for **IO-bound** work when you have async libraries all the way down. If your stack is synchronous, honest plain `def` endpoints on the threadpool will serve you well, and you can migrate to async drivers later without rewriting your routes.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "FastAPI, Concurrency and async / await",
          url: "https://fastapi.tiangolo.com/async/",
        },
        {
          type: "Docs",
          label: "Starlette, Threadpool and run_in_threadpool",
          url: "https://www.starlette.io/threadpool/",
        },
        {
          type: "Docs",
          label: "AnyIO, Capacity limiters (default worker threads)",
          url: "https://anyio.readthedocs.io/en/stable/threads.html",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 9. CI pipeline speed
// --------------------------------------------------------------------------
const ciSpeed: AuthoredArticle = {
  slug: "ci-pipeline-speed",
  title: "A CI Pipeline Nobody Waits For",
  excerpt:
    "Slow CI is a tax every engineer pays on every push. Caching, parallelism, and cancelling stale runs are the three levers that turn a 20 minute pipeline into a 5 minute one, without changing a single test.",
  readingMinutes: 8,
  blocks: [
    {
      kind: "lead",
      text:
        "A 20 minute CI pipeline is not a build detail, it is a productivity tax. Every push pays it, context is lost while people wait, and slow feedback quietly pushes teams toward larger, riskier batches. The good news: most of that 20 minutes is repeated work and idle waiting, and three levers remove it without touching your actual tests.",
    },

    { kind: "h2", text: "Lever one: stop reinstalling the same dependencies" },
    {
      kind: "p",
      text:
        "The single biggest waste in most pipelines is reinstalling identical dependencies on every run. Cache them, keyed by a hash of the lockfile, and restore the cache instead. The install step goes from minutes to seconds, and the cache only rebuilds when the lockfile actually changes, which is exactly when it should.",
    },
    {
      kind: "code",
      lang: "yaml",
      caption:
        "Cache keyed by the lockfile hash. Change a dependency and the key changes, so the cache rebuilds; otherwise every run restores in seconds.",
      code: `- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-\${{ runner.os }}-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      npm-\${{ runner.os }}-
# setup-node and similar actions have this built in via 'cache: npm'.`,
    },

    { kind: "h2", text: "Lever two: run independent work in parallel" },
    {
      kind: "p",
      text:
        "Lint, unit tests, integration tests, and type checks usually have no reason to run one after another. Split them into jobs that run at the same time, and shard a large test suite across several runners. The pipeline's wall-clock time drops to the length of its **slowest** job, not the sum of all of them.",
    },
    {
      kind: "figure",
      caption:
        "Sequential stages add up; parallel jobs collapse to the slowest one. A matrix or sharded test split turns a long serial chain into a short fan-out that fans back in at the merge gate.",
      diagram: `flowchart LR
    subgraph SEQ["Sequential · add it all up"]
      direction LR
      s1["lint"]:::bad --> s2["unit"]:::bad --> s3["integration"]:::bad --> s4["types"]:::bad
    end
    subgraph PAR["Parallel · slowest one wins"]
      direction TB
      p1["lint"]:::good
      p2["unit shard 1"]:::good
      p3["unit shard 2"]:::good
      p4["types"]:::good
    end
    SEQ -->|"fan out"| PAR
${palette}`,
    },
    {
      kind: "figure",
      caption:
        "Illustrative wall-clock time as the levers stack. Directional, but the ordering is what teams see in practice: caching kills the install, parallelism collapses the serial chain.",
      diagram: `xychart-beta
    title "Pipeline wall-clock time (minutes)"
    x-axis ["Baseline", "+ cache", "+ parallel", "+ cancel stale"]
    y-axis "Minutes" 0 --> 22
    bar [20, 13, 6, 5]`,
    },

    { kind: "h2", text: "Lever three: cancel work you no longer need" },
    {
      kind: "p",
      text:
        "Push twice to the same branch and the first run is now pointless, yet it keeps burning a runner to the end. A concurrency group that cancels superseded runs frees that capacity for the run you actually care about. On a busy repo this alone can halve the time you wait for a runner to even become available.",
    },
    {
      kind: "code",
      lang: "yaml",
      caption:
        "Cancel in-progress runs for the same branch when a newer commit arrives. Frees runners and gets your latest push to the front of the queue.",
      code: `concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true`,
    },
    {
      kind: "callout",
      tone: "green",
      label: "order of attack",
      text:
        "Cache first (biggest, easiest win), then parallelize the independent jobs, then add concurrency cancellation. Reserve heavier machines only for the jobs that are genuinely CPU-bound.",
    },

    { kind: "h2", text: "Keep it honest" },
    {
      kind: "p",
      text:
        "Fast CI is only useful if it still catches what it should. Do not reach speed by silently skipping tests or letting flaky ones auto-retry into green. Split the suite so the fast, high-signal checks gate the merge, and run slower end-to-end suites in parallel or on a schedule. The goal is quick feedback on real failures, not a green check that means nothing.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "GitHub Actions, Caching dependencies to speed up workflows",
          url: "https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/caching-dependencies-to-speed-up-workflows",
        },
        {
          type: "Docs",
          label: "GitHub Actions, Using a matrix for your jobs",
          url: "https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow",
        },
        {
          type: "Docs",
          label: "GitHub Actions, Control concurrency",
          url: "https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 10. Progressive delivery
// --------------------------------------------------------------------------
const progressiveDelivery: AuthoredArticle = {
  slug: "progressive-delivery",
  title: "Progressive Delivery: Ship to 1% First",
  excerpt:
    "Deploying to everyone at once means every bug is a full outage. Canary releases, feature flags, and automatic rollback shrink the blast radius so a bad change hits 1% of traffic, not all of it.",
  readingMinutes: 8,
  blocks: [
    {
      kind: "lead",
      text:
        "The riskiest moment in software is the deploy that flips 100% of traffic to new code at once. If it is broken, everyone is affected, and your only move is a panicked rollback. Progressive delivery replaces that cliff with a ramp: send the new version to a sliver of traffic, watch it, and widen only if it stays healthy.",
    },

    { kind: "h2", text: "Blast radius is the whole idea" },
    {
      kind: "p",
      text:
        "Every deployment strategy is really a choice about **blast radius**: how many users a bad release can hurt before you catch it. A big-bang deploy has a blast radius of everyone. A canary that starts at 1% has a blast radius of 1%. You are not eliminating risk, you are capping how much of it lands at once, and buying time to react.",
    },
    {
      kind: "figure",
      caption:
        "A canary rollout as a state machine. Traffic ramps 1 to 10 to 50 to 100 percent, and health metrics gate each step. Any failed check routes straight back to the old version, so a regression is contained to the current slice.",
      diagram: `flowchart TB
    D["Deploy new version"]:::ink --> C1["1% traffic"]:::ink
    C1 -->|"metrics healthy"| C2["10% traffic"]:::ink
    C2 -->|"healthy"| C3["50% traffic"]:::ink
    C3 -->|"healthy"| C4["100% · promoted"]:::good
    C1 -->|"error rate up"| RB["Rollback"]:::bad
    C2 -->|"latency up"| RB
    C3 -->|"regression"| RB
${palette}`,
    },
    {
      kind: "p",
      text:
        "The arrows into rollback are the part that makes this safe. Each step is gated on real signals, error rate, latency, saturation, and a failed gate routes traffic back to the known-good version automatically. Without automated gates you have just made a manual deploy slower; the value is in the machine watching and reacting faster than a human can.",
    },

    { kind: "h2", text: "Three strategies, three tradeoffs" },
    {
      kind: "table",
      caption:
        "The common patterns. They differ in how traffic shifts, how fast you can roll back, and how much extra capacity you pay for.",
      columns: ["Strategy", "How traffic moves", "Rollback", "Cost"],
      rows: [
        ["Rolling", "Replace instances gradually", "Reverse the roll", "Low, no duplicate fleet"],
        ["Blue-green", "Flip all at once to a warm copy", "Instant flip back", "High, two full fleets"],
        ["Canary", "Ramp a small % upward", "Route the slice back", "Medium, partial overlap"],
      ],
    },
    {
      kind: "callout",
      tone: "ink",
      label: "canary vs blue-green",
      text:
        "Blue-green gives you an instant rollback but tests new code on 100% of traffic the moment you flip. Canary limits exposure during the test but rolls back a bit slower. Many teams combine them.",
    },

    { kind: "h2", text: "Feature flags separate deploy from release" },
    {
      kind: "p",
      text:
        "The most useful move is to stop conflating **deploy** (code is on the servers) with **release** (users can see it). Ship the code dark behind a flag, then turn it on for 1% of users independently of any deploy. Now a rollback is a config change measured in seconds, not a redeploy, and you can target the rollout by cohort, region, or account.",
    },
    {
      kind: "callout",
      tone: "green",
      label: "the discipline",
      text:
        "Automate the gate and the rollback. A canary that needs a human watching a dashboard at 2am is not progressive delivery, it is just a slower outage. Define the metrics and the abort threshold before you ship.",
    },

    { kind: "h2", text: "Where to start" },
    {
      kind: "p",
      text:
        "You do not need a service mesh to begin. Start by splitting deploy from release with a flag on one risky feature, define the two or three metrics that would tell you it is going wrong, and wire an automatic off-switch to those metrics. That single loop, ship dark, ramp on health, abort on regression, is the core of progressive delivery, and everything fancier is an optimization on top of it.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "Google Cloud, Application deployment and testing strategies",
          url: "https://cloud.google.com/architecture/application-deployment-and-testing-strategies",
        },
        {
          type: "Reference",
          label: "Martin Fowler, Blue-green deployment and canary release",
          url: "https://martinfowler.com/bliki/CanaryRelease.html",
        },
        {
          type: "Reference",
          label: "DORA, Deployment automation and progressive delivery",
          url: "https://dora.dev/capabilities/deployment-automation/",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 11. Database indexing
// --------------------------------------------------------------------------
const dbIndexing: AuthoredArticle = {
  slug: "database-indexing",
  title: "Indexes Are the Query Plan You Control",
  excerpt:
    "Without the right index the database reads every row; with it, it jumps straight to the ones you want. Here is how a B-tree turns a scan into a lookup, and how to read EXPLAIN so you actually know which happened.",
  readingMinutes: 9,
  blocks: [
    {
      kind: "lead",
      text:
        "A query that runs in 5 ms on your laptop and 5 seconds in production is almost never a code problem. It is a missing index, and the database is reading every row in the table to answer you. Indexes are the one part of the query plan you directly control, and reading `EXPLAIN` is how you find out whether the planner is scanning or seeking.",
    },

    { kind: "h2", text: "Scan versus seek" },
    {
      kind: "p",
      text:
        "Without a useful index, a filter like `WHERE email = ?` forces a **sequential scan**: read all N rows, keep the matches. That is O(N), and it gets linearly worse as the table grows. A B-tree index on `email` turns the same query into a **seek**: navigate the tree in roughly O(log N) and jump to the matching rows. On a million-row table that is the difference between reading a million rows and reading about twenty tree nodes.",
    },
    {
      kind: "figure",
      caption:
        "Same query, two plans. No index means read every row and filter. A B-tree index means descend the tree to the matching key. The planner picks a scan when no index helps, or when the filter matches most of the table anyway.",
      diagram: `flowchart TB
    Q["WHERE email = ?"]:::ink --> C{"useful index?"}:::ink
    C -->|"no"| SEQ["Seq scan<br/>read all N rows · O(N)"]:::bad
    C -->|"yes"| IDX["Index seek<br/>descend B-tree · O(log N)"]:::good
${palette}`,
    },
    {
      kind: "code",
      lang: "sql",
      caption:
        "EXPLAIN ANALYZE tells you which plan ran and what it cost. 'Seq Scan' on a large filtered table is your signal to add an index; 'Index Scan' or 'Index Only Scan' means the planner is seeking.",
      code: `-- Before: watch for "Seq Scan on users" with a high row count.
EXPLAIN ANALYZE
SELECT id, name FROM users WHERE email = 'a@b.com';

-- Add the index the query needs.
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);

-- After: the plan should now show "Index Scan using idx_users_email".`,
    },

    { kind: "h2", text: "Composite indexes and the leftmost prefix" },
    {
      kind: "p",
      text:
        "A composite index on `(tenant_id, created_at)` is ordered first by `tenant_id`, then by `created_at` within each tenant. It can serve `WHERE tenant_id = ?`, and `WHERE tenant_id = ? ORDER BY created_at`, because both use the **leftmost prefix**. It cannot efficiently serve `WHERE created_at = ?` alone, because the second column is only sorted inside each value of the first. Column order is a design decision, not a detail.",
    },
    {
      kind: "callout",
      tone: "green",
      label: "index-only scan",
      text:
        "If an index contains every column a query needs (a covering index), the database answers from the index alone and never touches the table. In Postgres this shows up as 'Index Only Scan', and it is often the fastest plan available.",
    },

    { kind: "h2", text: "The index types you will actually meet" },
    {
      kind: "table",
      caption:
        "Postgres index types by the query shape they serve. B-tree is the default and the right answer most of the time.",
      columns: ["Type", "Best for", "Example"],
      rows: [
        ["B-tree", "Equality and range, sorting", "WHERE id = ?, ORDER BY created_at"],
        ["Hash", "Equality only", "WHERE token = ?"],
        ["GIN", "Contains, arrays, JSONB, full text", "WHERE tags @> '{ai}'"],
        ["GiST", "Geometric, nearest-neighbor", "geospatial, range types"],
        ["BRIN", "Huge, naturally ordered tables", "append-only time-series"],
      ],
    },

    { kind: "h2", text: "Indexes are not free" },
    {
      kind: "p",
      text:
        "Every index you add has to be **updated on every write**, so it makes inserts, updates, and deletes a little slower and costs disk. This is why indexing every column is a mistake: you slow down writes to speed up reads that may never happen. Index the columns you actually filter, join, and sort on, watch for unused indexes, and drop the ones no query uses.",
    },
    {
      kind: "callout",
      tone: "ink",
      label: "in production",
      text:
        "Build indexes with CREATE INDEX CONCURRENTLY so you do not take a long write lock on a live table. It is slower to build, but it does not block the traffic you are trying to speed up.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "PostgreSQL, Indexes",
          url: "https://www.postgresql.org/docs/current/indexes.html",
        },
        {
          type: "Docs",
          label: "PostgreSQL, Using EXPLAIN",
          url: "https://www.postgresql.org/docs/current/using-explain.html",
        },
        {
          type: "Reference",
          label: "Markus Winand, Use the Index, Luke",
          url: "https://use-the-index-luke.com/",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------------------
// 12. Database migrations
// --------------------------------------------------------------------------
const dbMigrations: AuthoredArticle = {
  slug: "database-migrations",
  title: "Zero-Downtime Migrations Are a Sequencing Problem",
  excerpt:
    "You cannot change a live schema in one step without breaking the code that is still running. Expand-and-contract splits the change into safe, backward-compatible stages so old and new code coexist while you migrate.",
  readingMinutes: 9,
  blocks: [
    {
      kind: "lead",
      text:
        "The database is the one part of your stack you cannot just redeploy. During a rollout, old code and new code run against the **same schema at the same time**, so any change that only one version understands is an outage waiting to happen. Zero-downtime migration is not a magic tool, it is a sequencing discipline: expand, migrate, then contract.",
    },

    { kind: "h2", text: "Why one-step changes break" },
    {
      kind: "p",
      text:
        "Rename a column from `name` to `full_name` in a single migration and the moment it lands, every running instance of the old code queries a column that no longer exists. Errors until the deploy finishes. The same trap hits dropping a column still referenced, or adding a `NOT NULL` column with no default. The schema changed out from under code that was still live.",
    },
    {
      kind: "callout",
      tone: "red",
      label: "never in one step",
      text:
        "Renames and drops are the classic outage. Old and new code overlap during every rollout, so a destructive change breaks whichever version did not expect it. Split it across deploys instead.",
    },

    { kind: "h2", text: "Expand, migrate, contract" },
    {
      kind: "p",
      text:
        "The pattern that makes changes safe is **parallel change**, usually called expand-and-contract. First expand the schema additively so both old and new code work. Then migrate the data and move the code to the new shape. Only once nothing reads the old shape do you contract and remove it. Each stage is backward-compatible on its own, so a rollback at any point is safe.",
    },
    {
      kind: "figure",
      caption:
        "A column rename done safely. Add the new column, backfill and dual-write so both stay in sync, ship code that reads the new one, then drop the old column once no code references it. Every arrow is a separate, reversible deploy.",
      diagram: `flowchart LR
    E["EXPAND<br/>add full_name (nullable)"]:::good --> B["BACKFILL<br/>copy + dual-write both"]:::ink
    B --> S["SWITCH<br/>code reads full_name"]:::ink
    S --> C["CONTRACT<br/>drop name column"]:::good
${palette}`,
    },
    {
      kind: "p",
      text:
        "Dual-writing during the middle stage is the trick that keeps both columns valid while code is mixed. New writes update both `name` and `full_name`; a backfill job copies the history. Only after every instance reads `full_name` and nothing writes `name` is it safe to contract. The old column is deleted last, when removing it can no longer surprise anyone.",
    },

    { kind: "h2", text: "Locks are the other half" },
    {
      kind: "p",
      text:
        "Even a safe logical change can cause an outage if it takes a heavy lock on a big table. Some operations rewrite the whole table or block writes for the duration. Modern Postgres has made many of these cheap, adding a column with a constant default is metadata-only since version 11, but a volatile default or a new `NOT NULL` still forces a rewrite or a full scan. Know which operations lock before you run them on a live table.",
    },
    {
      kind: "table",
      caption:
        "Risky operation on the left, safe sequence on the right. The safe versions avoid long locks and keep old code working during the rollout.",
      columns: ["Risky", "Safe alternative"],
      rows: [
        ["Rename a column", "Add new, backfill, dual-write, switch, drop old"],
        ["Add NOT NULL column", "Add nullable, backfill, then add the constraint"],
        ["CREATE INDEX on a live table", "CREATE INDEX CONCURRENTLY"],
        ["Drop a column immediately", "Stop using it, deploy, drop in a later migration"],
        ["Change a column type in place", "Add a new column of the new type, migrate, swap"],
      ],
    },
    {
      kind: "code",
      lang: "sql",
      caption:
        "Adding a required column without a rewrite or a long lock: nullable first, backfill in batches, validate the constraint separately so the table is not locked while it checks.",
      code: `-- 1. Expand: nullable, no rewrite, no long lock.
ALTER TABLE orders ADD COLUMN currency text;

-- 2. Backfill in batches (so one statement does not lock everything).
UPDATE orders SET currency = 'USD' WHERE currency IS NULL AND id BETWEEN 1 AND 10000;
-- ... repeat over ranges ...

-- 3. Add the constraint without a blocking full-table check, then validate.
ALTER TABLE orders ADD CONSTRAINT currency_not_null CHECK (currency IS NOT NULL) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT currency_not_null;`,
    },
    {
      kind: "callout",
      tone: "green",
      label: "the mindset",
      text:
        "Treat a schema change as a small project with stages, not a single SQL statement. If you cannot roll back the deploy that ships it without breaking data, it is not zero-downtime yet.",
    },

    {
      kind: "sources",
      items: [
        {
          type: "Docs",
          label: "PostgreSQL, ALTER TABLE (locking and rewrites)",
          url: "https://www.postgresql.org/docs/current/sql-altertable.html",
        },
        {
          type: "Reference",
          label: "Martin Fowler, ParallelChange (expand and contract)",
          url: "https://martinfowler.com/bliki/ParallelChange.html",
        },
        {
          type: "Reference",
          label: "Stripe, Online migrations at scale",
          url: "https://stripe.com/blog/online-migrations",
        },
      ],
    },
  ],
};

export const addedArticles: AuthoredArticle[] = [
  flutterIsolates,
  flutterJank,
  flutterArchitecture,
  rnNewArchitecture,
  rnHermes,
  nodeEventLoop,
  nodeStreams,
  fastapiAsync,
  ciSpeed,
  progressiveDelivery,
  dbIndexing,
  dbMigrations,
];

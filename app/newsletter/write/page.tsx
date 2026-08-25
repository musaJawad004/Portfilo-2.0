import { requireChatGPTUser } from "../../chatgpt-auth";
import { NewsletterHeader } from "../NewsletterHeader";
import { NewsletterWriteForm } from "./NewsletterWriteForm";

export const metadata = { title: "Write an issue" };

export default async function WriteNewsletterPage() {
  const user = await requireChatGPTUser("/newsletter/write");
  return <div className="mmn-shell"><NewsletterHeader/><main className="mmn-write"><header><span className="mmn-kicker">COMMUNITY DESK / SIGNED IN</span><h1>Publish a field note.</h1><p>Write something another builder can use. Clear problem, honest tradeoffs, concrete architecture, and a useful conclusion.</p></header><NewsletterWriteForm author={user.displayName}/></main><footer className="mmn-footer"><a href="/newsletter">← HOME</a><span>COMMUNITY PUBLISHING</span></footer></div>;
}

import { PageTitle } from "@/components/PageTitle";
import { WelcomeMessage } from "@/components/WelcomeMessage";

export default function Home() {
  return (
    <div>
      <PageTitle>Hello there 👋</PageTitle>
      <WelcomeMessage />
    </div>
  );
}

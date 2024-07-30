import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p>Choose demo with specific Uniswap SDK:</p>
      <ul>
        <li><Link href="/v2">V2 SDK</Link></li>
      </ul>
    </main>
  );
}

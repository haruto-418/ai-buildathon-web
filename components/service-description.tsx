import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import { buttonVariants } from "./ui/button";

export function ServiceDescription() {
  const content = [
    {
      title: {
        ja: "営業業務引き継ぎの効率化",
        en: "Streamlined Handover of Sales Tasks",
      },
      problem: {
        ja: "営業担当者の退職や異動時に、引き継ぎが不十分で業務効率が低下するリスクがあります。",
        en: "There is a risk of decreased efficiency due to insufficient handovers when sales representatives resign or transfer.",
      },
      solution: {
        ja: "AI技術を活用して、営業業務の知識やノウハウを自動的に収集・整理。これにより、包括的で正確な引き継ぎ資料を迅速に作成し、引き継ぎプロセスを効率化します。",
        en: "Using AI technology, sales knowledge and expertise are automatically gathered and organized. This allows for the rapid creation of comprehensive and accurate handover materials, streamlining the process.",
      },
    },
    {
      title: {
        ja: "個々の営業活動のサポート",
        en: "Support for Individual Sales Activities",
      },
      problem: {
        ja: "営業担当者が業務に慣れるまでに時間がかかり、個々のパフォーマンスが低下する可能性があります。",
        en: "It takes time for sales representatives to become accustomed to their tasks, potentially lowering individual performance.",
      },
      solution: {
        ja: "AIが各営業担当者の「コパイロット」として機能し、リアルタイムで提案やアドバイスを提供。これにより、個々の営業活動を強力にサポートします。",
        en: "AI acts as a 'co-pilot' for each sales representative, offering real-time suggestions and advice to strongly support individual activities.",
      },
    },
    {
      title: {
        ja: "企業の営業業務全体のサポート",
        en: "Support for Company-wide Sales Operations",
      },
      problem: {
        ja: "営業活動が個々の担当者に依存しており、組織全体としての効率化や最適化が難しい。",
        en: "Sales activities rely heavily on individual representatives, making organizational efficiency and optimization difficult.",
      },
      solution: {
        ja: "AIが企業全体の営業業務を分析・学習し、組織的な営業戦略の策定やプロセス改善を支援。データに基づいた意思決定を可能にし、営業チーム全体のパフォーマンスを最適化します。",
        en: "AI analyzes and learns from company-wide sales operations, supporting organizational strategies and process improvements to optimize the team's overall performance.",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-2 py-4 md:w-11/12 md:px-4 md:py-8">
      <header className="mb-10 text-center">
        <h1 className="text-2xl font-bold">
          業務をAIが完全に代替します / AI Fully Replaces Business Operations
        </h1>
        <div
          className={cn(
            buttonVariants({}),
            "mt-4 rounded-full bg-teal-500 px-8 py-6 text-lg font-bold text-white",
          )}
        >
          <SignInButton />
        </div>
      </header>
      <main className="space-y-12">
        {content.map((section, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 gap-6 rounded-lg bg-white p-6 shadow-md md:grid-cols-2"
          >
            <div>
              <h2 className="text-2xl font-semibold text-teal-500">
                {section.title.ja}
              </h2>
              <p className="mt-4 text-gray-600">
                <strong>課題:</strong> {section.problem.ja}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>ソリューション:</strong> {section.solution.ja}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-teal-500">
                {section.title.en}
              </h2>
              <p className="mt-4 text-gray-600">
                <strong>Problem:</strong> {section.problem.en}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Solution:</strong> {section.solution.en}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
